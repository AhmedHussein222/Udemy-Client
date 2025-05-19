import { Box, Button, Paper } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { UserContext } from "../../../../context/UserContext";
import {
  addCourse,
  addLessons,
  geCourseLessons,
  getCategories,
  getSubcategories,
  updateCourse,
} from "../../../../Firebase/courses";
import { errorModal, successModal } from "../alerts";
import CourseForm from "./CourseForm";
import CurriculumForm from "./CurriculumForm";

const EditCourse = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  user;
  const location = useLocation();
  const course = location.state?.course || null;

  const [lessons, setLessons] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [categories, setCats] = useState([]);
  const [subCategories, setSubCats] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [curriculumData, setCurriculumData] = useState(null);

  useEffect(() => {
    if (course?.course_id) {
      geCourseLessons(course.course_id)
        .then((lessons) => {
          setLessons(lessons || []);
        })
        .catch((error) => {
          console.error("Error fetching lessons:", error);
          setLessons([]);
        });
    }
  }, [course]);

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCats(data || []);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCats([]);
      });
  }, []);

  useEffect(() => {
    if (courseData?.category_id) {
      getSubcategories(courseData.category_id)
        .then((data) => {
          setSubCats(data || []);
        })
        .catch((error) => {
          console.error("Error fetching subcategories:", error);
          setSubCats([]);
        });
    }
  }, [courseData?.category_id]);

  const checkFormsValidity = () => {
    if (!courseData & !curriculumData) return false;

    const hasRequiredFields =
      courseData.title &&
      courseData.category_id &&
      courseData.subcategory_id &&
      courseData.language &&
      courseData.thumbnail &&
      courseData.description &&
      courseData.duration &&
      courseData.level &&
      courseData.what_will_learn?.[0]?.trim() !== "" &&
      curriculumData?.lessons?.length > 0;

    setIsFormValid(hasRequiredFields);
  };

  useEffect(() => {
    checkFormsValidity();
  }, [courseData]);

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      if (course) {
        updateCourse(course.course_id, courseData)
          .then(()=>{
            successModal()
            navigate("/instructor/dashboard/courses");
          })
          .catch((err) => {
            errorModal(
              "Error",
              err.message || "Something went wrong while updating the course!"
            );
          });
      } else {
        const course_id = v4();
        await addCourse({ ...courseData, course_id, instructor_id: "2" });
        await addLessons(curriculumData, course_id);
        successModal( "Course created successfully");
        navigate("/instructor/courses");
      }
    } catch (err) {
      errorModal(
        "Error",
        err.message || "Something went wrong while creating the course!"
      );
    }
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
          <form onSubmit={handleSubmitCourse}>
            <CourseForm
              defaultValues={{
                ...course,
              }}
              subCategories={subCategories}
              categories={categories}
              onChange={setCourseData}
            />

            <CurriculumForm
              course_id={course?.course_id}
              defaultlessons={lessons}
              onChange={setCurriculumData}
            />

            <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isFormValid}
                sx={{
                  background:
                    "linear-gradient(90deg,rgb(105, 25, 159) 60%, #8710d8 100%)",
                  fontWeight: 600,
                  fontSize: 18,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px 0 rgba(164,53,240,0.10)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #8710d8 60%, #a435f0 100%)",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#e7e7e7",
                    color: "#a6a6a6",
                  },
                }}
              >
                {course ?"Update" : "Create"} Course
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default EditCourse;
