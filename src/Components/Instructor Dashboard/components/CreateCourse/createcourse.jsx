import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import {
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useCourseContext } from "../../../../context/CourseContext";

const steps = ["Step1", "Step2", "Step3", "Step4"];

export default function CreateCourse() {
  const { courseData, updateCourseData } = useCourseContext();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const [courseType, setCourseType] = React.useState("");
  const [courseTitle, setCourseTitle] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [subcategories, setSubcategories] = React.useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = React.useState("");
  const nav = useNavigate();

  const categoryData = {
    10: [
      { id: 1, name: "Web Development" },
      { id: 2, name: "Mobile Development" },
      { id: 3, name: "Game Development" },
    ],
    20: [
      { id: 4, name: "Data Science" },
      { id: 5, name: "Machine Learning" },
      { id: 6, name: "AI" },
    ],
    30: [
      { id: 7, name: "Digital Marketing" },
      { id: 8, name: "Social Media" },
      { id: 9, name: "Content Marketing" },
    ],
  };

  React.useEffect(() => {
    if (category) {
      setSubcategories(categoryData[category] || []);
      setSelectedSubcategory("");
    }
  }, [category, categoryData]);

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const stepData = {
      0: { course_type: courseType },
      1: { title: courseTitle },
      2: { category_id: category },
      3: { subcategory_id: selectedSubcategory },
    }[activeStep];

    if (stepData) {
      updateCourseData(stepData);
    }

    if (isLastStep()) {
      nav("/instructor/edit", {
        state: { courseData: courseData },
      });
      return;
    }

    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;

    setCompleted({
      ...completed,
      [activeStep]: true,
    });

    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return courseType !== "";
      case 1:
        return courseTitle.trim() !== "";
      case 2:
        return category !== "";
      case 3:
        return selectedSubcategory !== "";
      default:
        return true;
    }
  };

  const stepContent = [
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h5" fontWeight={"bold"} my={5} textAlign={"center"}>
        First, let's find out what type of course you're making.
      </Typography>
      <Stack direction={"row"} justifyContent={"center"} gap={3}>
        <Card
          onClick={() => setCourseType("course")}
          sx={{
            maxWidth: 345,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            transition: "all 0.3s ease",
            border: courseType === "course" ? "2px solid #A435F0" : "none",
            "&:hover": {
              backgroundColor: "#d8e0fb",
              border: "2px solid black",
            },
          }}
        >
          <CardActionArea
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <OndemandVideoIcon sx={{ fontSize: 40, marginBottom: 2, mt: 5 }} />
            <CardContent sx={{ textAlign: "center" }}>
              <Typography
                gutterBottom
                variant="body1"
                component="div"
                fontWeight={"bold"}
              >
                Course
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                Create rich learning experiences with the help of video
                lectures, quizzes, coding exercises, etc.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
    </Box>,

    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h5" fontWeight={"bold"} textAlign={"center"} my={2}>
        How about a working title?
      </Typography>
      <Typography variant="body1" textAlign={"center"} my={1}>
        It's ok if you can't think of a good title now. You can change it later.
      </Typography>
      <TextField
        value={courseTitle}
        onChange={(e) => setCourseTitle(e.target.value)}
        id="outlined-basic"
        variant="outlined"
        fullWidth
        sx={{
          maxWidth: 500,
          borderRadius: "8px",
          padding: "10px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
          "& .MuiInputLabel-root": {
            color: "#1976d2",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1565c0",
          },
          "& .MuiInputBase-root": {
            fontSize: "1rem",
          },
          my: 5,
        }}
      />
    </Box>,

    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h5" fontWeight={"bold"} textAlign={"center"} my={3}>
        What category best fits the knowledge you'll share?
      </Typography>
      <Typography variant="body1" textAlign={"center"} my={3}>
        Choose the category that best fits the knowledge you'll share.
      </Typography>

      <FormControl sx={{ width: "100%", maxWidth: 400 }}>
        <InputLabel id="demo-simple-select-label">Select Category</InputLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Select Category"
          sx={{
            borderRadius: "8px",
            padding: "8px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            "& .MuiSelect-icon": {
              color: "#1976d2",
            },
          }}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>,

    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h5" fontWeight={"bold"} textAlign={"center"} my={4}>
        Select a subcategory
      </Typography>
      <Typography variant="body1" textAlign={"center"} my={3}>
        Choose the specific area that best matches your course content
      </Typography>

      <FormControl sx={{ width: "100%", maxWidth: 400 }}>
        <InputLabel>Select Subcategory</InputLabel>
        <Select
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          label="Select Subcategory"
          sx={{
            borderRadius: "8px",
            padding: "8px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            "& .MuiSelect-icon": {
              color: "#1976d2",
            },
          }}
        >
          {subcategories.map((sub) => (
            <MenuItem key={sub.id} value={sub.id}>
              {sub.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>,
  ];

  return (
    <Box sx={{ width: "100%", overflow: "hidden", pb: 10 }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          nav({ to: "instuctor" })
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1, py: 1 }}></Typography>
            {stepContent[activeStep]}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                py: 3,
                px: 4,
                bgcolor: "white",
                borderTop: "1px solid #ddd",
                zIndex: 1000,
              }}
            >
              <Button
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{
                  mr: 1,
                  color: "#6B6F74",
                  borderColor: "#6B6F74",
                  textTransform: "none",
                  fontSize: "16px",
                  px: 4,
                  py: 1,
                  "&:hover": {
                    borderColor: "#6B6F74",
                    backgroundColor: "rgba(107, 111, 116, 0.04)",
                  },
                }}
              >
                Previous
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={!isStepValid()}
                sx={{
                  mr: 1,
                  bgcolor: "#A435F0",
                  textTransform: "none",
                  fontSize: "16px",
                  px: 4,
                  py: 1,
                  "&:hover": {
                    bgcolor: "#8710ED",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#E7E7E7",
                    color: "#A6A6A6",
                  },
                }}
              >
                {isLastStep() ? "Finish" : "Continue"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
