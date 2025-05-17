import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Pusher from "pusher-js/react-native";

const pusher = new Pusher("58ab18132d7b54c96638", { cluster: "eu" });
const BACKEND_ADDRESS = "https://chatapp-backend-ten-inky.vercel.app";

export default function ChatScreen({ navigation, route: { params } }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const scrollViewRef = useRef();

  useEffect(() => {
    fetch(`${BACKEND_ADDRESS}/users/${params.username}`, { method: "PUT" });

    const subscription = pusher.subscribe("chat");
    subscription.bind("message", handleReceiveMessage);

    return () => {
      fetch(`${BACKEND_ADDRESS}/users/${params.username}`, {
        method: "DELETE",
      });
      subscription.unbind_all();
      subscription.unsubscribe();
    };
  }, [params.username]);

  useEffect(() => {
    // Scroll automatiquement à chaque nouveau message
    const timeout = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  const handleReceiveMessage = (data) => {
    setMessages((prevMessages) => [...prevMessages, data]);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const payload = {
      text: messageText,
      username: params.username,
      createdAt: new Date(),
      id: Math.floor(Math.random() * 100000),
    };

    fetch(`${BACKEND_ADDRESS}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setMessageText("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <View style={styles.banner}>
          <MaterialIcons
            name="keyboard-backspace"
            color="#ffffff"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.greetingText}>Welcome {params.username} 👋</Text>
        </View>

        <View style={styles.inset}>
          <ScrollView
            style={styles.scroller}
            ref={scrollViewRef}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((message, i) => (
              <View
                key={i}
                style={[
                  styles.messageWrapper,
                  message.username === params.username
                    ? styles.messageSent
                    : styles.messageRecieved,
                ]}
              >
                <Text style={styles.timeText}>{message.username}</Text>
                <View
                  style={[
                    styles.message,
                    message.username === params.username
                      ? styles.messageSentBg
                      : styles.messageRecievedBg,
                  ]}
                >
                  <Text style={styles.messageText}>{message.text}</Text>
                </View>
                <Text style={styles.timeText}>
                  {new Date(message.createdAt).getHours()}:
                  {String(new Date(message.createdAt).getMinutes()).padStart(
                    2,
                    "0"
                  )}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={setMessageText}
            value={messageText}
            style={styles.input}
            autoFocus
            placeholder="Type a message..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.recordButton}>
            <MaterialIcons name="mic" color="#ffffff" size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.sendButton}
          >
            <MaterialIcons name="send" color="#ffffff" size={24} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    position: "relative",
  },
  inset: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: "#ffffff",
    width: "100%",
    paddingTop: 20,
    borderTopColor: "#ffe099",
    borderLeftColor: "#ffe099",
    borderRightColor: "#ffe099",
    borderTopWidth: 4,
    borderRightWidth: 0.1,
    borderLeftWidth: 0.1,
    marginBottom: 80, // Espace pour l'input en bas
  },
  banner: {
    width: "100%",
    height: "15%",
    paddingTop: 20,
    paddingLeft: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  greetingText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 15,
  },
  scroller: {
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
  },
  messageWrapper: {
    marginBottom: 20,
  },
  message: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    maxWidth: "65%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 6.41,
    elevation: 1.2,
  },
  messageSent: {
    alignSelf: "flex-end",
  },
  messageRecieved: {
    alignSelf: "flex-start",
  },
  messageSentBg: {
    backgroundColor: "#ffad99",
  },
  messageRecievedBg: {
    backgroundColor: "#d6fff9",
  },
  messageText: {
    color: "#506568",
    fontWeight: "400",
  },
  timeText: {
    color: "#506568",
    opacity: 0.5,
    fontSize: 10,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  input: {
    backgroundColor: "#f0f0f0",
    width: "60%",
    padding: 14,
    borderRadius: 30,
  },
  recordButton: {
    borderRadius: 50,
    padding: 16,
    backgroundColor: "#ff5c5c",
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    borderRadius: 50,
    padding: 16,
    backgroundColor: "#ffe099",
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});