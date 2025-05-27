import { ShoppingCart } from "@mui/icons-material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/cart-context";
import { WishlistContext } from "../../context/wishlist-context";
import { db } from "../../Firebase/firebase";
import "./NavBar.css";

const NavBar = () => {
  const { addToCart, cartItems } = useContext(CartContext);
  const { addToWishlist, wishlistItems } = useContext(WishlistContext);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoveredCourseId, setHoveredCourseId] = useState(null);
  const [popupPosition, setPopupPosition] = useState('right');
  const [hoverTimeoutId, setHoverTimeoutId] = useState(null);

  const navigate = useNavigate();

  const fetchCoursesWithRatings = useCallback(async (categoryId, subcategoryId) => {
    if (!categoryId || !subcategoryId) return;
    setLoading(true);
    try {
      // Get ratings
      const reviewsSnapshot = await getDocs(collection(db, "Reviews"));
      const ratingsMap = {};
      reviewsSnapshot.forEach((doc) => {
        const data = doc.data();
        const courseId = data.course_id;
        const rating = Number(data.rating) || 0;
        if (ratingsMap[courseId]) {
          ratingsMap[courseId].push(rating);
        } else {
          ratingsMap[courseId] = [rating];
        }
      });

      const averageRatings = {};
      Object.keys(ratingsMap).forEach((courseId) => {
        const ratings = ratingsMap[courseId];
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        averageRatings[courseId] = {
          rate: avg,
          count: ratings.length,
        };
      });

      // Get courses by category and subcategory
      const coursesQuery = query(
        collection(db, "Courses"),
        where("category_id", "==", categoryId.toString()),
        where("subcategory_id", "==", subcategoryId.toString())
      );
      const snapshot = await getDocs(coursesQuery);
      const coursesList = snapshot.docs.map((doc) => {
        const courseData = doc.data();
        const rating = averageRatings[doc.id] || { rate: 0, count: 0 };
        return {
          id: doc.id,
          ...courseData,
          rating,
        };
      });

      setCourses(coursesList);
    } catch (error) {
      console.error("Error fetching courses with ratings: ", error);
    }
    setLoading(false);
  }, []);

  const fetchSubcategories = useCallback(async (categoryId, autoSelectFirst = false) => {
    if (!categoryId) return;
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
        fetchCoursesWithRatings(categoryId, firstSub.id);
      }
    } catch (error) {
      console.error("Error fetching subcategories: ", error);
    }
    setLoading(false);
  }, [fetchCoursesWithRatings]);

  const fetchCategories = useCallback(async () => {
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
        fetchSubcategories(firstCategory.id, true);
      }
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  }, [fetchSubcategories]);
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  useEffect(() => {
    if (selectedSubcategory && selectedCategory) {
      fetchCoursesWithRatings(selectedCategory.id, selectedSubcategory.id);
    }
  }, [selectedSubcategory, selectedCategory, fetchCoursesWithRatings]);  const handleAddToCart = (course) => {
    if (!course || !course.id || !course.title || !course.price) {
      console.error('Invalid course data:', course);
      return;
    }
    
    const courseToAdd = {
      id: course.id,
      title: course.title,
      price: Number(course.price) || 0,
      thumbnail: course.thumbnail || '',
      instructor_name: course.instructor_name || 'Unknown Instructor',
      description: course.description || '',
      rating: course.rating || { rate: 0, count: 0 },
      totalHours: Number(course.totalHours || 0),
      lectures: Number(course.lectures || 0),
      addedAt: new Date().toISOString()
    };
    addToCart(courseToAdd);
  };

  const handleWishlistToggle = async (e, course) => {
    e.stopPropagation();
    if (!course || !course.id || !course.title || !course.price) {
      console.error('Invalid course data:', course);
      return;
    }
    
    const courseToAdd = {
      id: course.id,
      title: course.title,
      price: Number(course.price) || 0,
      thumbnail: course.thumbnail || '',
      instructor_name: course.instructor_name || 'Unknown Instructor',
      description: course.description || '',
      rating: course.rating || { rate: 0, count: 0 }
    };
    await addToWishlist(courseToAdd);
  };

  const handleCardHover = (courseId, event) => {
    if (hoverTimeoutId) {
      clearTimeout(hoverTimeoutId);
    }
    const cardElement = event.currentTarget;
    const rect = cardElement.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const threshold = screenWidth * 0.7; // Switch to left side when card is beyond 70% of screen width
    setPopupPosition(rect.right > threshold ? 'left' : 'right');
    setHoveredCourseId(courseId);
  };

  const handleCardLeave = () => {
    const timeoutId = setTimeout(() => {
      setHoveredCourseId(null);
      setPopupPosition('right');
    }, 300);
    setHoverTimeoutId(timeoutId);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutId) {
        clearTimeout(hoverTimeoutId);
      }
    };
  }, [hoverTimeoutId]);

  return (
    <div style={{ padding: "20px" }}>
      {/* Categories Tabs */}
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
            <Typography>{selectedCategory?.name || "Select Category"}</Typography>
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
                  fontWeight:
                    selectedCategory?.id === category.id ? "bold" : "normal",
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
                  selectedSubcategory?.id === subcategory.id ? "#003366" : "#f5f5f5",
                color: selectedSubcategory?.id === subcategory.id ? "#ffffff" : "#003366",
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
        <div
          className="hide-scrollbar"
          style={{ display: "flex", gap: "20px", paddingBottom: "10px" }}
        >
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
        <div
          className="hide-scrollbar"
          style={{ display: "flex", paddingBottom: "10px", gap: 12 }}
        >
          {courses.map((course) => (
            <Box
              key={course.id}
              sx={{ position: "relative", width: 250, flex: "0 0 auto" }}
              onMouseEnter={(e) => handleCardHover(course.id, e)}
              onMouseLeave={handleCardLeave}
            >
              <Card
                onClick={(e) => {
                  if (e.target.closest("button")) return;
                  navigate(`/course/${course.id}`);
                }}
                sx={{ 
                  cursor: "pointer",
                  height: "380px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
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
                  </Typography>                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      height: '60px'
                    }}
                  >
                    {course.description}
                  </Typography>

                  {/* التقييم والسعر */}
                  {(() => {
                    const ratingValue = course.rating?.rate || 0;
                    const ratingCount = course.rating?.count || 0;
                    const price = Number(course.price) || 0;
                    const discount = Number(course.discount) || 0;

                    return (
                      <>
                        <div
                          className="rating"
                          style={{
                            marginTop: 10,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>
                            {ratingValue.toFixed(1)}
                          </span>
                          <span style={{ color: "#ffb400", fontSize: "18px" }}>
                            {"★".repeat(Math.round(ratingValue)) +
                              "☆".repeat(5 - Math.round(ratingValue))}
                          </span>
                          <span style={{ color: "#666" }}>
                            ({ratingCount.toLocaleString()})
                          </span>
                        </div>

                        <div
                          className="pricing"
                          style={{ marginTop: 10, fontWeight: "bold" }}
                        >
                          {price === 0 ? (
                            <>
                              <span style={{ color: "green" }}>Free</span>
                              {discount > 0 && (
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    marginLeft: 8,
                                    color: "#999",
                                  }}
                                >
                                  {(price + discount).toFixed(2)} EGP
                                </span>
                              )}
                            </>
                          ) : (
                            <>
                              <span>{price.toFixed(2)} EGP</span>
                              {discount > 0 && (
                                <span
                                  style={{
                                    textDecoration: "line-through",
                                    marginLeft: 8,
                                    color: "#999",
                                  }}
                                >
                                  {(price + discount).toFixed(2)} EGP
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Popup on hover */}              {hoveredCourseId === course.id && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '0',
                    ...(popupPosition === 'right' 
                      ? {
                          left: '100%',
                          marginLeft: '12px',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '20px',
                            left: '-6px',
                            width: '12px',
                            height: '12px',
                            background: 'white',
                            transform: 'rotate(45deg)',
                            borderLeft: '1px solid #ddd',
                            borderBottom: '1px solid #ddd',
                            zIndex: 0
                          }
                        }
                      : {
                          right: '100%',
                          marginRight: '12px',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '20px',
                            right: '-6px',
                            width: '12px',
                            height: '12px',
                            background: 'white',
                            transform: 'rotate(45deg)',
                            borderTop: '1px solid #ddd',
                            borderRight: '1px solid #ddd',
                            zIndex: 0
                          }
                        }
                    ),
                    width: '280px',
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 99
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1.5, maxHeight: "80px", overflow: "hidden" }}
                  >
                    {course.description}
                  </Typography>                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body1" fontWeight="bold">
                      {course.price} EGP
                    </Typography>
                    <IconButton
                      onClick={(e) => handleWishlistToggle(e, course)}
                      sx={{
                        color: wishlistItems.find(item => item.id === course.id) ? '#8e2de2' : 'grey.400'
                      }}
                    >
                      {wishlistItems.find(item => item.id === course.id) ? 
                        <FavoriteIcon /> : 
                        <FavoriteBorderIcon />
                      }
                    </IconButton>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{
                      background: cartItems.find(item => item.id === course.id) ? 'white' : '#8e2de2',
                      color: cartItems.find(item => item.id === course.id) ? '#8e2de2' : 'white',
                      border: cartItems.find(item => item.id === course.id) ? '1px solid #8e2de2' : 'none',
                      borderRadius: '2%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 'bold',
                      fontSize: '15px',
                      alignSelf: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: cartItems.find(item => item.id === course.id) ? 'white' : '#7016b3',
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(course);
                    }}
                    fullWidth
                  >
                    {cartItems.find(item => item.id === course.id) ? 'In Cart' : 'Add to Cart'} 
                    <ShoppingCart />
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavBar;
