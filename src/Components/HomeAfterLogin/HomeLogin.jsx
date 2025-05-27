// App.jsx or Home.jsx
import React from "react";
import Navbar from "../../HomeAfterLoginComponents/NavBar";
import SliderImg from "../../HomeAfterLoginComponents/Slider";
import CoursesSection from "../../HomeAfterLoginComponents/CoursesSection";
import CategoryButtons from "../../HomeAfterLoginComponents/CategoryButtons";

const HomeAfterLogin = () => {
  return (
    <>
      <Navbar />
      <SliderImg />
      <CoursesSection />
      <CategoryButtons />
    </>
  );
};

export default HomeAfterLogin;
