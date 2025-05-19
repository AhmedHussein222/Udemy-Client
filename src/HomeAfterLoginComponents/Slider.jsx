// Slider.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
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
  return (

    <Slider {...settings}>
    
          <div className="slide-wrapper">
            <img src={img1} alt="Slide 2" className="slide-image" />
            <div className="slide-content left">
              <h2 className="slide-title">Learning that gets you</h2>
              <p className="slide-text">
                Skills for your present (and your future). Get started with us.
              </p>
            </div>
          </div>
    
          <div className="slide-wrapper">
            <img src={img2} alt="Slide 3" className="slide-image" />
            <div className="slide-content left">
              <h2 className="slide-title">Learning that gets you</h2>
              <p className="slide-text">
                Skills for your present (and your future). Get started with us.
              </p>
            </div>
          </div>
        </Slider>
  );
};

export default SliderImg;
