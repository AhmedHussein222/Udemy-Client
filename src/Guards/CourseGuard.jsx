import { Box, CircularProgress } from "@mui/material";
import { Navigate, useParams } from "react-router-dom";
import { useEnrolledCourses } from "../context/EnrolledCoursesContext";

const CourseGuard = ({ children }) => {
  const param = useParams();
  const { enrolledCourses, loading } = useEnrolledCourses();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const isEnrolled = enrolledCourses.some(
    (course) => course.id === param.id || course.course_id === param.id
  );

  if (!isEnrolled) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default CourseGuard;
