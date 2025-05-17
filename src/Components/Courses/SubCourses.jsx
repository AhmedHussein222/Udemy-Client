import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Firebase/firebase.js";
import { Box, Typography } from "@mui/material";

const SubCategoryPage = () => {
  const { subcategoryId } = useParams();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!subcategoryId) {
          console.error("subcategoryId is undefined");
          return;
        }

        const coursesSnapshot = await getDocs(
          query(
            collection(db, "Courses"),
            where("subcategory_id", "==", subcategoryId)
          )
        );
        const coursesData = coursesSnapshot.docs.map((doc) => doc.data());
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
    };

    fetchCourses();
  }, [subcategoryId]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Courses in this {subcategory.name}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {courses.map((course, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              width: "100%",
              maxWidth: "700px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: 1,
              backgroundColor: "#fff",
            }}
          >
            {/* Image on the left */}
            <Box
              component="img"
              src={course.thumbnail || "/assets/default-course.jpg"}
              alt={course.title}
              sx={{ width: 150, height: "100%", objectFit: "cover" }}
            />

            {/* Content on the right */}
            <Box
              sx={{
                padding: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              <Typography variant="h6">{course.title}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ margin: "8px 0" }}
              >
                {course.description}
              </Typography>
              <Typography variant="body2">
                ⭐ {course.rating?.rate || "4.5"} ({course.rating?.count || 0}{" "}
                ratings)
              </Typography>

              <Typography variant="h6" color="primary">
                {course.price ? `$${course.price}` : "$19.99"}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SubCategoryPage;
