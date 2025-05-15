import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  Button,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material";
import Sd1 from "../../assets/Sd1.jpg";
import Sd2 from "../../assets/Sd2.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import img1 from "../../assets/empty.webp";
import { collection, getDocs } from "../../Firebase/firebase.js";
import { db } from "../../Firebase/firebase.js";

const SectionTitle = ({ title }) => (
  <Typography variant="h5" fontWeight={700} mb={2}>
    {title}
  </Typography>
);

const CourseCard = ({ thumbnail, title, author, rating, price }) => (
  <Card sx={{ maxWidth: 250, mx: "auto" }}>
    <CardMedia component="img" height="140" image={thumbnail} alt={title} />
    <CardContent>
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {author}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Rating: {rating?.rate} ({rating?.count} reviews)
      </Typography>
      <Typography variant="body1" fontWeight={600}>
        {price}
      </Typography>
    </CardContent>
  </Card>
);

const HomeLogin = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const user = { name: "Jassy", avatar: img1 }; // Replace with real auth later

  const sliderSettings = {
    dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1, // علشان يبين صورة واحدة بس
  slidesToScroll: 1,
  centerMode: false, // مهم جدا علشان الصورة تبقى من غير حدود
  variableWidth: false,
  };

  const cardSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };
 

const fetchSubCategories = async () => {
  const colRef = collection(db, "SubCategories");
  const snapshot = await getDocs(colRef);
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  setSubCategories(data);
};

fetchSubCategories();


  useEffect(() => {
    const fetchCourses = async () => {
      const colRef = collection(db, "Courses");
      const snapshot = await getDocs(colRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(data);
    };

    const fetchCategories = async () => {
      const colRef = collection(db, "Categories");
      const snapshot = await getDocs(colRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(data);
    };

    fetchCourses();
    fetchCategories();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const filteredCourses = (keyword) =>
    courses.filter(
      (course) => course.category === keyword || course.subCategory === keyword
    );

  return (
    <>
      {/* Navbar */}
      {/* Navbar */}
<Box
  bgcolor="#fff"
  py={2}
  px={3}
  position="relative"
  display="flex"
  justifyContent="center"
  onMouseLeave={() => setHoveredCategory(null)}
>
  <Box display="flex" gap={3}>
    {categories.map((cat) => (
      <Typography
        key={cat.id}
        variant="body1"
        onMouseEnter={() => setHoveredCategory(cat)}
        sx={{ cursor: "pointer", color: "gray", position: "relative" }}
      >
        {cat.name}
      </Typography>
    ))}
  </Box>

  {hoveredCategory && (
  <Box
    position="absolute"
    top="100%"
    left={0}
    width="100%"
    bgcolor="black"
    color="white"
    px={4}
    py={2}
    zIndex={10}
    display="flex"
    justifyContent="center"
  >
    <Box display="flex" flexWrap="wrap" gap={4} maxWidth="1200px">
      {subCategories
        .filter((sub) => sub.category_id === hoveredCategory.id)
        .map((sub) => (
          <Typography key={sub.id} sx={{ cursor: "pointer" }}>
            {sub.name}
          </Typography>
        ))}
    </Box>
  </Box>
)}

</Box>



      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome back */}
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar src={user.avatar} sx={{ width: 50, height: 50, mr: 2 }} />
          <Typography variant="h6">Welcome back, {user.name}</Typography>
        </Box>

        {/* Slider */}
        <Slider {...sliderSettings}>
          {[Sd1, Sd2].map((img, idx) => (
            <Box
  key={idx}
  sx={{
    position: "relative",
    backgroundImage: `url(${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: 300,
    borderRadius: 2,
    // mx: 2 ← شيلي السطر ده
  }}
>

              <Box
                sx={{ position: "absolute", top: 20, left: 20, color: "black" }}
              >
                <Typography variant="h4" fontWeight={700}>
                  Big Bold Text
                </Typography>
                <Typography variant="body1">
                  Some small description here
                </Typography>
              </Box>
            </Box>
          ))}
        </Slider>

        {/* What to learn next */}
        <SectionTitle title="What to learn next" />
        <Typography variant="subtitle1" fontWeight={500} mb={2}>
          Because you viewed "Upgrade Your Social Media Presence with ChatGPT"
        </Typography>
        <Slider {...cardSliderSettings}>
          {filteredCourses("Chat").map((course) => (
            <Box key={course.id} px={1}>
              <CourseCard {...course} />
            </Box>
          ))}
        </Slider>

        {/* Learners are viewing */}
        <SectionTitle title="Learners are viewing" />
        <Slider {...cardSliderSettings}>
          {courses.map((course) => (
            <Box key={course.id} px={1}>
              <CourseCard {...course} />
            </Box>
          ))}
        </Slider>

        {/* Short and sweet */}
        <SectionTitle title="Short and sweet courses for you" />
        <Slider {...cardSliderSettings}>
          {courses.map((course) => (
            <Box key={course.id} px={1}>
              <CourseCard {...course} />
            </Box>
          ))}
        </Slider>

        {/* Python section */}
        <Box display="flex" alignItems="baseline" gap={1} mt={4}>
          <Typography variant="h5" fontWeight={700}>
            What people who learn
          </Typography>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: "purple",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => console.log("go to python page")}
          >
            Python
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            take next
          </Typography>
        </Box>
        <Slider {...cardSliderSettings}>
          {filteredCourses("Python").map((course) => (
            <Box key={course.id} px={1}>
              <CourseCard {...course} />
            </Box>
          ))}
        </Slider>
        
        <Slider {...cardSliderSettings}>
          {courses.map((course) => (
            <Box key={course.id} px={1} sx={{mt: 3}}>
              <CourseCard {...course} />
            </Box>
          ))}
        </Slider>

        {/* Newest courses in Data Science */}
        <Box display="flex" alignItems="baseline" gap={1} mt={4}>
          <Typography variant="h5" fontWeight={700}>
            Newest courses in
          </Typography>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: "purple",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => console.log("go to data science page")}
          >
            Data Science
          </Typography>
        </Box>
        <Slider {...cardSliderSettings}>
          {filteredCourses("Data Science").map((course) => (
            <Box key={course.id} px={1}>
              <CourseCard {...course} />
            </Box>
          ))}
        </Slider>

        {/* Top courses in Programming Languages */}
        <Box display="flex" alignItems="baseline" gap={1} mt={4}>
          <Typography variant="h5" fontWeight={700}>
            Top courses in
          </Typography>
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: "purple",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => console.log("go to programming languages page")}
          >
            Programming Languages
          </Typography>
        </Box>
        <Slider {...cardSliderSettings}>
          {filteredCourses("Programming Languages").map((course) => (
            <Box key={course.id} px={1}>
              <CourseCard {...course} />
            </Box>
          ))}
        </Slider>

        {/* Topics recommended for you */}
        <SectionTitle title="Topics recommended for you" />
        <Box display="flex" flexWrap="wrap" gap={2}>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant="outlined"
              sx={{
                borderColor: "black",
                color: "black",
                borderRadius: 4,
              }}
            >
              {cat.name}
            </Button>
          ))}
        </Box>
      </Container>
    </>
  );
};

export default HomeLogin;
