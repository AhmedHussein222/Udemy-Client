import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase.js";
import { Box, Typography, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "Categories"));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          subcategories: [],
        }));

        const subcategoriesSnapshot = await getDocs(collection(db, "SubCategories"));
        const subcategoriesData = subcategoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const categoriesWithSub = categoriesData.map((category) => {
          const subcats = subcategoriesData.filter(
            (sub) => sub.category_id === category.id
          );
          return { ...category, subcategories: subcats };
        });

        setCategories(categoriesWithSub);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleMouseEnter = (categoryId) => {
    setHoveredCategoryId(categoryId);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
    setHoveredCategoryId(null);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const handleSubcategoryClick = (subcategoryId) => {
    navigate(`/subcategory/${subcategoryId}`);
    setShowDropdown(false); // بعد ما نروح للصفحة نقفل القائمة
  };

  return (
    <nav>
      {/* Wrapper فيه الاتنين عشان الـ hover */}
      <Box onMouseLeave={handleMouseLeave}>
        {/* Top Navbar */}
        <Box sx={{ backgroundColor: "white", boxShadow: 3, padding: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
            }}
          >
            {categories.map((cat) => (
              <Typography
                key={cat.id}
                onMouseEnter={() => handleMouseEnter(cat.id)}
                onClick={() => handleCategoryClick(cat.id)}
                sx={{
                  cursor: "pointer",
                  color: "black",
                  "&:hover": {
                    color: "purple",
                  },
                }}
              >
                {cat.name}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Dropdown */}
        {showDropdown && hoveredCategoryId && (
          <Box
            onMouseEnter={() => setShowDropdown(true)}
            sx={{
              backgroundColor: "#000",
              color: "white",
              boxShadow: 3,
              position: "absolute",
              top: "110px",
              left: "0",
              width: "100%",
              height: "40px",
              padding: 0,
              display: "flex",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <Box sx={{ display: "flex", gap: 3 }}>
              {categories.find((cat) => cat.id === hoveredCategoryId)?.subcategories.length > 0 ? (
                categories
                  .find((cat) => cat.id === hoveredCategoryId)
                  ?.subcategories.map((sub) => (
                    <MenuItem
                      key={sub.id}
                      sx={{ color: "white" }}
                      onClick={() => handleSubcategoryClick(sub.id)}
                    >
                      {sub.name}
                    </MenuItem>
                  ))
              ) : (
                <Typography sx={{ color: "white" }}>لا توجد فئات فرعية حالياً</Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </nav>
  );
};

export default Navbar;
