import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase.js";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Box,
  IconButton,
  Popover,
  Button,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const CoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isHoveringCardOrPopover, setIsHoveringCardOrPopover] = useState(false); // New state for hovering
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const coursesSnapshot = await getDocs(collection(db, "Courses"));
      const coursesData = coursesSnapshot.docs.map((doc) => doc.data());

      const subSnapshot = await getDocs(collection(db, "SubCategories"));
      const subData = subSnapshot.docs.map((doc) => doc.data());

      setCourses(coursesData);
      setSubCategories(subData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isHoveringCardOrPopover) {
      const timeout = setTimeout(() => {
        setAnchorEl(null);
        setSelectedCourse(null);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isHoveringCardOrPopover]);

  const handlePopoverOpen = (event, course) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourse(course);
    setIsHoveringCardOrPopover(true); // Set hover state to true when opening the popover
  };

  const handlePopoverClose = () => {
    setIsHoveringCardOrPopover(false); // Set hover state to false when closing the popover
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Container sx={{ py: 5 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        fontFamily="initial"
        color="#0d1b2a"
        sx={{ mb: 4 }}
      >
        What to learn next
      </Typography>

      {subCategories.map((sub, index) => {
        const filteredCourses = courses.filter(
          (course) => course.category_id === sub.category_id
        );

        return (
          <div key={index} style={{ marginBottom: "40px" }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              <span style={{ color: "black" }}> Featured courses in </span>
              <span
                style={{
                  color: "purple",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/subcategory/${sub.subcategory_id}`)}
              >
                {sub.name}
              </span>
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                overflowX: "auto",
                pb: 1,
                "&::-webkit-scrollbar": { display: "none" },
                "-ms-overflow-style": "none",
                "scrollbar-width": "none",
              }}
            >
              {filteredCourses.map((course, i) => (
                <Link
                  to={`/course-details/${course.id}`}
                  key={i}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    sx={{ minWidth: 250, flex: "0 0 auto" }}
                    onMouseEnter={(event) => handlePopoverOpen(event, course)}
                    onMouseLeave={handlePopoverClose}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={course.thumbnail}
                      alt={course.title}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="600" noWrap>
                        {course.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {course.description?.slice(0, 60)}...
                      </Typography>

                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2" fontWeight="bold" mr={0.5}>
                          {course.rating?.rate || "0.0"}
                        </Typography>
                        <StarIcon sx={{ color: "#f5c518", fontSize: 18 }} />
                      </Box>

                      {course.price === 0 ? (
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="green"
                        >
                          Free
                        </Typography>
                      ) : (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="text.primary"
                          >
                            ${course.price}
                          </Typography>
                          {course.original_price &&
                            course.original_price > course.price && (
                              <Typography
                                variant="body2"
                                sx={{
                                  textDecoration: "line-through",
                                  color: "gray",
                                }}
                              >
                                ${course.original_price}
                              </Typography>
                            )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </Box>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom", // Position the popover below the card
                horizontal: "left", // Align the popover to the left of the card
              }}
              transformOrigin={{
                vertical: "top", // Align the popover top with the card's bottom
                horizontal: "left", // Keep the left edge aligned
              }}
              sx={{
                zIndex: 1300,
                boxShadow: "none", // Remove the shadow from the popover
              }}
              PaperProps={{
                onMouseEnter: () => setIsHoveringCardOrPopover(true),
                onMouseLeave: handlePopoverClose,
              }}
            >
              <Box sx={{ p: 2, width: 300 }}>
                {selectedCourse && (
                  <>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="black"
                      gutterBottom
                    >
                      {selectedCourse.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {selectedCourse.description}
                    </Typography>

                    <Box display="flex" justifyContent="space-between">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "purple",
                          color: "white",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "#5e2a9e",
                          },
                        }}
                      >
                        Add to Cart
                      </Button>
                      <IconButton>
                        <FavoriteBorderIcon sx={{ color: "gray" }} />
                      </IconButton>
                    </Box>
                  </>
                )}
              </Box>
            </Popover>
          </div>
        );
      })}
    </Container>
  );
};

export default CoursesSection;
