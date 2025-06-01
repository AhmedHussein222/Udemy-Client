import ChatIcon from "@mui/icons-material/Chat";
import HistoryIcon from "@mui/icons-material/History";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  CircularProgress,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../../Firebase/firebase";

const ChatModal = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
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

    setIsLoading(true);
    const userMessage = {
      role: "user",
      content: message,
      userId: user.uid,
      timestamp: new Date(),
    };

    const messageId = `pending-${Date.now()}`;
    setPendingMessages((prev) => [...prev, { ...userMessage, id: messageId }]);
    setMessage("");

    try {
      // Add user message to Firestore first
      await addDoc(collection(db, "chatHistory"), userMessage);

      // Get AI response with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 15000)
      );
      const aiResponse = await Promise.race([
        fetchChatResponse(message),
        timeoutPromise,
      ]);

      const aiMessage = {
        role: "ai",
        content: aiResponse,
        userId: user.uid,
        timestamp: new Date(),
      };

      // Add AI response to Firestore
      await addDoc(collection(db, "chatHistory"), aiMessage);

      setPendingMessages((prev) => [
        ...prev,
        { ...aiMessage, id: `pending-ai-${Date.now()}` },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage =
        "There was a problem connecting to the AI, please try again!";
      if (error.message === "Request timed out") {
        errorMessage =
          "The request took too long to respond. Please try again.";
      }
      alert(errorMessage);
      setPendingMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } finally {
      setIsLoading(false);
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
    maxHeight: 450,
    flex: 0.35,
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
    "&:hover": { backgroundColor: "#6b00d6" },
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: "bold" }}
              >
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
              {" "}
              {displayedMessages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    maxWidth: "70%",
                    bgcolor: msg.role === "user" ? "#8000ff" : "#ffffff",
                    color: msg.role === "user" ? "white" : "#333333",
                    borderRadius:
                      msg.role === "user"
                        ? "20px 20px 20px 5px"
                        : "20px 20px 5px 20px",
                    alignSelf: msg.role === "user" ? "flex-start" : "flex-end",
                    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                    mx: 1.5,
                    position: "relative",
                    border: msg.role === "ai" ? "1px solid #e0e0e0" : "none",
                    "&::before":
                      msg.role === "ai"
                        ? {
                            content: '""',
                            position: "absolute",
                            right: -8,
                            bottom: 0,
                            width: 20,
                            height: 20,
                            background: "#ffffff",
                            border: "1px solid #e0e0e0",
                            borderRadius: "0 0 20px 0",
                            clipPath: "polygon(0 0, 100% 100%, 100% 0)",
                            zIndex: -1,
                          }
                        : {},
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                  </Typography>
                </Box>
              ))}
            </Box>{" "}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                fullWidth
                label="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                variant="outlined"
                size="small"
                onKeyPress={(e) =>
                  e.key === "Enter" && !isLoading && handleSendMessage()
                }
                disabled={!user || isLoading}
              />
              <IconButton
                sx={{ color: "#8000ff" }}
                onClick={handleSendMessage}
                disabled={!user || isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: "#8000ff" }} />
                ) : (
                  <SendIcon />
                )}
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
                      <ListItem
                        key={msg.id}
                        sx={{
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <ListItemText
                          primary={msg.content}
                          secondary={
                            response ? response.content : "No response yet"
                          }
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
    const controller = new AbortController();
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "My Chat App",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
          stream: false,
        }),
        signal: controller.signal,
      }
    );

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
