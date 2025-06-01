import SliderImg from "../HomeAfterLoginComponents/Slider";
import CoursesSection from "../HomeAfterLoginComponents/CoursesSection";
import CategoryButtons from "../HomeAfterLoginComponents/CategoryButtons";
import Navbar from "../HomeAfterLoginComponents/NavBar";
import ChatModal from "../Components/ChatAi/chatai";
const HomeAfterLogin = () => {
  return (
    <>
      <Navbar />
      <ChatModal/>
      <SliderImg />
      <CoursesSection />
      <CategoryButtons />
    </>
  );
};

export default HomeAfterLogin;
