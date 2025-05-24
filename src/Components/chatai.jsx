import React, { useState, useEffect, useRef } from "react";
import {
  Button,
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
import { db, auth } from "../Firebase/firebase";
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ChatModal = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
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
  }, [chatHistory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setShowHistory(false);
  };
  const handleToggleHistory = () => setShowHistory(!showHistory);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    if (!user) {
      alert(" you need to log in to send messages!");
      return;
    }

    const userMessage = {
      role: "user",
      content: message,
      userId: user.uid,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, { ...userMessage, id: `temp-${Date.now()}` }]);
    setMessage("");

    try {
     
      const userDocRef = await addDoc(collection(db, "chatHistory"), userMessage);

     
      const aiResponse = await fetchChatResponse(message);
      const aiMessage = {
        role: "ai",
        content: aiResponse,
        userId: user.uid,
        timestamp: new Date(),
      };


      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.id !== `temp-${Date.now()}`), 
        { ...userMessage, id: userDocRef.id }, 
        { ...aiMessage, id: `temp-ai-${Date.now()}` }, 
      ]);

      await addDoc(collection(db, "chatHistory"), aiMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("  error sending message, please try again later!");
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

  return (
    <div>
      <Button variant="contained" sx={{backgroundColor:"#8000ff"}} onClick={handleOpen}>
      Open AI Chat
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
              Ai Chat
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
              {chatHistory.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    mb: 1.5,
                    p: 1.5,
                    maxWidth: "70%",
                    bgcolor: msg.role === "user" ? "#8000ff" : "#e0e0e0",
                    color: msg.role === "user" ? "white" : "black",
                    borderRadius: 3,
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    boxShadow: 1,
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
              <IconButton sx={{color:"#8000ff" }}onClick={handleSendMessage} disabled={!user}>
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={historyContainerStyle} >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Chat History
            </Typography>
            <List>
              {chatHistory.length === 0 ? (
                <Typography>No history found</Typography>
              ) : (
                chatHistory
                  .filter((msg) => msg.role === "user")
                  .map((msg) => {
                    const response = chatHistory.find(
                      (res) =>
                        res.role === "ai" &&
                        res.timestamp > msg.timestamp &&
                        res.userId === msg.userId
                    );
                    return (
                      <ListItem key={msg.id} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                        <ListItemText
                          primary={msg.content}
                          secondary={response ? response.content : " No response yet"}
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
      throw new Error("فيه مشكلة في الـ API response");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "فيه مشكلة في الاتصال بالـ AI، جربي تاني!";
  }
};

export default ChatModal;