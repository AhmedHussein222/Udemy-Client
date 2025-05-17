import StarIcon from "@mui/icons-material/Star";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getInsCourses, getInstructorReviews } from "../../../Firebase/courses";

const udemyPurple = "#A435F0";
const udemyPurpleDark = "#5624d0";
const udemyGray = "#f7f7fa";

const Reviews = () => {
  const [coursesWithReviews, setCoursesWithReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await getInsCourses("2");
        const reviewsResponse = await getInstructorReviews("2");

        const processedCourses = coursesData.map(course => {
          let total = 0;
          let count = 0;
          let course_reviews = [];
          
          if (reviewsResponse.reviews && Array.isArray(reviewsResponse.reviews)) {
            reviewsResponse.reviews.forEach(review => {
              if (course.course_id === review.course_id) {
                count += 1;
                total += review.rating;
                course_reviews.push({
                  ...review,
                  name: review.student_name || "Anonymous",
                  date: review.created_at || new Date().toISOString().split('T')[0]
                });
              }
            });
          }

          return {
            id: course.course_id,
            name: course.title,
            average: count > 0 ? total / count : 0,
            total: count,
            reviews: course_reviews
          };
        });

        setCoursesWithReviews(processedCourses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // حساب المتوسط الكلي وعدد التقييمات الكلية
  const allReviews = coursesWithReviews.flatMap((course) => course.reviews);
  const totalReviewsCount = allReviews.length;
  const totalRatingSum = allReviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const overallAverage =
    totalReviewsCount > 0 ? totalRatingSum / totalReviewsCount : 0;

  return (
    <Box
      sx={{ p: { xs: 1, md: 4 }, background: udemyGray, minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{ color: udemyPurple }}
      >
        Student Feedback
      </Typography>
      {/* بطاقة المتوسط الكلي */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Paper
          sx={{
            p: 4,
            boxShadow: 4,
            background: `linear-gradient(90deg, #f3e7fe 0%, #fff 100%)`,
            borderRadius: 4,
            minWidth: 500,
            maxWidth: 500,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "white",
              color: udemyPurple,
              border: `3px solid ${udemyPurple}`,
              width: 64,
              height: 64,
              boxShadow: 2,
              mr: 3,
            }}
          >
            <StarIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: udemyPurpleDark, mb: 1 }}
            >
              Instructor Average Rating
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ color: udemyPurple }}
              >
                {overallAverage.toFixed(2)}
              </Typography>
              <Rating
                value={overallAverage}
                precision={0.1}
                readOnly
                size="large"
                sx={{ color: udemyPurple }}
              />
              <Typography variant="h6" color="text.secondary">
                ({totalReviewsCount} ratings)
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Box>
      {/* تفاصيل كل كورس */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 2 }}>
        {coursesWithReviews.map((course) => (
          <Paper
            key={course.id}
            sx={{
              p: 3,
              boxShadow: 2,
              background: "#fff",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
              sx={{ color: udemyPurpleDark }}
            >
              {course.name}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: udemyPurple,
                  border: `2px solid ${udemyPurple}`,
                }}
              >
                <StarIcon />
              </Avatar>
              <Typography variant="subtitle2">Average Rating:</Typography>
              <Typography variant="h6" fontWeight="bold">
                {course.average.toFixed(1)}
              </Typography>
              <Rating
                value={course.average}
                precision={0.1}
                readOnly
                size="medium"
                sx={{ color: udemyPurple }}
              />
              <Typography variant="body2">({course.total} reviews)</Typography>
            </Stack>
            <Divider
              sx={{ mb: 2, bgcolor: udemyPurple, height: 2, borderRadius: 1 }}
            />
            {course.reviews.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={2}>
                No reviews yet for this course
              </Typography>
            ) : (
              <Box>
                {course.reviews.map((review) => (
                  <Box
                    key={review.reviewId}
                    sx={{ mb: 2, background: udemyGray, borderRadius: 2, p: 2 }}
                  >
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item>
                        <Avatar sx={{ bgcolor: udemyPurple, color: "white" }}>
                          {review.name[0]}
                        </Avatar>
                      </Grid>
                      <Grid item xs>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            fontWeight="bold"
                            sx={{ color: udemyPurpleDark }}
                          >
                            {review.name}
                          </Typography>
                          <Rating
                            value={review.rating}
                            readOnly
                            size="small"
                            sx={{ color: udemyPurple }}
                          />
                          <Typography color="text.secondary" variant="body2">
                            ({review.date})
                          </Typography>
                        </Stack>
                        <Typography mt={1}>{review.comment}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Reviews;
