import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Firebase/firebase.js";
import { Box, Typography } from "@mui/material";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [courses, setCourses] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesSnapshot = await getDocs(
          query(collection(db, "Courses"), where("category_id", "==", categoryId))
        );
        const coursesData = coursesSnapshot.docs.map((doc) => doc.data());
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
    };

    const fetchCategoryName = async () => {
      try {
        const categorySnapshot = await getDocs(
          query(collection(db, "Categories"), where("id", "==", categoryId))
        );
        const categoryDoc = categorySnapshot.docs[0];
        if (categoryDoc) {
          setCategoryName(categoryDoc.data().name);
        }
      } catch (error) {
        console.error("Error fetching category name: ", error);
      }
    };

    fetchCourses();
    fetchCategoryName();
  }, [categoryId]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {categoryName} Courses
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
        {courses.map((course, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              width: "600px",
              border: "1px solid #ccc",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 2,
              backgroundColor: "#fff",
            }}
          >
            <Box
              component="img"
              src={course.thumbnail || "https://via.placeholder.com/180"}
              alt={course.title}
              sx={{ width: 180, height: "100%", objectFit: "cover" }}
            />
            <Box sx={{ padding: 2, flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {course.description}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
                Price: ${course.price}
              </Typography>
             <Typography variant="body2" color="text.secondary">
  Rating: ⭐ {course.rating?.rate} ({course.rating?.count} reviews)
</Typography>

            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryPage;
