import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Paper,
} from "@mui/material";
import { useContext, useRef } from "react";
import { UserContext } from "../../../../context/UserContext";
import CurriculumBuilder from "./curriculum";
import { addLessons } from "../../../../Firebase/courses";
import IntendedLearnersForm from "./Intended ";

const EditCourse = () => {
  const { user } = useContext(UserContext);

  let lessonsref = useRef();
  let basicData = useRef();

  const handleSubmitCourse = async () => {
    const lessons = lessonsref.current.getValues();
    const courseData = basicData.current.getValues();
  };

  return (
    <Box
      sx={{
        display: "flex",
        background: "linear-gradient(135deg, #f7f9ff 60%, #e3e0f7 100%)",
        minHeight: "100vh",
        paddingTop: 4,
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, md: 4 },
          maxWidth: 900,
          width: "100%",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            mx: { xs: 0, md: 5 },
            pt: 4,
            pb: 4,
            px: { xs: 2, md: 6 },
            borderRadius: 4,
            boxShadow: "0 8px 32px 0 rgba(60,60,120,0.10)",
          }}
        >
          <IntendedLearnersForm instructor_id={user?.user_id} ref={basicData} />
          <CurriculumBuilder ref={lessonsref} />
          <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmitCourse}
              disabled={
                !lessonsref.current?.isvalid() || !basicData.current?.isvalid()
              }
              sx={{
                background: "linear-gradient(90deg,rgb(105, 25, 159) 60%, #8710d8 100%)",
                fontWeight: 600,
                fontSize: 18,
                py: 1.5,
                borderRadius: 2,
                boxShadow: "0 2px 8px 0 rgba(164,53,240,0.10)",
                "&:hover": {
                  background: "linear-gradient(90deg, #8710d8 60%, #a435f0 100%)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#e7e7e7",
                  color: "#a6a6a6",
                },
              }}
            >
              Submit for Review
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default EditCourse;
