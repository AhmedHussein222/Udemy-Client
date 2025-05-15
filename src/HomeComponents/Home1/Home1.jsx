import React from "react";
import { useNavigate } from 'react-router-dom';
import './Home1.css';
// import { db } from '../../Firebase/firebase';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import slide1 from "../../assets/Slide1.jpeg";
import slide2 from "../../assets/Slide2.jpeg";
import slide3 from "../../assets/Slide3.png";
import fullstackImg from "../../assets/Web.png";
import digitalMarketerImg from "../../assets/Digital.png";
import dataScienceImg from "../../assets/Data.png";
import { Card, CardContent, Typography, Box ,Grid } from "@mui/material";

const Home1 = () => {

  const navigate = useNavigate();

const InfoBox = ({ title, sx }) => (
  <Box sx={{ 
    backgroundColor: "#fff",
    color: "gray", 
    border: "1px solid gray", 
    padding: 1,
    textAlign: "left", 
    flex: '1 1 auto',
    borderRadius: 1,
    marginRight: .5, 
    ...sx 
  }}>
    <Typography variant="body2">{title}</Typography>
  </Box>
);

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

return (
  <div className="home-container">
    {/* Slider Section */}
    <Slider {...settings}>
      <div className="slide-wrapper">
        <img src={slide1} alt="Slide 1" className="slide-image" />
        <div className="slide-content">
          <h2 className="slide-title">Skills that drive you forward</h2>
          <p className="slide-text">
            Technology and the world of work change fast — with us, you’re faster. Get the skills to achieve goals and stay competitive.
          </p>
          <div className="buttons">
            <button className="btn-purple">Plan for individuals</button>
            <button className="btn-outline">Plan for organizations</button>
          </div>
        </div>
      </div>

      <div className="slide-wrapper">
        <img src={slide2} alt="Slide 2" className="slide-image" />
        <div className="slide-content left">
          <h2 className="slide-title">Learning that gets you</h2>
          <p className="slide-text">
            Skills for your present (and your future). Get started with us.
          </p>
        </div>
      </div>

      <div className="slide-wrapper">
        <img src={slide3} alt="Slide 3" className="slide-image" />
        <div className="slide-content left">
          <h2 className="slide-title">Learning that gets you</h2>
          <p className="slide-text">
            Skills for your present (and your future). Get started with us.
          </p>
        </div>
      </div>
    </Slider>

    {/* Title and Text Section */}
    <div className="below-slider-text">
      <h1>Ready to reimagine your career?</h1>
      <p>Get the skills and real-world experience employers want with Career Accelerators.</p>
    </div>

    {/* Cards Section */}
    <Box sx={{ flexGrow: 1, mt: 5 }}>
      <Grid container spacing={2} justifyContent="center">
        
        {/* Full Stack Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 4,width:"100%" }}>
            <Box
              component="img"
              src={fullstackImg}
              alt="Full Stack"
              sx={{
                width: "90%",
                height: "250px",
                borderRadius: "16px",
                objectFit: "cover",
                mx: 2.5,
                mt: 3,
                mb: 2,
              }}
            />
            <CardContent sx={{ textAlign: "left" }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Full Stack Web Developer
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                $127,005 average salary (US) | 16,500 open roles (US)
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <InfoBox title="⭐4.7" />
                <InfoBox title="439k ratings" />
                <InfoBox title="87 total Hours" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Digital Marketer Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 4 ,width:400 }}>
            <Box
              component="img"
              src={digitalMarketerImg}
              alt="Digital Marketer"
              sx={{
                width: "90%",
                height: "250px",
                borderRadius: "16px",
                objectFit: "cover",
                mx: 2.5,
                mt: 3,
                mb: 2,
              }}
            />
            <CardContent sx={{ textAlign: "left" }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Digital Marketer
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                $127,005 average salary (US) | 16,500 open roles (US)
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <InfoBox title="⭐4.5" />
                <InfoBox title="3.1k ratings" />
                <InfoBox title="28 total Hours" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Science Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 4 , width:400}}>
            <Box
              component="img"
              src={dataScienceImg}
              alt="Data Science"
              sx={{
                width: "90%",
                height: "250px",
                borderRadius: "16px",
                objectFit: "cover",
                mx: 2.5,
                mt: 3,
                mb: 2,
              }}
            />
            <CardContent sx={{ textAlign: "left" }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Data Science
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                $127,005 average salary (US) | 16,500 open roles (US)
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <InfoBox title="⭐4.6" />
                <InfoBox title="215k ratings" />
                <InfoBox title="46 total Hours" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
    
    <Box sx={{ display: "flex", justifyContent: "left", mt: 5 }}>
  <button
  onClick={() => navigate('/career-accelerators')}
   style={{
    border: "1px solid #5624d0",
    color: "#5624d0",
    backgroundColor: "#fff",
    padding: "15px 20px",
    marginLeft: "10px",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s"
  }}>
    All Career Accelerators
  </button>
</Box>

{/* Title and Text Section */}
<div className="below-slider-text">
<Box sx={{ textAlign: "left", mt: 5 }}>
  <Typography variant="h1" fontWeight="bold" gutterBottom>
    All the skills you need in one place
  </Typography>
  <Typography variant="body1" color="text.secondary">
    From critical skills to technical topics, Udemy supports your professional development.
  </Typography>
</Box>
</div>
  </div>

);
};

export default Home1;
