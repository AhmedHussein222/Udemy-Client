/* eslint-disable no-unused-vars */
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import {
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  addReview,
  geCourseLessons,
  getCourseById,
  getCourseReviews,
} from "../Firebase/courses";
import { auth } from "../Firebase/firebase";

const tabContents = (
  selectedCourse,
  courseReviews = [],
  courseLessons = [],
  tabContentProps = {}
) => ({
  Overview: (
    <Box sx={{ py: 2, px: 5 }}>
      {/* Title */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          mb: 2,
          lineHeight: 1.3,
          fontSize: 26,
          color: "#1c2526",
          fontFamily: "Montserrat, Roboto, Arial",
        }}
      >
        {selectedCourse?.title ||
          "Learn OOP, SOLID principles with Java examples. Implement backend part for online store by the end of the course"}
      </Typography>

      {/* Stats */}
      <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 1.5 }}>
        <Typography sx={{ color: "#b4690e", fontWeight: 700, fontSize: 18 }}>
          {selectedCourse?.rating?.rate ?? 4.5}
        </Typography>
        <Typography sx={{ color: "#b4690e", fontWeight: 700, fontSize: 18 }}>
          ★
        </Typography>
        <Typography sx={{ color: "#6a6f73", fontSize: 15 }}>
          {selectedCourse?.rating?.count
            ? `${selectedCourse.rating.count} ratings`
            : "0 ratings"}
        </Typography>
        {/* You can add students count if available */}
        <Typography sx={{ color: "#6a6f73", fontSize: 15 }}>
          {/* Placeholder or actual students count */}
        </Typography>
        <Typography sx={{ color: "#6a6f73", fontSize: 15 }}>
          {selectedCourse?.duration
            ? `${selectedCourse.duration} min`
            : "1 hours"}
        </Typography>
      </Stack>
      <Typography sx={{ color: "#6a6f73", fontSize: 15, mb: 1 }}>
        <span>
          Last updated{" "}
          {selectedCourse?.created_at
            ? new Date(selectedCourse.created_at).toLocaleDateString()
            : "February 2025"}
        </span>
      </Typography>

      {/* By the numbers */}
      <Stack direction="row" spacing={5} sx={{ mb: 3, pl: 1 }}>
        <Box>
          <Typography sx={{ color: "#6a6f73", fontSize: 14 }}>
            Skill level:
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
            Intermediate Level
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ color: "#6a6f73", fontSize: 14 }}>
            Lectures:
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
            {courseLessons.length}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ color: "#6a6f73", fontSize: 14 }}>
            Video:
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
            {selectedCourse?.duration
              ? `${selectedCourse.duration} min`
              : "15 total hours"}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ color: "#6a6f73", fontSize: 14 }}>
            Languages:
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
            {selectedCourse?.language || "English"}
          </Typography>
        </Box>
      </Stack>

      {/* Description */}
      <Box sx={{ bgcolor: "#fff", borderRadius: 2, p: 0, mb: 2 }}>
        <Typography sx={{ color: "#2d2f31", fontSize: 16, mb: 1 }}>
          {selectedCourse?.description ||
            "From this course, you can learn Object-Oriented Programming from basics to advanced concepts."}
        </Typography>
        {selectedCourse?.what_will_learn && (
          <>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              What you'll learn
            </Typography>
            <ul style={{ marginTop: 0, marginBottom: 16, paddingLeft: 24 }}>
              {selectedCourse.what_will_learn.map((item, idx) => (
                <li key={idx} style={{ color: "#444", marginBottom: 4 }}>
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}
        {selectedCourse?.requirements && (
          <>
            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              Requirements
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 0, mt: 0 }}>
              {selectedCourse.requirements.map((item, idx) => (
                <Box
                  component="li"
                  key={idx}
                  sx={{
                    color: "#444",
                    mb: 0.5,
                    fontSize: 15,
                    fontFamily: "inherit",
                    listStyle: "disc",
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box>
          </>
        )}
       
      </Box>
    </Box>
  ),

  Notes: (
    <Box sx={{ py: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Notes
      </Typography>
      <Typography sx={{ color: "#444" }}>
        Add your personal notes here to keep track of important points during
        the course.
      </Typography>
    </Box>
  ),

  Reviews: (
    <Box sx={{ py: 2, px: 5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Reviews
      </Typography>
      {/* Add Review Section */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          bgcolor: "#f7f9fa",
          borderRadius: 2,
          border: "1px solid #e4e9f0",
        }}
      >
        <Typography sx={{ fontWeight: 600, mb: 1, fontSize: 18 }}>
          Add your review
        </Typography>
        <form
          onSubmit={tabContentProps.handleSubmit?.(
            tabContentProps.onSubmitReview
          )}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Typography sx={{ fontWeight: 500 }}>Your Rating:</Typography>
            {/* Editable star rating input */}
            <Stack direction="row" spacing={0.5}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i + 1}
                  style={{
                    fontSize: 24,
                    color:
                      (tabContentProps.hoverRating ||
                        tabContentProps.addReviewRating) >=
                      i + 1
                        ? "#b4690e"
                        : "#ccc",
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "color 0.2s",
                  }}
                  onClick={() =>
                    tabContentProps.setAddReviewRating &&
                    tabContentProps.setAddReviewRating(i + 1)
                  }
                  onMouseEnter={() =>
                    tabContentProps.setHoverRating &&
                    tabContentProps.setHoverRating(i + 1)
                  }
                  onMouseLeave={() =>
                    tabContentProps.setHoverRating &&
                    tabContentProps.setHoverRating(0)
                  }
                >
                  {(tabContentProps.hoverRating ||
                    tabContentProps.addReviewRating) >=
                  i + 1
                    ? "★"
                    : "☆"}
                </span>
              ))}
            </Stack>
          </Stack>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <textarea
              rows={3}
              placeholder="Write your review here..."
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid #ccc",
                padding: 10,
                fontSize: 16,
                fontFamily: "inherit",
                resize: "vertical",
              }}
              {...(tabContentProps.register
                ? tabContentProps.register("reviewText")
                : {})}
              value={tabContentProps.addReviewText || ""}
              onChange={(e) =>
                tabContentProps.setAddReviewText &&
                tabContentProps.setAddReviewText(e.target.value)
              }
            />
            <input
              type="hidden"
              {...(tabContentProps.register
                ? tabContentProps.register("rating")
                : {})}
              value={tabContentProps.addReviewRating || 0}
              readOnly
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#a435f0",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                alignSelf: "flex-end",
                "&:hover": { bgcolor: "#7c28c6" },
              }}
            >
              Submit Review
            </Button>
          </Box>
        </form>
      </Box>
      {courseReviews.length === 0 ? (
        <Typography sx={{ color: "#888", fontSize: 16 }}>
          No reviews yet for this course.
        </Typography>
      ) : (
        <Stack spacing={4}>
          {courseReviews.map((review, idx) => {
            // Get initials for avatar
            const initials = review.userName
              ? review.userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "U";
            // Calculate days ago
            let daysAgo = "";
            if (review.date) {
              const reviewDate = new Date(review.date);
              const now = new Date();
              const diffTime = Math.abs(now - reviewDate);
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              daysAgo =
                diffDays === 0
                  ? "today"
                  : `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
            }
            return (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  pb: 3,
                  borderBottom: "1px solid #eee",
                }}
              >
                {/* Avatar */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    bgcolor: "#23232a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 22,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </Box>
                {/* Review Content */}
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography
                      sx={{ fontWeight: 700, fontSize: 22, color: "#23232a" }}
                    >
                      {review.userName}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {Array.from({ length: review.rating || 5 }).map(
                        (_, i) => (
                          <span
                            key={i}
                            style={{ color: "#b4690e", fontSize: 22 }}
                          >
                            ★
                          </span>
                        )
                      )}
                    </Stack>
                    <Typography sx={{ color: "#6a6f73", fontSize: 16, ml: 2 }}>
                      {daysAgo}
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{ color: "#23232a", fontSize: 18, mt: 1, mb: 1 }}
                  >
                    {review.comment || review.text || "No comment provided."}
                  </Typography>
                  <Typography sx={{ color: "#6a6f73", fontSize: 15, mb: 1 }}>
                    Was this review helpful?
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: "50%",
                        minWidth: 44,
                        width: 44,
                        height: 44,
                        p: 0,
                        borderColor: "#a435f0",
                        color: "#a435f0",
                        "&:hover": {
                          bgcolor: "#f7f9fa",
                          borderColor: "#a435f0",
                        },
                      }}
                    >
                      <ThumbUpAltOutlinedIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: "50%",
                        minWidth: 44,
                        width: 44,
                        height: 44,
                        p: 0,
                        borderColor: "#a435f0",
                        color: "#a435f0",
                        "&:hover": {
                          bgcolor: "#f7f9fa",
                          borderColor: "#a435f0",
                        },
                      }}
                    >
                      <ThumbDownAltOutlinedIcon />
                    </Button>
                    <Button
                      variant="text"
                      sx={{
                        color: "#23232a",
                        fontWeight: 600,
                        textTransform: "none",
                        ml: 1,
                        fontSize: 16,
                        "&:hover": {
                          textDecoration: "underline",
                          bgcolor: "transparent",
                        },
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                      startIcon={<FlagOutlinedIcon sx={{ fontSize: 20 }} />}
                    >
                      Report
                    </Button>
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  ),
});

const CourseCondent = ({ courseId }) => {
  const [selectedTab, setSelectedTab] = React.useState("Overview");
  const [selectedCourse, setSelectedCourse] = React.useState();
  const [courseLessons, setCourseLessons] = React.useState([]);
  const [currentVideoUrl, setCurrentVideoUrl] = React.useState(null);
  const [courseReviews, setCourseReviews] = React.useState([]);
  const [addReviewRating, setAddReviewRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [addReviewText, setAddReviewText] = React.useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // React Hook Form setup
  const { register, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: {
      reviewText: "",
      rating: 0,
    },
  });

  // Keep local state in sync with react-hook-form for rating
  const watchedRating = watch("rating");
  const watchedText = watch("reviewText");

  useEffect(() => {
    // Prevent infinite loop by only fetching on mount
    const fetchData = async () => {
      const course = await getCourseById("1");
      setSelectedCourse(course);
      const lessons = await geCourseLessons("1");
      setCourseLessons(lessons);
      if (lessons && lessons.length > 0) {
        setCurrentVideoUrl(lessons[0].video_url || "");
      }
      const reviews = await getCourseReviews("3");
      setCourseReviews(reviews);
    };
    fetchData();
  }, []); // Only run once on mount

  // When lessons change, update video if needed
  useEffect(() => {
    if (courseLessons.length > 0 && !currentVideoUrl) {
      setCurrentVideoUrl(courseLessons[0].video_url || "");
    }
  }, [courseLessons, currentVideoUrl]);

  // Add review submit handler
  const onSubmitReview = async (data) => {
    const review = {
      user_id: auth.currentUser?.uid,
      rating: data.rating,
      comment: data.reviewText,
      course_id: selectedCourse?.course_id || "1",
      date: new Date().toISOString(),
    };
    try {
      await addReview(auth.currentUser?.uid, review);
      setCourseReviews([
        {
          userName: auth.currentUser?.displayName || "Anonymous",
          rating: data.rating,
          comment: data.reviewText,
          date: review.date,
        },
        ...courseReviews,
      ]);
      reset();
      setAddReviewRating(0);
      
      setHoverRating(0);
      setAddReviewText("");
      Swal.fire({
        title: "Review Added",
        text: "Your review has been added successfully.",
        icon: "success",
        confirmButtonText: "OK",
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  // Pass state setters and react-hook-form to tabContents for Add Review section
  const tabContentProps = {
    addReviewRating: watchedRating,
    setAddReviewRating: (val) => {
      setAddReviewRating(val);
      setValue("rating", val);
    },
    hoverRating,
    setHoverRating,
    addReviewText: watchedText,
    setAddReviewText: (val) => {
      setAddReviewText(val);
      setValue("reviewText", val);
    },
    handleSubmit,
    onSubmitReview,
    register,
  };

  // Responsive tab list: add "Course content" as a tab on small screens
  const responsiveTabList = isSmallScreen
    ? ["Overview", "Course content", "Reviews"]
    : ["Overview", "Reviews"];

  return (
    <Box sx={{ bgcolor: "#f7f9fa", minHeight: "100vh", pb: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: "center",
          mt: 0,
          px: isSmallScreen ? 0 : 3,
          py: 4,
          gap: isSmallScreen ? 0 : 4,
        }}
      >
        {/* Video & Main Content */}
        <Box
          sx={{
            width: isSmallScreen ? "100%" : "70%",
            bgcolor: "#fff",
            pt: 3,
            borderRadius: 3,
            boxShadow: "0 2px 16px 0 rgba(44,51,73,0.07)",
            minHeight: 900,
            mb: isSmallScreen ? 3 : 0,
          }}
        >
          {/* Video */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              mb: 3,
              boxShadow: "0 2px 8px 0 rgba(44,51,73,0.07)",
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 1.5,
                bgcolor: "#f7f9fa",
                borderTop: "1px solid #eee",
              }}
            >
              {/* Fix: Only render <video> if currentVideoUrl is a valid video link */}
              {currentVideoUrl != null ? (
                <iframe
                  width="100%"
                  height={isSmallScreen ? 220 : 516}
                  src={
                    "https://www.youtube.com/embed/" + currentVideoUrl.slice(17)
                  }
                  title={selectedCourse?.title || "Course Video"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{
                    borderRadius: 10,
                    width: "100%",
                    maxHeight: isSmallScreen ? "70%" : "80%",
                  }}
                ></iframe>
              ) : (
                <img
                  src={selectedCourse?.thumbnail}
                  alt={selectedCourse?.title}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    objectFit: "cover",
                    maxHeight: isSmallScreen ? 220 : 320,
                  }}
                />
              )}
            </Box>
          </Paper>

          {/* Responsive Tabs */}
          <Box sx={{ mb: 3, pl: 1 }}>
            {isSmallScreen ? (
              <Tabs
                value={responsiveTabList.indexOf(selectedTab)}
                onChange={(_, idx) => setSelectedTab(responsiveTabList[idx])}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: "1px solid #e4e9f0",
                  mb: 2,
                }}
              >
                {responsiveTabList.map((tab) => (
                  <Tab
                    key={tab}
                    label={tab}
                    sx={{
                      fontWeight: 600,
                      fontSize: 16,
                      color: selectedTab === tab ? "#1c2526" : "#757575",
                      borderBottom:
                        selectedTab === tab
                          ? "2.5px solid #a435f0"
                          : "2.5px solid transparent",
                      pb: 0.5,
                      textTransform: "none",
                    }}
                  />
                ))}
              </Tabs>
            ) : (
              <Stack direction="row" spacing={4}>
                {responsiveTabList.map((tab) => (
                  <Typography
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    sx={{
                      fontWeight: 600,
                      fontSize: 16,
                      color: selectedTab === tab ? "#1c2526" : "#757575",
                      cursor: "pointer",
                      borderBottom:
                        selectedTab === tab
                          ? "2.5px solid #a435f0"
                          : "2.5px solid transparent",
                      pb: 0.5,
                      transition: "border 0.2s",
                      "&:hover": {
                        color: "#a435f0",
                      },
                    }}
                  >
                    {tab}
                  </Typography>
                ))}
              </Stack>
            )}
          </Box>

          {/* Tab Content or Course Content for small screens */}
          <Box sx={{ padding: isSmallScreen ? 2 : "50" }}>
            {selectedTab === "Course content" && isSmallScreen ? (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    mb: 2,
                    fontSize: 20,
                    color: "#1c2526",
                    fontFamily: "Montserrat, Roboto, Arial",
                    letterSpacing: 0.5,
                  }}
                >
                  Course content
                </Typography>
                <List dense disablePadding>
                  {courseLessons && courseLessons.length > 0 ? (
                    courseLessons
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((lesson, idx) => (
                        <ListItem
                          key={lesson.lesson_id || idx}
                          sx={{
                            bgcolor: idx === 0 ? "#f7f9fa" : "transparent",
                            borderRadius: 1,
                            mb: 0.5,
                            pl: 0.5,
                            pr: 1,
                            minHeight: 44,
                            display: "flex",
                            alignItems: "center",
                            transition: "background 0.2s",
                            "&:hover": {
                              bgcolor: "#f0f4fa",
                            },
                            cursor: lesson.video_url ? "pointer" : "default",
                          }}
                          onClick={() => {
                            if (lesson.video_url) {
                              setCurrentVideoUrl(lesson.video_url);
                            }
                          }}
                        >
                          <Checkbox size="small" sx={{ p: 0.5 }} />
                          <ListItemText
                            primary={
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                              >
                                <Typography
                                  sx={{
                                    fontSize: 15,
                                    fontWeight: idx === 0 ? 700 : 500,
                                    color: "#1c2526",
                                  }}
                                >
                                  {lesson.title}
                                </Typography>
                                <Typography
                                  sx={{ color: "#6a6f73", fontSize: 14 }}
                                >
                                  {lesson.duration
                                    ? `${lesson.duration} min`
                                    : ""}
                                </Typography>
                                {lesson.is_preview && (
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                      ml: 1,
                                      color: "#1c2526",
                                      borderColor: "#d1d7dc",
                                      fontSize: 12,
                                      textTransform: "none",
                                      px: 1.5,
                                      py: 0.2,
                                      minWidth: 0,
                                      borderRadius: 1,
                                      "&:hover": {
                                        borderColor: "#a435f0",
                                        bgcolor: "#f7f9fa",
                                      },
                                    }}
                                  >
                                    Preview
                                  </Button>
                                )}
                              </Stack>
                            }
                            secondary={
                              lesson.description && (
                                <Typography
                                  sx={{ color: "#888", fontSize: 13 }}
                                >
                                  {lesson.description}
                                </Typography>
                              )
                            }
                            sx={{ m: 0 }}
                          />
                        </ListItem>
                      ))
                  ) : (
                    <Typography sx={{ color: "#888", fontSize: 15, p: 2 }}>
                      No lessons available.
                    </Typography>
                  )}
                </List>
              </Box>
            ) : (
              tabContents(
                selectedCourse,
                courseReviews,
                courseLessons,
                tabContentProps // pass props for add review
              )[selectedTab]
            )}
          </Box>
        </Box>

        {/* Course Content Sidebar (hidden on small screens) */}
        {!isSmallScreen && (
          <Box
            sx={{
              width: "30%",
              bgcolor: "#fff",
              borderLeft: "1.5px solid #e4e9f0",
              pt: 3,
              pl: 3,
              pr: 1,
              position: "sticky",
              top: 0,
              borderRadius: 3,
              boxShadow: "0 2px 16px 0 rgba(44,51,73,0.07)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: 20,
                color: "#1c2526",
                fontFamily: "Montserrat, Roboto, Arial",
                letterSpacing: 0.5,
              }}
            >
              Course content
            </Typography>
            <List dense disablePadding>
              {courseLessons && courseLessons.length > 0 ? (
                courseLessons
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((lesson, idx) => (
                    <ListItem
                      key={lesson.lesson_id || idx}
                      sx={{
                        bgcolor: idx === 0 ? "#f7f9fa" : "transparent",
                        borderRadius: 1,
                        mb: 0.5,
                        pl: 0.5,
                        pr: 1,
                        minHeight: 44,
                        display: "flex",
                        alignItems: "center",
                        transition: "background 0.2s",
                        "&:hover": {
                          bgcolor: "#f0f4fa",
                        },
                        cursor: lesson.video_url ? "pointer" : "default",
                      }}
                      onClick={() => {
                        if (lesson.video_url) {
                          setCurrentVideoUrl(lesson.video_url);
                        }
                      }}
                    >
                      <Checkbox size="small" sx={{ p: 0.5 }} />
                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Typography
                              sx={{
                                fontSize: 15,
                                fontWeight: idx === 0 ? 700 : 500,
                                color: "#1c2526",
                              }}
                            >
                              {lesson.title}
                            </Typography>
                            <Typography sx={{ color: "#6a6f73", fontSize: 14 }}>
                              {lesson.duration ? `${lesson.duration} min` : ""}
                            </Typography>
                            {lesson.is_preview && (
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{
                                  ml: 1,
                                  color: "#1c2526",
                                  borderColor: "#d1d7dc",
                                  fontSize: 12,
                                  textTransform: "none",
                                  px: 1.5,
                                  py: 0.2,
                                  minWidth: 0,
                                  borderRadius: 1,
                                  "&:hover": {
                                    borderColor: "#a435f0",
                                    bgcolor: "#f7f9fa",
                                  },
                                }}
                              >
                                Preview
                              </Button>
                            )}
                          </Stack>
                        }
                        secondary={
                          lesson.description && (
                            <Typography sx={{ color: "#888", fontSize: 13 }}>
                              {lesson.description}
                            </Typography>
                          )
                        }
                        sx={{ m: 0 }}
                      />
                    </ListItem>
                  ))
              ) : (
                <Typography sx={{ color: "#888", fontSize: 15, p: 2 }}>
                  No lessons available.
                </Typography>
              )}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CourseCondent;
