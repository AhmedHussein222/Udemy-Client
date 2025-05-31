import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Link as LinkIcon, Facebook, Twitter, YouTube } from "@mui/icons-material";
import { db, doc, getDoc, collection, query, where, getDocs } from "../Firebase/firebase.js";

export default function InstructorProfile() {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalLearners, setTotalLearners] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const instructorRef = doc(db, "Users", id);
        const instructorSnap = await getDoc(instructorRef);

        if (!instructorSnap.exists()) {
          setError("Instructor not found");
          setLoading(false);
          return;
        }

        const instructorData = instructorSnap.data();
        setInstructor(instructorData);

        const coursesQuery = query(
          collection(db, "Courses"),
          where("instructor_id", "==", id)
        );
        const coursesSnap = await getDocs(coursesQuery);

        const coursesData = coursesSnap.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || "Untitled Course",
          thumbnail: doc.data().thumbnail || "https://via.placeholder.com/200x120",
          price: doc.data().price,
        }));
        setCourses(coursesData);

        let reviewsCount = 0;
        let learnersCount = 0;

        for (const course of coursesSnap.docs) {
          const courseId = course.id;

          const reviewsQuery = query(
            collection(db, "Reviews"),
            where("course_id", "==", courseId)
          );
          const reviewsSnap = await getDocs(reviewsQuery);
          reviewsCount += reviewsSnap.size;

          const enrollmentsQuery = query(
            collection(db, "Enrollments"),
            where("course_id", "==", courseId)
          );
          const enrollmentsSnap = await getDocs(enrollmentsQuery);
          learnersCount += enrollmentsSnap.size;
        }

        setTotalReviews(reviewsCount);
        setTotalLearners(learnersCount);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching instructor data, courses, reviews, or enrollments:", err);
        setError("Failed to load instructor data, courses, reviews, or enrollments");
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "grey.50",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!instructor) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography>No instructor data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper
          sx={{
            background: "linear-gradient(135deg, #f3e8ff 0%, #dbeafe 100%)",
            borderRadius: 2,
            p: 4,
            mb: 4,
          }}
        >
          <Grid container spacing={8} alignItems="flex-start" sx={{ justifyContent: "space-between" }}>
            <Grid item xs={12} lg={7}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="overline"
                  sx={{
                    fontWeight: 600,
                    color: "grey.600",
                    letterSpacing: 1.5,
                    mb: 1,
                    display: "block",
                  }}
                >
                  INSTRUCTOR
                </Typography>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: "bold",
                    color: "grey.900",
                    mb: 1,
                  }}
                >
                  {`${instructor.first_name} ${instructor.last_name}`}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "grey.700",
                    mb: 2,
                  }}
                >
                  {instructor.bio}
                </Typography>
                <Chip
                  label="Instructor Partner"
                  sx={{
                    bgcolor: "#7c3aed",
                    color: "white",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: "#6d28d9",
                    },
                  }}
                />
              </Box>
              <Grid container spacing={4} sx={{ mt: 4 }}>
                <Grid item>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      color: "grey.900",
                    }}
                  >
                    {totalLearners.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" color="grey.600">
                    Total learners
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      color: "grey.900",
                    }}
                  >
                    {totalReviews.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" color="grey.600">
                    Reviews
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={5}>
              <Paper
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  p: 3,
                  boxShadow: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar
                  src={instructor.profile_picture}
                  alt={`${instructor.first_name} ${instructor.last_name}`}
                  sx={{
                    width: 128,
                    height: 128,
                    fontSize: "2rem",
                    bgcolor: "#bbf7d0",
                  }}
                >
                  {instructor.first_name.charAt(0) + instructor.last_name.charAt(0)}
                </Avatar>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    sx={{
                      bgcolor: "white",
                      border: "1px solid",
                      borderColor: "grey.300",
                      color: "primary.main",
                      "&:hover": {
                        bgcolor: "grey.50",
                        color: "primary.dark",
                      },
                    }}
                    href={instructor.links.linkedin}
                  >
                    <LinkIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: "white",
                      border: "1px solid",
                      borderColor: "grey.300",
                      color: "primary.main",
                      "&:hover": {
                        bgcolor: "grey.50",
                        color: "primary.dark",
                      },
                    }}
                    href={instructor.links.facebook}
                  >
                    <Facebook fontSize="small" />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: "white",
                      border: "1px solid",
                      borderColor: "grey.300",
                      color: "primary.main",
                      "&:hover": {
                        bgcolor: "grey.50",
                        color: "primary.dark",
                      },
                    }}
                    href={instructor.links.instagram}
                  >
                    <Twitter fontSize="small" />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: "white",
                      border: "1px solid",
                      borderColor: "grey.300",
                      color: "primary.main",
                      "&:hover": {
                        bgcolor: "grey.50",
                        color: "primary.dark",
                      },
                    }}
                    href={instructor.links.youtube}
                  >
                    <YouTube fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
        <Paper
          sx={{
            borderRadius: 2,
            p: 4,
            mb: 4,
            boxShadow: 1,
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: "bold",
              color: "grey.900",
              mb: 3,
            }}
          >
            About me
          </Typography>
          <Box sx={{ color: "grey.700", lineHeight: 1.7 }}>
            <Typography paragraph>
              {instructor.bio || "No bio available."}
            </Typography>
            <Typography paragraph>
              I have been teaching since {new Date(instructor.created_at).getFullYear()}.
            </Typography>
            <Typography paragraph>
              Email: {instructor.email}
            </Typography>
            <Typography>
              Gender: {instructor.gender.charAt(0).toUpperCase() + instructor.gender.slice(1)}
            </Typography>
          </Box>
        </Paper>
        <Paper
          sx={{
            borderRadius: 2,
            p: 4,
            boxShadow: 1,
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: "bold",
              color: "grey.900",
              mb: 3,
            }}
          >
            My courses ({courses.length})
          </Typography>
          {courses.length > 0 ? (
            <Grid container spacing={3}>
              {courses.map((course) => (
                <Grid item xs={12} md={6} lg={4} key={course.id}>
                  <Link to={`/course/${course.id}`} style={{ textDecoration: "none" }}>
                    <Card
                      sx={{
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          "& .course-image": {
                            transform: "scale(1.05)",
                          },
                          "& .course-title": {
                            color: "#7c3aed",
                          },
                        },
                      }}
                    >
                      <Box sx={{ position: "relative", overflow: "hidden" }}>
                        <CardMedia
                          component="img"
                          height="160"
                          image={course.thumbnail}
                          alt={course.title}
                          className="course-image"
                          sx={{
                            transition: "transform 0.2s",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            console.error("Image failed to load:", course.thumbnail);
                            e.target.src = "https://via.placeholder.com/200x120";
                          }}
                        />
                      </Box>
                      <CardContent sx={{ pt: 2 }}>
                        <Typography
                          variant="h6"
                          className="course-title"
                          sx={{
                            fontWeight: 600,
                            color: "grey.900",
                            transition: "color 0.2s",
                          }}
                        >
                          {course.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          className="course-title"
                          sx={{
                            fontWeight: 600,
                            color: "grey.900",
                            transition: "color 0.2s",
                          }}
                        >
                          {course.price}$
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="grey.600">
              No courses available for this instructor.
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
}