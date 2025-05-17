import React, { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { db } from "../../Firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Card from "@mui/material/Card";
import { Accordion, AccordionDetails, AccordionSummary, Button } from "@mui/material";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import "./NavBar.css";

const NavBar = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Categories"));
      const categoriesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCategories(categoriesList);

      if (categoriesList.length > 0) {
        const firstCategory = categoriesList[0];
        setSelectedCategory(firstCategory);
        fetchSubcategories(firstCategory.id, true); // true = autoSelectFirstSub
      }
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  };

  const fetchSubcategories = async (categoryId, autoSelectFirst = false) => {
    setLoading(true);
    try {
      const subcategoriesQuery = query(
        collection(db, "SubCategories"),
        where("category_id", "==", categoryId)
      );
      const snapshot = await getDocs(subcategoriesQuery);
      const subcategoriesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setSubcategories(subcategoriesList);

      if (autoSelectFirst && subcategoriesList.length > 0) {
        const firstSub = subcategoriesList[0];
        setSelectedSubcategory(firstSub);
        fetchCourses(categoryId, firstSub.id);
      }
    } catch (error) {
      console.error("Error fetching subcategories: ", error);
    }
    setLoading(false);
  };

  const fetchCourses = async (categoryId, subcategoryId) => {
    setLoading(true);
    try {
      const coursesQuery = query(
        collection(db, "Courses"),
        where("category_id", "==", categoryId.toString()),
        where("subcategory_id", "==", subcategoryId.toString())
      );
      const snapshot = await getDocs(coursesQuery);
      const coursesList = snapshot.docs.map((doc) => doc.data());

      setCourses(coursesList);
    } catch (error) {
      console.error("Error fetching courses: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedSubcategory && selectedCategory) {
      fetchCourses(selectedCategory.id, selectedSubcategory.id);
    }
  }, [selectedSubcategory]);

  return (
    <div style={{ padding: "20px" }}>
      {/* Categories Tabs */}
     {/* Categories - Desktop */}
<div className="navbar-container desktop-only">
  <ul className="navbar">
    {categories.map((category) => (
      <li
        key={category.id}
        className={`nav-item ${
          selectedCategory?.id === category.id ? "selected" : ""
        }`}
        onClick={() => {
          setSelectedCategory(category);
          setSelectedSubcategory(null);
          setCourses([]);
          fetchSubcategories(category.id, true);
        }}
      >
        {category.name}
      </li>
    ))}
  </ul>
</div>

{/* Categories - Mobile Accordion */}
<div className="mobile-only">
  <Accordion>
    <AccordionSummary expandIcon={<span>▼</span>}>
      <Typography>
        {selectedCategory?.name || "Select Category"}
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => {
            setSelectedCategory(category);
            setSelectedSubcategory(null);
            setCourses([]);
            fetchSubcategories(category.id, true);
          }}
          style={{
            padding: "10px 0",
            fontWeight: selectedCategory?.id === category.id ? "bold" : "normal",
            color: selectedCategory?.id === category.id ? "#1f365d" : "gray",
            cursor: "pointer",
          }}
        >
          {category.name}
        </div>
      ))}
    </AccordionDetails>
  </Accordion>
</div>


      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            margin: "30px 0",
            flexWrap: "wrap",

          }}
        >
          {subcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              onClick={() => setSelectedSubcategory(subcategory)}
              style={{
                padding: "30px 16px",
                borderRadius: "40px",
                fontWeight: "bold",
                fontSize: "18px",
                backgroundColor:
                  selectedSubcategory?.id === subcategory.id
                    ? "#003366"
                    : "#f5f5f5",
                color:
                  selectedSubcategory?.id === subcategory.id
                    ? "#ffffff"
                    : "#003366",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow:
                  selectedSubcategory?.id === subcategory.id
                    ? "0 2px 6px rgba(0, 0, 0, 0.2)"
                    : "none",
              }}
            >
              {subcategory.name}
            </div>
          ))}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="hide-scrollbar" style={{ display: "flex", gap: "20px", paddingBottom: "10px" }}>

          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} sx={{ width: 250, flex: "0 0 auto" }}>
              <Skeleton variant="rectangular" height={150} />
              <CardContent>
                <Skeleton variant="text" height={30} width="80%" />
                <Skeleton variant="text" height={20} width="60%" />
                <Skeleton variant="text" height={20} width="90%" />
                <Skeleton variant="text" height={20} width="40%" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Courses */}
      {!loading && selectedSubcategory && (
        <div className="hide-scrollbar" style={{ display: "flex", paddingBottom: "10px"  ,gap:12}}>

          {courses.map((course, index) => (
            <Card key={index} sx={{ width: 250, flex: "0 0 auto" }}>
              <img
                src={course.thumbnail}
                alt={course.title}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px 8px 0 0",
                }}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  style={{ fontWeight: "bold", color: "#000000" }}
                >
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <StarIcon style={{ color: "#ffb400", marginRight: "5px" }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.rating?.rate} ({course.rating?.count} learners)
                  </Typography>
                </div>
                <Typography
                  variant="body2"
                  style={{ marginTop: "10px", fontWeight: "bold" }}
                >
                  €{course.price}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Box mt={4} textAlign="left">
  <Button
    variant="outlined"
    sx={{
      color: " #5624d0",
      borderColor: " #5624d0",
      fontWeight: "bold",
      textTransform: "none",
      px: 4,
      py: 1.5,
      borderRadius: "6px",
      "&:hover": {
        borderColor: "darkviolet",
        color: "darkviolet",
      },
    }}
  >
    Show All {selectedSubcategory?.name} Courses
  </Button>
</Box>

    </div>
  );
};

export default NavBar;
