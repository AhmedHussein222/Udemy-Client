import React from 'react';
import ChatModal from '../Components/ChatAi/chatai';
import Home1 from '../HomeComponents/Home1/Home1';
import NavBar from '../HomeComponents/NavBar/NavBar';
import Logo from '../HomeComponents/Logo/Logo';
import Home2 from '../HomeComponents/Home2/Home2';
import AcceleratorSection from '../HomeComponents/AcceleratorSection/AcceleratorSection';
import Home3 from '../HomeComponents/Home3/Home3';




const Home = () => {
  return (
    <>
      <ChatModal />
      <Home1 />
      <NavBar />
      <Logo />
      <Home2/>
      <AcceleratorSection/>
      <Home3/>
    </>
  );
};

export default Home;
