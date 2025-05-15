import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase.js";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // ✨ استدعاء النافيجيت

const CategoryButtons = () => {
  const [subCategories, setSubCategories] = useState([]);
  const navigate = useNavigate(); // ✨

  useEffect(() => {
    const fetchSubCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "SubCategories"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setSubCategories(data.slice(0, 8));
    };

    fetchSubCategories();
  }, []);

  return (
    <Box sx={{ py: 5, px: 2 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ color: "#0d1b2a", mb: 3, textAlign: "left" }}
      >
        Topics recommended for you
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "left",
        }}
      >
        {subCategories.map((sub, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => navigate(`/subcategory/${sub.subcategory_id}`)} // ✨ التوجيه
            sx={{
              backgroundColor: "#fff",
              borderColor: "#f3e5f9",
              borderRadius: "0px",
              color: "black",
              px: 3,
              py: 1,
              textTransform: "none",
              fontSize: "14px",
              "&:hover": {
                backgroundColor: "#f3e5f5",
                borderColor: "#7e57c2",
              },
            }}
          >
            {sub.name}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryButtons;
