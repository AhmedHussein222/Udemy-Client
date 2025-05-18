import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  deleteCourse,
  getInsCourses,
} from "../../../../Firebase/courses";

function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = React.useState([]);
  useEffect(() => {
    getInsCourses("2")
      .then((res) => {
        setCourses(res);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        Alert(error.message);
      });
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 6 }}>
        <Card sx={{ minWidth: 300, px: 2, mx: 3, my: 5, boxShadow: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="space-around"
          >
            <CardContent>
              <Typography
                variant="body1"
                component="div"
                sx={{ textAlign: "center", fontSize: "1.2rem" }}
              >
                Jump Into Course Creation
              </Typography>
            </CardContent>

            <CardContent sx={{ textAlign: { xs: "center", md: "left" } }}>
              <CardActions>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/instructor/edit")}
                  sx={{
                    backgroundColor: "#8000ff",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "4px",
                    py: 1.2,
                    mt: 1,
                    "&:hover": { backgroundColor: "#6a1b9a" },
                  }}
                >
                  Create Your Course
                </Button>
              </CardActions>
            </CardContent>
          </Stack>
        </Card>
      </Box>
      <Box sx={{ mb: 4 }}>
        {courses?.length > 0 ? (
          <Grid container spacing={3} justifyContent="center">
            {courses.map((course) => (
              <Grid item xs={12} md={10} key={course.course_id}>
                <Card
                  sx={{
                    p: 2,
                    boxShadow: 3,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    alignItems="center"
                  >
                    <Box
                      component="img"
                      src={course?.thumbnail}
                      sx={{
                        width: { xs: "100%", md: "200px" },
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: 2,
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" gutterBottom fontWeight="bold">
                        {course?.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: course?.is_published
                            ? "success.main"
                            : "text.secondary",
                          fontWeight: 600,
                        }}
                      >
                        {course?.is_published ? "Published" : "Draft"}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={() =>
                            navigate(`/instructor/edit`, { state: { course } })
                          }
                          sx={{
                            background:
                              "linear-gradient(45deg, #8000ff, #6a1b9a)",
                            color: "#fff",
                            "&:hover": {
                              background:
                                "linear-gradient(45deg, #6a1b9a, #8000ff)",
                            },
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            Swal.fire({
                              title: "Are you sure?",
                              text: "You won't be able to revert this!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Yes, delete it!",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                deleteCourse(course.course_id)
                                  .then(() => {
                                    setCourses(prevCourses => 
                                      prevCourses.filter(c => c.course_id !== course.course_id)
                                    );
                                    Swal.fire({
                                      title: "Course!",
                                      text: "Course deleted successfully",
                                      icon: "success",
                                    });
                                  })
                                  .catch((error) => {
                                    console.error("Error deleting course:", error);
                                    Swal.fire({
                                      title: "Error!",
                                      text: "Failed to delete course. Please try again",
                                      icon: "error",
                                    });
                                  });
                              } 
                            });
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </CardContent>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" textAlign="center" color="text.secondary">
            No courses found
          </Typography>
        )}
      </Box>

      <Box textAlign={"center"} sx={{ mb: 6 }}>
        <Typography variant="body1">
          Based on your experience, we think these resources will be helpful.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Card sx={{ minWidth: 300, px: 2, mx: 3, boxShadow: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="space-around"
          >
            <Box
              component="img"
              src="https://s.udemycdn.com/instructor/dashboard/engaging-course.jpg"
              sx={{
                width: { xs: "100%", md: "auto" },
                height: { xs: "auto", md: "10rem" },
                maxHeight: "200px",
                objectFit: "cover",
              }}
            />
            <CardContent sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Create an Engaging Course
              </Typography>
              <Typography variant="body1">
                Whether you've been teaching for years or are teaching for the
                first time, you can
                <br />
                make an engaging course. We've compiled resources and best
                practices to help you
                <br />
                get to the next level, no matter where you're starting.
              </Typography>
              <Link color="#6a1b9a">Get Started</Link>
            </CardContent>
          </Stack>
        </Card>
      </Box>

      <Box sx={{ px: 2, mb: 4 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "center", md: "stretch" }}
        >
          <Card
            sx={{
              minWidth: 300,
              width: { xs: "100%", md: "48%" },
              px: 2,
              boxShadow: 3,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
              justifyContent="space-around"
            >
              <Box
                component="img"
                src="https://s.udemycdn.com/instructor/dashboard/video-creation.jpg"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  height: { xs: "auto", sm: "10rem" },
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography variant="body1" gutterBottom fontWeight="bold">
                  Get Started with Video
                </Typography>
                <Typography variant="body1">
                  Quality video lectures can set your course apart. Use our
                  resources to learn the basics.
                </Typography>
                <Link color="#6a1b9a">Get Started</Link>
              </CardContent>
            </Stack>
          </Card>

          <Card
            sx={{
              minWidth: 300,
              width: { xs: "100%", md: "48%" },
              px: 2,
              boxShadow: 3,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
              justifyContent="space-around"
            >
              <Box
                component="img"
                src="https://s.udemycdn.com/instructor/dashboard/build-audience.jpg"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  height: { xs: "auto", sm: "10rem" },
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography variant="body1" gutterBottom fontWeight="bold">
                  Build Your Audience
                </Typography>
                <Typography variant="body1">
                  Set your course up for success by building your audience.
                </Typography>
                <Link color="#6a1b9a">Get Started</Link>
              </CardContent>
            </Stack>
          </Card>
        </Stack>
      </Box>

      <Box sx={{ px: 2, mb: 7 }}>
        <Card sx={{ minWidth: 300, px: 2, mx: 3, boxShadow: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="space-around"
          >
            <Box
              component="img"
              src="https://s.udemycdn.com/instructor/dashboard/newcomer-challenge.jpg"
              sx={{
                width: { xs: "100%", md: "auto" },
                height: { xs: "auto", md: "10rem" },
                objectFit: "cover",
              }}
            />
            <CardContent sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Join the New Instructor Challenge!
              </Typography>
              <Typography variant="body1" gutterBottom>
                Get exclusive tips and resources designed to help you launch
                <br />
                your first course faster! Eligible instructors who publish their{" "}
                <br />
                first course on time will receive a special bonus to celebrate.{" "}
                <br />
                Start today!
              </Typography>
              <Link color="#6a1b9a">Get Started</Link>
            </CardContent>
          </Stack>
        </Card>
      </Box>

      <Box textAlign={"center"} sx={{ mb: 6 }}>
        <Typography>
          Have questions? Here are our most popular instructor resources.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} direction="row" justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box
              sx={{
                py: 4,
                px: 2,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                srcSet="https://frontends.udemycdn.com/design-system/icons-expressive/v1/light/1x/relevance-1.webp 1x, https://frontends.udemycdn.com/design-system/icons-expressive/v1/light/2x/relevance-1.webp 2x"
                width={50}
                height={50}
              />
              <Link
                color="#6d28d2"
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
              >
                Test Video
              </Link>
              <Typography variant="subtitle2">
                Send us a sample video and get
                <br /> expert feedback.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box
              sx={{
                py: 4,
                px: 2,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                srcSet="https://frontends.udemycdn.com/design-system/icons-expressive/v1/light/1x/communication.webp 1x, https://frontends.udemycdn.com/design-system/icons-expressive/v1/light/2x/communication.webp 2x"
                width={50}
                height={50}
              />
              <Link
                color="#6d28d2"
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
              >
                Instructor Community
              </Link>
              <Typography variant="subtitle2">
                Connect with experienced <br /> instructors. Ask questions,{" "}
                <br /> browse discussions, and more.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box
              sx={{
                py: 4,
                px: 2,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                srcSet="https://frontends.udemycdn.com/design-system/icons-expressive/v1/light/1x/instructor.webp 1x, https://frontends.udemycdn.com/design-system/icons-expressive/v1/light/2x/instructor.webp 2x"
                width={50}
                height={50}
              />
              <Link
                color="#6d28d2"
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
              >
                Teaching Center
              </Link>
              <Typography variant="subtitle2">
                Learn about best practices for <br /> teaching on Udemy.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box
              sx={{
                py: 4,
                px: 2,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                srcSet="https://frontends.udemycdn.com/design-system/icons-expressive/v1/light/1x/impact-measurement.webp 1x, https://frontends.udemycdn.com/design-system/icons-expressive/v1/light/2x/impact-measurement.webp 2x"
                width={50}
                height={50}
              />
              <Link
                color="#6d28d2"
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
              >
                Marketplace Insights
              </Link>
              <Typography variant="subtitle2">
                Validate your course topic <br /> by exploring our marketplace{" "}
                <br /> supply and demand.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box
              sx={{
                py: 4,
                px: 2,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                srcSet="https://frontends.udemycdn.com/design-system/icons-expressive/v1/light/1x/soft-skills.webp 1x, https://frontends.udemycdn.com/design-system/icons-expressive/v1/light/2x/soft-skills.webp 2x"
                width={50}
                height={50}
              />
              <Link
                color="#6d28d2"
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
              >
                Help and Support
              </Link>
              <Typography variant="subtitle2">
                Browse our Help Center or <br /> contact our support team.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box textAlign={"center"} sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are You Ready to Begin?
        </Typography>
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#8000ff",
            color: "#fff",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "4px",
            py: 1.2,
            mt: 2,
            "&:hover": { backgroundColor: "#6a1b9a" },
          }}
          gutterBottom
        >
          Create Your Course
        </Button>
      </Box>
    </Box>
  );
}

export default Home;
