import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import CurriculumBuilder from "./Curriculum";
import IntendedLearnersForm from "./Intended ";
import PricingForm from "./price";
import CourseMessages from "./courseMessage";
import LandingPage from "./LandingPage";
import Captions from "./Captions";
import { useCourseContext } from "../../../../context/CourseContext";

const StepContent = ({ step }) => {
  switch (step) {
    case 0:
      return <IntendedLearnersForm />;
    case 1:
      return <CurriculumBuilder />;
    case 2:
      return <Captions />;
    case 3:
      return <LandingPage />;
    case 4:
      return <PricingForm />;
    case 5:
      return <CourseMessages />;
    default:
      return <Typography>Select a step</Typography>;
  }
};

const EditCourse = () => {
  const { courseData } = useCourseContext();
  const [selectedStep, setSelectedStep] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      const requiredFields = {
        intended_learners: courseData.what_will_learn?.length > 0,
        curriculum: courseData.curriculum?.length > 0,
        landing_page: courseData.description && courseData.thumbnail,
        pricing: courseData.price !== undefined,
      };

      setIsFormValid(Object.values(requiredFields).every(Boolean));
    };

    validateForm();
  }, [courseData]);

  const handleSubmitCourse = async () => {
    if (isFormValid) return;

    const finalCourseData = {
      ...courseData,
      is_published: false,
      created_at: new Date().toISOString(),
    };

    try {
      console.log("Submitting course:", finalCourseData);
    } catch (error) {
      console.error("Error submitting course:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#f7f9ff",
        paddingTop: 2,
        paddingLeft: 5,
      }}
    >
      <Box
        sx={{
          width: "280px",
          minWidth: "280px",
          left: 0,
          top: 70,
          bgcolor: "#fff",

          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #e6e6e6",
          overflowY: "auto",
        }}
      >
        <List sx={{ flex: 1 }}>
          <Typography
            sx={{ px: 2, py: 1, fontWeight: "bold", color: "#1c1d1f" }}
          >
            Plan your course
          </Typography>
          <ListItem
            button
            selected={selectedStep === 0}
            onClick={() => setSelectedStep(0)}
            sx={{ "&.Mui-selected": { backgroundColor: "#f7f9fa" } }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <ListItemText primary="Intended learners" />
              <CheckCircleIcon
                sx={{ ml: 1, color: "#a7a1ad" }}
                fontSize="small"
              />
            </Box>
          </ListItem>

          <Typography
            sx={{ px: 2, py: 1, fontWeight: "bold", color: "#1c1d1f" }}
          >
            Create your content
          </Typography>
          <ListItem
            button
            selected={selectedStep === 1}
            onClick={() => setSelectedStep(1)}
            sx={{ "&.Mui-selected": { backgroundColor: "#f7f9fa" } }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <ListItemText primary="Curriculum" />
              <CheckCircleIcon
                sx={{ ml: 1, color: "#a7a1ad" }}
                fontSize="small"
              />
            </Box>
          </ListItem>
          <ListItem
            button
            selected={selectedStep === 2}
            onClick={() => setSelectedStep(2)}
            sx={{ "&.Mui-selected": { backgroundColor: "#f7f9fa" } }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <ListItemText primary="Captions (optional)" />
              <CheckCircleIcon
                sx={{ ml: 1, color: "#9542f5" }}
                fontSize="small"
              />
            </Box>
          </ListItem>

          <Typography
            sx={{ px: 2, py: 1, fontWeight: "bold", color: "#1c1d1f" }}
          >
            Publish your course
          </Typography>
          <ListItem
            button
            selected={selectedStep === 3}
            onClick={() => setSelectedStep(3)}
            sx={{ "&.Mui-selected": { backgroundColor: "#f7f9fa" } }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <ListItemText primary="Course landing page" />
              <CheckCircleIcon
                sx={{ ml: 1, color: "#a7a1ad" }}
                fontSize="small"
              />
            </Box>
          </ListItem>
          <ListItem
            button
            selected={selectedStep === 4}
            bgcolor={"#9542f5"}
            onClick={() => setSelectedStep(4)}
            sx={{
              "&.Mui-selected": {
                backgroundColor: selectedStep === 4 ? "#f7f9fa" : "#9542f5",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <ListItemText primary="Pricing" />
              <CheckCircleIcon
                sx={{ ml: 1, color: "#a7a1ad" }}
                fontSize="small"
              />
            </Box>
          </ListItem>
          <ListItem
            button
            selected={selectedStep === 5}
            onClick={() => setSelectedStep(5)}
            sx={{ "&.Mui-selected": { backgroundColor: "#f7f9fa" } }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <ListItemText primary="Course messages" />
              <CheckCircleIcon
                sx={{ ml: 1, color: "#a7a1ad" }}
                fontSize="small"
              />
            </Box>
          </ListItem>
        </List>

        <Box>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmitCourse}
            disabled={!isFormValid}
            sx={{
              backgroundColor: "#a435f0",
              "&:hover": { backgroundColor: "#8710d8" },
              "&.Mui-disabled": {
                backgroundColor: "#e7e7e7",
                color: "#a6a6a6",
              },
            }}
          >
            Submit for Review
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmitCourse}
            disabled={isFormValid}
            sx={{
              backgroundColor: "#a435f0",
              "&:hover": { backgroundColor: "#8710d8" },
              "&.Mui-disabled": {
                backgroundColor: "#e7e7e7",
                color: "#a6a6a6",
              },
            }}
          >
            Submit for Review
          </Button>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Paper elevation={3} sx={{ mx: 5, pt: 2 }}>
          <StepContent step={selectedStep} />
        </Paper>
      </Box>
    </Box>
  );
};

export default EditCourse;
