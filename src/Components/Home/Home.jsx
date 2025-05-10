import React from 'react';
import Home1 from '../../HomeComponents/Home1/Home1';
import Home2 from '../../HomeComponents/Home2/Home2';
import Home3 from '../../HomeComponents/Home3/Home3';
import NavBar from '../../HomeComponents/NavBar/NavBar';
import Logo from '../../HomeComponents/Logo/Logo';
import AcceleratorSection from '../../HomeComponents/AcceleratorSection/AcceleratorSection';



const Home = () => {
  return (
    <div>
      <Home1 />
      <NavBar />
      <Logo />
      <Home2/>
      <AcceleratorSection/>
      <Home3/>
    </div>
  );
};

export default Home;
