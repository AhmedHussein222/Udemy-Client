/** @format */

import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Modal,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ArticleIcon from "@mui/icons-material/Article";
import DownloadIcon from "@mui/icons-material/Download";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import ShareIcon from "@mui/icons-material/Share";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import {
  db,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "../../Firebase/firebase";
import { CartContext } from "../../context/cart-context";
import { WishlistContext } from "../../context/wishlist-context";
import { UserContext } from "../../context/UserContext";
import { errorModal } from "../../services/swal";

const CourseSidebar = ({ course }) => {
  const [courseData, setCourseData] = useState(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const {
    addToCart,
    loading: cartLoading,
    cartItems,
  } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, wishlistItems } =
    useContext(WishlistContext);
  const { user } = useContext(UserContext);

  const isWishlisted = wishlistItems.some((item) => item.id === course?.id);

  const formatDuration = (minutes) => {
    if (!minutes) return "0 min";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    return `${hours} hr ${mins} min`;
  };

  // Check if course is in cart on mount or when cartItems/course changes
  useEffect(() => {
    if (course?.id && cartItems) {
      const isCourseInCart = cartItems.some((item) => item.id === course.id);
      setIsInCart(isCourseInCart);
    }
  }, [course?.id, cartItems]);

  // Check enrollment status
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (!course?.id || !user?.uid) return;

      try {
        const enrollmentsRef = doc(db, "Enrollments", user.uid);
        const enrollmentsDoc = await getDoc(enrollmentsRef);
        if (enrollmentsDoc.exists()) {
          const enrollments = enrollmentsDoc.data().courses || [];
          setIsEnrolled(enrollments.some((c) => c.id === course.id));
        }
      } catch (error) {
        console.error("Error checking enrollment status:", error);
      }
    };

    checkEnrollmentStatus();
  }, [course?.id, user?.uid]);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!course?.id) return;

      try {
        // Fetch course data
        const courseRef = doc(db, "Courses", course.id);
        const courseSnap = await getDoc(courseRef);
        if (!courseSnap.exists()) return;

        const courseDocData = courseSnap.data();

        // Fetch all lessons for the course
        const lessonsQuery = query(
          collection(db, "Lessons"),
          where("course_id", "==", course.id.toString())
        );
        const lessonsSnap = await getDocs(lessonsQuery);

        let firstPreviewVideo = null;
        const lessons = lessonsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        lessons.sort((a, b) => a.order - b.order);

        // Sum duration for lessons with video_url
        const totalMins = lessons.reduce((sum, lesson) => {
          if (lesson.video_url) {
            return sum + (Number(lesson.duration) || 0);
          }
          return sum;
        }, 0);

        // Find first preview video
        lessons.forEach((lesson) => {
          if (!firstPreviewVideo && lesson.is_preview && lesson.video_url) {
            firstPreviewVideo = lesson.video_url;
          }
        });

        // Calculate discounted price
        const price = Number(courseDocData.price) || 0;
        const discount = Number(courseDocData.discount) || 0;
        const discountedPrice =
          discount > 0 && price > 0 ? price * (1 - discount / 100) : null;

        setCourseData({
          price,
          discountedPrice,
          hoursOfContent: totalMins > 0 ? (totalMins / 60).toFixed(1) : 0,
          displayText:
            totalMins > 0
              ? `${formatDuration(totalMins)} on-demand video`
              : "No video content",
          articleCount: courseDocData.articleCount || 0,
          resourceCount: courseDocData.resourceCount || 0,
          thumbnail:
            courseDocData.thumbnail ||
            "https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        });
        setPreviewVideoUrl(firstPreviewVideo);
      } catch (err) {
        console.error("Error fetching course data:", err);
      }
    };

    fetchCourseData();
  }, [course?.id]);

  const calculateDiscount = (price, discountedPrice) => {
    if (!price || !discountedPrice || discountedPrice >= price) return null;
    const discount = ((price - discountedPrice) / price) * 100;
    return Math.round(discount);
  };

  const isYouTubeUrl = (url) => {
    return url && (url.includes("youtube.com") || url.includes("youtu.be"));
  };

  const getYouTubeEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      let videoId = urlObj.searchParams.get("v");
      if (!videoId && url.includes("youtu.be")) {
        videoId = url.split("/").pop().split("?")[0];
      }
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?controls=1`
        : null;
    } catch {
      return null;
    }
  };

  const handleOpenModal = () => {
    if (!previewVideoUrl) {
      setVideoError("No preview video available.");
      setOpenModal(true);
      return;
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setVideoError(null);
  };

  const handleWishlistToggle = async () => {
    if (isWishlisted) {
      await removeFromWishlist(course.id);
    } else {
      await addToWishlist({
        id: course.id,
        title: course.title || "Untitled Course",
        price: courseData.discountedPrice || courseData.price,
        thumbnail: courseData.thumbnail,
        instructor_name:
          course.instructor_name || course.instructor || "Unknown Instructor",
        description: course.description || "",
        rating: course.rating || 0,
        discount:
          calculateDiscount(courseData.price, courseData.discountedPrice) || 0,
        badge: course.badge || "",
      });
    }
  };

  const handleAddToCart = async () => {
    if (!courseData || isInCart) return;

    const courseToAdd = {
      id: course.id,
      title: course.title || "Untitled Course",
      price: courseData.discountedPrice || courseData.price,
      thumbnail: courseData.thumbnail,
      instructor_name:
        course.instructor_name || course.instructor || "Unknown Instructor",
      description: course.description || "",
      rating: course.rating || 0,
      discount:
        calculateDiscount(courseData.price, courseData.discountedPrice) || 0,
      badge: course.badge || "",
    };

    const success = await addToCart(courseToAdd);
    if (success) {
      setIsInCart(true);
    } else {
      errorModal("Error", "Failed to add to cart. Please try again.");
    }
  };

  const buttonText = () => {
    if (isEnrolled) return "Enrolled";
    if (cartLoading) return "Adding...";
    if (isInCart) return "Added to Cart";
    if (courseData?.price === 0) return "Enroll Now - Free";
    return "Add to Cart";
  };

  const buttonProps = () => {
    if (isEnrolled) {
      return {
        startIcon: <CheckCircleIcon />,
        sx: {
          bgcolor: "#4caf50",
          color: "white",
          "&:hover": { bgcolor: "#388e3c" },
        },
        disabled: true,
      };
    }

    if (courseData?.price === 0) {
      return {
        startIcon: <SchoolIcon />,
        sx: {
          bgcolor: "#4caf50",
          color: "white",
          "&:hover": { bgcolor: "#388e3c" },
        },
        disabled: false,
      };
    }

    if (isInCart) {
      return {
        startIcon: <CheckCircleIcon />,
        sx: {
          bgcolor: "#f5f5f5",
          color: "#6a1b9a",
          "&:hover": { bgcolor: "#f0f0f0" },
        },
        disabled: true,
      };
    }

    return {
      startIcon: <ShoppingCartIcon />,
      sx: {
        bgcolor: "#a435f0",
        color: "white",
        "&:hover": { bgcolor: "#8710d8" },
      },
      disabled: false,
    };
  };

  if (!courseData) {
    return (
      <Box
        sx={{
          p: 3,
          bgcolor: "white",
          border: 1,
          borderColor: "grey.200",
          borderRadius: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100px",
        }}
      >
        <CircularProgress sx={{ color: "#1976d2" }} />
      </Box>
    );
  }

  const discountPercentage = calculateDiscount(
    courseData.price,
    courseData.discountedPrice
  );

  return (
    <Box
      sx={{
        border: 1,
        borderColor: "grey.200",
        borderRadius: 1,
        boxShadow: 3,
        bgcolor: "white",
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
        <Box
          component="img"
          src={courseData.thumbnail}
          alt="Course Preview"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Box
          onClick={handleOpenModal}
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "black",
            opacity: 0.2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover .play-button": { transform: "scale(1.1)" },
          }}
        >
          <Box
            className="play-button"
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "white",
              opacity: 0.9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.2s",
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderTop: "8px solid transparent",
                borderLeft: "16px solid black",
                borderBottom: "8px solid transparent",
                ml: "4px",
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "baseline", mb: 2 }}>
          {courseData.price === 0 ? (
            <Typography variant="h5" fontWeight="bold">
              Free
            </Typography>
          ) : (
            <>
              <Typography variant="h5" fontWeight="bold">
                $
                {courseData.discountedPrice
                  ? courseData.discountedPrice.toFixed(2)
                  : courseData.price.toFixed(2)}
              </Typography>
              {courseData.discountedPrice &&
                courseData.discountedPrice < courseData.price && (
                  <>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ textDecoration: "line-through", ml: 1 }}
                    >
                      ${courseData.price.toFixed(2)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        bgcolor: "#ffe7e4",
                        color: "#6a2c2c",
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        ml: 1,
                      }}
                    >
                      {discountPercentage}% off
                    </Typography>
                  </>
                )}
            </>
          )}
        </Box>

        {courseData.discountedPrice &&
          courseData.discountedPrice < courseData.price && (
            <Typography
              variant="body2"
              color="error"
              fontWeight="medium"
              sx={{ mb: 2 }}
            >
              2 days left at this price!
            </Typography>
          )}

        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Button
            variant="contained"
            fullWidth
            {...buttonProps()}
            onClick={handleAddToCart}
            sx={{
              ...buttonProps().sx,
              fontWeight: "bold",
              py: 1.5,
              textTransform: "none",
            }}
          >
            {buttonText()}
          </Button>
          {!isEnrolled && (
            <IconButton
              onClick={handleWishlistToggle}
              sx={{
                bgcolor: "#f5f5f5",
                "&:hover": { bgcolor: "#e0e0e0" },
                color: isWishlisted ? "#a435f0" : "inherit",
              }}
            >
              {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          )}
        </Box>
        {!isEnrolled && (
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            sx={{
              borderColor: "grey.800",
              color: "grey.800",
              fontWeight: "bold",
              py: 1.5,
              mb: 2,
              textTransform: "none",
              "&:hover": { bgcolor: "grey.50", borderColor: "grey.800" },
            }}
            aria-label="Buy now"
          >
            Buy now
          </Button>
        )}
        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          30-Day Money-Back Guarantee
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            This course includes:
          </Typography>
          <List dense sx={{ py: 0 }}>
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <VideoLibraryIcon sx={{ fontSize: 16, color: "grey.600" }} />
              </ListItemIcon>
              <ListItemText
                primary={courseData.displayText}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <ArticleIcon sx={{ fontSize: 16, color: "grey.600" }} />
              </ListItemIcon>
              <ListItemText
                primary={`${courseData.articleCount || 0} articles`}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <DownloadIcon sx={{ fontSize: 16, color: "grey.600" }} />
              </ListItemIcon>
              <ListItemText
                primary={`${
                  courseData.resourceCount || 0
                } downloadable resources`}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <SmartphoneIcon sx={{ fontSize: 16, color: "grey.600" }} />
              </ListItemIcon>
              <ListItemText
                primary="Access on mobile and TV"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CardMembershipIcon sx={{ fontSize: 16, color: "grey.600" }} />
              </ListItemIcon>
              <ListItemText
                primary="Certificate of completion"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="text"
            color="primary"
            sx={{
              textTransform: "none",
              fontWeight: "medium",
              color: "#5624d0",
              "&:hover": { color: "#401b9c" },
            }}
            startIcon={<ShareIcon sx={{ fontSize: 14 }} />}
            aria-label="Share course"
          >
            Share
          </Button>
          <Button
            variant="text"
            color="primary"
            sx={{
              textTransform: "none",
              fontWeight: "medium",
              color: "#5624d0",
              "&:hover": { color: "#401b9c" },
            }}
            startIcon={<CardGiftcardIcon sx={{ fontSize: 14 }} />}
            aria-label="Gift this course"
          >
            Gift
          </Button>
          <Button
            variant="text"
            color="primary"
            sx={{
              textTransform: "none",
              fontWeight: "medium",
              color: "#5624d0",
              "&:hover": { color: "#401b9c" },
            }}
            startIcon={<LocalOfferIcon sx={{ fontSize: 14 }} />}
            aria-label="Apply coupon"
          >
            Coupon
          </Button>
        </Box>
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="video-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: "90%", sm: "70%", md: "50%" },
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 2,
            outline: "none",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
            aria-label="Close video modal"
          >
            <CloseIcon />
          </IconButton>
          {previewVideoUrl && !videoError ? (
            <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
              {isYouTubeUrl(previewVideoUrl) ? (
                <iframe
                  src={getYouTubeEmbedUrl(previewVideoUrl)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <video
                  key={previewVideoUrl}
                  controls
                  src={previewVideoUrl}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                  }}
                >
                  <source src={previewVideoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </Box>
          ) : (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography color="error" sx={{ mb: 2 }}>
                {videoError || "No video available."}
              </Typography>
              {previewVideoUrl && (
                <Button
                  variant="outlined"
                  startIcon={<OpenInNewIcon />}
                  href={previewVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 1 }}
                  aria-label="Open video in new tab"
                >
                  Open Video in New Tab
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default CourseSidebar;