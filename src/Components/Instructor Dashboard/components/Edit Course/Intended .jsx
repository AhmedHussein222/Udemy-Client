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
import { useCourseContext } from "../../../../context/CourseContext";

export default function IntendedLearnersForm() {
  const { courseData, updateCourseData } = useCourseContext();
  const [learningObjectives, setLearningObjectives] = useState(
    courseData.what_will_learn || [{ text: "", maxLength: 160 }]
  );
  const [prerequisites, setPrerequisites] = useState(
    courseData.requirements || [
      {
        text: "No programming experience needed. You will learn everything you need to know",
      },
    ]
  );
  const [targetLearners, setTargetLearners] = useState([
    { text: "Beginner Python developers curious about data science" },
  ]);

  const updateLearningObjectives = (newObjectives) => {
    setLearningObjectives(newObjectives);
    updateCourseData({
      what_will_learn: newObjectives
        .map((obj) => obj.text)
        .filter((text) => text.trim() !== ""),
    });
  };

  const updatePrerequisites = (newPrerequisites) => {
    setPrerequisites(newPrerequisites);
    updateCourseData({
      requirements: newPrerequisites
        .map((pre) => pre.text)
        .filter((text) => text.trim() !== ""),
    });
  };

  const addEntry = (setState, type) => {
    setState((prev) => {
      const newState = [...prev, { text: "", maxLength: 160 }];
      if (type === "learning") updateLearningObjectives(newState);
      if (type === "prerequisites") updatePrerequisites(newState);
      return newState;
    });
  };

  const updateEntry = (setState, index, newValue, type) => {
    setState((prev) => {
      const newState = prev.map((item, i) =>
        i === index ? { ...item, text: newValue } : item
      );
      if (type === "learning") updateLearningObjectives(newState);
      if (type === "prerequisites") updatePrerequisites(newState);
      return newState;
    });
  };

  const removeEntry = (setState, index, type) => {
    setState((prev) => {
      const newState = prev.filter((_, i) => i !== index);
      if (type === "learning") updateLearningObjectives(newState);
      if (type === "prerequisites") updatePrerequisites(newState);
      return newState;
    });
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
                  updateEntry(
                    setLearningObjectives,
                    index,
                    e.target.value,
                    "learning"
                  )
                }
                inputProps={{ maxLength: obj.maxLength }}
                helperText={`${obj.text.length}/${obj.maxLength}`}
                size="small"
              />
              <IconButton
                onClick={() =>
                  removeEntry(setLearningObjectives, index, "learning")
                }
                sx={{ color: "error.main" }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => addEntry(setLearningObjectives, "learning")}
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
                  updateEntry(
                    setPrerequisites,
                    index,
                    e.target.value,
                    "prerequisites"
                  )
                }
                size="small"
              />
              <IconButton
                onClick={() =>
                  removeEntry(setPrerequisites, index, "prerequisites")
                }
                sx={{ color: "error.main" }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => addEntry(setPrerequisites, "prerequisites")}
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
