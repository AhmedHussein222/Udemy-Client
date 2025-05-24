import React, { useState, useEffect, useRef } from "react";
import {
  Fab,
  Modal,
  Box,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import HistoryIcon from "@mui/icons-material/History";
import ChatIcon from "@mui/icons-material/Chat";
import { db, auth } from "../../Firebase/firebase";
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ChatModal = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Current user:", currentUser ? currentUser.uid : "No user");
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setChatHistory([]);
      setPendingMessages([]);
      return;
    }

    const q = query(
      collection(db, "chatHistory"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const history = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Firestore history:", history);
        setChatHistory(history);
        setPendingMessages([]);
      },
      (error) => {
        console.error("Firestore error:", error);
      }
    );
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, pendingMessages]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setShowHistory(false);
  };
  const handleToggleHistory = () => setShowHistory(!showHistory);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    if (!user) {
      alert("You need to log in to send messages!");
      return;
    }

    const userMessage = {
      role: "user",
      content: message,
      userId: user.uid,
      timestamp: new Date(),
    };

    setPendingMessages((prev) => [...prev, { ...userMessage, id: `pending-${Date.now()}` }]);
    setMessage("");

    try {
      await addDoc(collection(db, "chatHistory"), userMessage);

      const aiResponse = await fetchChatResponse(message);
      const aiMessage = {
        role: "ai",
        content: aiResponse,
        userId: user.uid,
        timestamp: new Date(),
      };

      setPendingMessages((prev) => [
        ...prev,
        { ...aiMessage, id: `pending-ai-${Date.now()}` },
      ]);

      await addDoc(collection(db, "chatHistory"), aiMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message, please try again later!");
      setPendingMessages((prev) => prev.filter((msg) => msg.id !== `pending-${Date.now()}`));
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    maxWidth: "95%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
    display: "flex",
    flexDirection: "row",
    maxHeight: "85vh",
  };

  const chatContainerStyle = {
    flex: showHistory ? 0.65 : 1,
    maxHeight: 450,
    overflowY: "auto",
    mb: 2,
    p: 2,
    bgcolor: "#fafafa",
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
  };

  const historyContainerStyle = {
    flex: 0.35,
    maxHeight: 450,
    overflowY: "auto",
    p: 2,
    bgcolor: "#f5f5f5",
    borderLeft: "1px solid #e0e0e0",
    display: showHistory ? "block" : "none",
  };

  const fabStyle = {
    position: "fixed",
    bottom: 20,
    right: 20,
    backgroundColor: "#8000ff",
    color: "white",
    "&:hover": {
      backgroundColor: "#6b00d6",
    },
  };


  const displayedMessages = [...chatHistory, ...pendingMessages].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  return (
    <div>
      <Fab sx={fabStyle} onClick={handleOpen}>
        <ChatIcon />
      </Fab>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
                AI Chat
              </Typography>
              <IconButton onClick={handleToggleHistory}>
                <HistoryIcon />
              </IconButton>
            </Box>
            {!user && (
              <Typography color="error" sx={{ mb: 2 }}>
                You need to log in to use the chat feature!
              </Typography>
            )}
            <Box sx={chatContainerStyle} ref={chatContainerRef}>
              {displayedMessages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    mb: 1.5,
                    p: 1.5,
                    maxWidth: "70%",
                    bgcolor: msg.role === "user" ? "#8000ff" : "#e0e0e0",
                    color: msg.role === "user" ? "white" : "black",
                    borderRadius:
                      msg.role === "user"
                        ? "15px 15px 15px 0" 
                        : "15px 15px 0 15px", 
                    alignSelf: msg.role === "user" ? "flex-start" : "flex-end", 
                    boxShadow: 1,
                    mx: 1,
                  }}
                >
                  <Typography variant="body1">{msg.content}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                label="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                variant="outlined"
                size="small"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={!user}
              />
              <IconButton sx={{ color: "#8000ff" }} onClick={handleSendMessage} disabled={!user}>
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={historyContainerStyle}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Chat History
            </Typography>
            <List>
              {displayedMessages.length === 0 ? (
                <Typography>No history found</Typography>
              ) : (
                displayedMessages
                  .filter((msg) => msg.role === "user")
                  .map((msg) => {
                    const response = displayedMessages.find(
                      (res) =>
                        res.role === "ai" &&
                        res.timestamp > msg.timestamp &&
                        res.userId === msg.userId
                    );
                    return (
                      <ListItem key={msg.id} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <ListItemText
                          primary={msg.content}
                          secondary={response ? response.content : "No response yet"}
                          primaryTypographyProps={{ fontWeight: "medium" }}
                          secondaryTypographyProps={{ color: "text.secondary" }}
                        />
                      </ListItem>
                    );
                  })
              )}
            </List>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

const fetchChatResponse = async (message) => {
  try {
    console.log("API Key:", import.meta.env.VITE_OPENROUTER_API_KEY);
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "My Chat App",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("There was a problem with the API response");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "There was a problem connecting to the AI, please try again!";
  }
};

export default ChatModal;