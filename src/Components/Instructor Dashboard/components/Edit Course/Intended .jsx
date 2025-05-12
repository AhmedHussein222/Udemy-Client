import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function IntendedLearnersForm() {
  const [learningObjectives, setLearningObjectives] = useState([
    {
      text: "",
      maxLength: 160,
    },
  
  ]);

  const [prerequisites, setPrerequisites] = useState([
    {
      text: "No programming experience needed. You will learn everything you need to know",
    },
  ]);

  const [targetLearners, setTargetLearners] = useState([
    { text: "Beginner Python developers curious about data science" },
  ]);

  const addEntry = (setState) => {
    setState((prev) => [...prev, { text: "", maxLength: 160 }]);
  };

  const updateEntry = (setState, index, newValue) => {
    setState((prev) =>
      prev.map((item, i) => (i === index ? { ...item, text: newValue } : item))
    );
  };

  const removeEntry = (setState, index) => {
    setState((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Container maxWidth="md" sx={{ py: 0, px: 5 }}>
      <Box
        sx={{
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Intended Learners
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          The following descriptions will be publicly visible on your Course
          Landing Page and will have a direct impact on your course performance.
        </Typography>

        {/* Learning Objectives Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            What will students learn in your course?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You must enter at least 4 learning objectives or outcomes that
            learners can expect to achieve.
          </Typography>
          {learningObjectives.map((obj, index) => (
            <Box key={index} sx={{ mb: 2, display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                value={obj.text}
                onChange={(e) =>
                  updateEntry(setLearningObjectives, index, e.target.value)
                }
                inputProps={{ maxLength: obj.maxLength }}
                helperText={`${obj.text.length}/${obj.maxLength}`}
                size="small"
              />
              <IconButton
                onClick={() => removeEntry(setLearningObjectives, index)}
                sx={{ color: "error.main" }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => addEntry(setLearningObjectives)}
            sx={{ color: "primary.main", textTransform: "none" }}
          >
            Add more to your response
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Prerequisites Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            What are the requirements or prerequisites?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            List the required skills, experience, tools or equipment learners
            should have.
          </Typography>
          {prerequisites.map((prereq, index) => (
            <Box key={index} sx={{ mb: 2, display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                value={prereq.text}
                onChange={(e) =>
                  updateEntry(setPrerequisites, index, e.target.value)
                }
                size="small"
              />
              <IconButton
                onClick={() => removeEntry(setPrerequisites, index)}
                sx={{ color: "error.main" }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => addEntry(setPrerequisites)}
            sx={{ color: "primary.main", textTransform: "none" }}
          >
            Add more to your response
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Target Learners Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Who is this course for?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Write a clear description of the intended learners for your course.
          </Typography>
          {targetLearners.map((learner, index) => (
            <Box key={index} sx={{ mb: 2, display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                value={learner.text}
                onChange={(e) =>
                  updateEntry(setTargetLearners, index, e.target.value)
                }
                size="small"
              />
              <IconButton
                onClick={() => removeEntry(setTargetLearners, index)}
                sx={{ color: "error.main" }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => addEntry(setTargetLearners)}
            sx={{ color: "primary.main", textTransform: "none" }}
          >
            Add more to your response
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
