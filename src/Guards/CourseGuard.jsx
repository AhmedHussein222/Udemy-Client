import { Navigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { use } from "react";

const CourseGuard = ({ children }) => {
  const {  enrolledCourses } = use(UserContext);
  
  let {id} = useParams();
  // التحقق مما إذا كان المستخدم مسجلاً في الكورس
  const isEnrolled = enrolledCourses?.includes(id);

  if (!isEnrolled) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default CourseGuard;
