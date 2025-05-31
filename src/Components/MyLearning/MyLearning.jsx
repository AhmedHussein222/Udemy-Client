/** @format */

import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SchoolIcon from "@mui/icons-material/School";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEnrolledCourses } from "../../context/EnrolledCoursesContext";

const MyLearning = () => {
  const { enrolledCourses, loading } = useEnrolledCourses();
  const navigate = useNavigate();
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        sx={{ gap: 2 }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#a435f0" }} />
        <Typography variant="h6" color="text.secondary">
          Loading your courses...
        </Typography>
      </Box>
    );
  }

  if (!enrolledCourses?.length) {
    return (
      <Container>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="60vh"
          textAlign="center"
        >
          <SchoolIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            You haven't enrolled in any courses yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Browse our courses and start learning today!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            Browse Courses
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          My Learning
        </Typography>
        <Box sx={{ width: "100%" }}>
          {enrolledCourses.map((course, index) => (
            <React.Fragment key={course.id || course.course_id}>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    py: 3,
                    px: 2,
                    position: "relative",
                    minHeight: "200px",
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() =>
                    navigate(`/MyLearning/${course.id || course.course_id}`)
                  }
                >
                  <Avatar
                    variant="square"
                    sx={{ width: 200, height: 120, mr: 3 }}
                    src={course.thumbnail}
                    alt={course.title}
                  >
                    <SchoolIcon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {course.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      By{" "}
                      <Typography
                        component="span"
                        sx={{ color: "#5624d0", ml: 1 }}
                      >
                        {course.instructor?.fullName || "Unknown Instructor"}
                      </Typography>
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {course.courseDetails?.totalLectures || 0} lectures
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.courseDetails?.totalHours || 0} total hours
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<PlayCircleOutlineIcon />}
                      sx={{
                        backgroundColor: "#a435f0",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#8710d8",
                        },
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course/${course.id || course.course_id}`);
                      }}
                    >
                      Start Learning
                    </Button>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ position: "absolute", bottom: 16, left: 16 }}
                    >
                      Enrolled on:{" "}
                      {new Date(
                        course.enrolledDate?.toDate()
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              {index < enrolledCourses.length - 1 && <Divider sx={{ mt: 2 }} />}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default MyLearning;
