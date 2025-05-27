import React from "react";
import SliderImg from "../HomeAfterLoginComponents/Slider";
import CoursesSection from "../HomeAfterLoginComponents/CoursesSection";
import CategoryButtons from "../HomeAfterLoginComponents/CategoryButtons";
import Navbar from "../HomeAfterLoginComponents/NavBar";

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
