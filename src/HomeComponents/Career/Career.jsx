import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import web from "../../assets/Web.png";
import digital from "../../assets/Digital.png";
import data from "../../assets/Data.png";
import cloud from "../../assets/Cloud.png";
import game from "../../assets/Game.png";
import project from "../../assets/Project.png";

const careers = [
  {
    title: "Full Stack Web Developer",
    salary: "$127,005",
    openings: "10,500",
    rating: 4.7,
    ratingsCount: "441K",
    hours: "876",
    image: web,
  },
  {
    title: "Digital Marketer",
    salary: "$91,106",
    openings: "36,800",
    rating: 4.6,
    ratingsCount: "3.3K",
    hours: "28.4",
    image: digital,
  },
  {
    title: "Data Scientist",
    salary: "$126,609",
    openings: "20,800",
    rating: 4.6,
    ratingsCount: "216K",
    hours: "46.8",
    image: data,
  },
  {
    title: "Cloud Engineer",
    salary: "$120,037",
    openings: "12,300",
    rating: 4.7,
    ratingsCount: "298K",
    hours: "123",
    image: cloud,
  },
  {
    title: "Game Developer",
    salary: "$87,543",
    openings: "9,100",
    rating: 4.7,
    ratingsCount: "113K",
    hours: "75.9",
    image: game,
  },
  {
    title: "Project Manager",
    salary: "$91,877",
    openings: "77,000",
    rating: 4.6,
    ratingsCount: "326K",
    hours: "22.9",
    image: project,
  },
];

const testimonials = [
  {
    name: "Alvin Lim",
    title: "Technical Co-Founder, CTO at Dimensional",
    text: "Udemy was truly a game-changer and a great guide for me as we brought Dimensional to life.",
    avatar: "/assets/alvin.png",
  },
  {
    name: "William Wachlin",
    title: "Partner Account Manager at Amazon Web Services",
    text: "Udemy gives you the ability to be persistent. I learned exactly what I needed to know in the real world.",
    avatar: "/assets/william.png",
  },
  {
    name: "StackOverflow",
    title: "",
    text: "Udemy was rated the most popular online course or certification program for learning how to code.",
    avatar: "/assets/stackoverflow.png",
  },
];

const faqs = [
  {
    question: "Who are career accelerators for?",
    answer:
      "Career accelerators are for anyone looking to gain job-ready skills and enter a high-demand field.",
  },
  {
    question: "Is any prior knowledge or experience required?",
    answer:
      "No prior experience is required. These programs are designed to take you from beginner to job-ready.",
  },
  {
    question: "How are courses selected for career accelerators?",
    answer:
      "Courses are handpicked by experts to ensure quality, depth, and real-world relevance.",
  },
];

const Career = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          color: "#162846",
          fontFamily: "inherit",
          fontSize: "50px",
          fontWeight: "bold",
        }}
      >
        Ready to reimagine your career?
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        mb={4}
        sx={{ fontSize: "20px" }}
      >
        Join Career Accelerators to get the structure, skills, and real-world
        experience that makes you an exceptional candidate.
      </Typography>

      <Grid container spacing={3}>
        {careers.map((career, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                width: "410px",
                p: 2,
                pt: 2,
                borderRadius: 4,
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={career.image}
                alt={career.title}
                sx={{
                  // width: '80%',
                  borderRadius: "8px",
                  margin: "0 auto", // عشان تبقى الصورة في النص
                  display: "block",
                  objectFit: "cover",
                }}
              />
              <CardContent>
                <Typography variant="h6">{career.title}</Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {career.salary} average salary (US) · {career.openings} open
                  roles (US)
                </Typography>

                <Box display="flex" alignItems="center" gap={1}>
                  <StarIcon fontSize="small" sx={{ color: "gold" }} />
                  <Typography variant="body2">{career.rating}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {career.ratingsCount} ratings · {career.hours} total hours
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Testimonials */}
      <Box
        sx={{
          width: "100%", // عرض كامل الصفحة
          mt: 8,
          backgroundColor: "#050a13", // خلفية سوداء
          color: "#1c1c1c", // لون الخط داكن عشان يبان
          py: 6, // padding top and bottom
          px: 0, // إزالة المسافة على الجوانب (padding left and right)
          // borderRadius: 2, // إذا كنتِ مش عايزة حدود دائرية ممكن تتركيها
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            mt: 4,
            color: "#fff",
            fontFamily: "inherit",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          What other learners are saying
        </Typography>

        <Grid container spacing={2} justifyContent="center" mt={2}>
          {testimonials.map((t, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Box
                sx={{
                  backgroundColor: "#f9f9f9", // لون ناعم للكارت
                  p: 3,
                  borderRadius: 2,
                  width: "400px",
                  boxShadow: 2, // شادو خفيف
                  // borderRadius: 5,
                  height: "auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start", // تأكد من أن المحتوى يتركز للأعلى
                }}
              >
                <Typography variant="body1" mb={2} sx={{ fontSize: "20px" }}>
                  “{t.text}”
                </Typography>
                <Box mt={2}>
                  <img />
                  <Typography variant="subtitle2" sx={{ color: "gray" }}>
                    {t.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "gray" }}>
                    {t.title}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mt: 2 }}>
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            color: "#050a13",
            fontFamily: "inherit",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          Frequently asked questions
        </Typography>
        <Box maxWidth="md" mx="auto" mt={3}>
          {faqs.map((faq, idx) => (
            <Accordion key={idx}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>

      {/* Footer Notes */}
      <Box mt={8} textAlign="center" color="text.secondary" fontSize={13}>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body2">
          * Salary data reflects March 2025 US national averages reported by
          Indeed. <br />
          Job opening data reflects 2023 – 2023 projections reported by the US
          Bureau of Labor Statistics.
        </Typography>
      </Box>
    </Box>
  );
};

export default Career;
