import { Box, Button, Typography } from "@mui/material";
import React from "react";
import Slider from "react-slick";
// import "slick-carousel/slick/slick-theme.css";
// import "slick-carousel/slick/slick.css";

import img1 from "../assets/Sd1.jpg";
import img2 from "../assets/Sd2.jpg";

const SliderImg = () => {
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const slides = [
    {
      img: img1,
      title: "Learning that gets you",
      text: "Skills for your present (and your future). Get started with us.",
    },
    {
      img: img2,
      title: "Learning that gets you",
      text: "Skills for your present (and your future). Get started with us.",
    },
  ];

  return (
    <Box
      sx={{
        overflow: "hidden",
        maxHeight: { xs: 250, md: 400 },
        position: "relative",
      }}
    >
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <Box key={index} sx={{ position: "relative" }}>
            <Box
              component="img"
              src={slide.img}
              alt={`Slide ${index + 1}`}
              sx={{
                width: "100%",
                height: { xs: 250, md: 400 },
                objectFit: "cover",
                display: "block",
              }}
            />
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                top: 50,
                left: 50,
                backgroundColor: "white",
                padding: "20px 30px",
                maxWidth: 500,
                borderRadius: 2,
                zIndex: 1,
              }}
            >
              <Typography variant="h5" fontWeight="bold" mb={1}>
                {slide.title}
              </Typography>
              <Typography variant="body1" mb={2}>
                {slide.text}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#5624d0", fontWeight: "bold" }}
                >
                  Start Learning
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: "#5624d0",
                    borderColor: "#5624d0",
                    fontWeight: "bold",
                  }}
                >
                  Browse Courses
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default SliderImg;
