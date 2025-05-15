import {
  Code,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function CourseMessages() {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [congratsMessage, setCongratsMessage] = useState("");

  const EditorToolbar = () => (
    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
      <IconButton size="small">
        <FormatBold />
      </IconButton>
      <IconButton size="small">
        <FormatItalic />
      </IconButton>
      <IconButton size="small">
        <FormatListBulleted />
      </IconButton>
      <IconButton size="small">
        <FormatListNumbered />
      </IconButton>
      <IconButton size="small">
        <Code />
      </IconButton>
    </Box>
  );

  return (
    <Paper elevation={1} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Course Messages
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Write messages to your students (optional) that will be sent
        automatically when they join or complete your course to encourage
        students to engage with course content. If you do not wish to send a
        welcome or congratulations message, leave the text box blank.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Welcome Message
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <EditorToolbar />
          <TextField
            multiline
            fullWidth
            rows={6}
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            inputProps={{ maxLength: 1000 }}
            helperText={`${welcomeMessage.length}/1000`}
            sx={{ "& .MuiOutlinedInput-root": { bgcolor: "background.paper" } }}
          />
        </Paper>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h6" gutterBottom>
          Congratulations Message
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <EditorToolbar />
          <TextField
            multiline
            fullWidth
            rows={6}
            value={congratsMessage}
            onChange={(e) => setCongratsMessage(e.target.value)}
            inputProps={{ maxLength: 1000 }}
            helperText={`${congratsMessage.length}/1000`}
            sx={{ "& .MuiOutlinedInput-root": { bgcolor: "background.paper" } }}
          />
        </Paper>
      </Box>
    </Paper>
  );
}
