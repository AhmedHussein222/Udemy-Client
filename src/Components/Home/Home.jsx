import React from 'react';
import Home1 from '../../HomeComponents/Home1/Home1';
import Home2 from '../../HomeComponents/Home2/Home2';
import NavBar from '../../HomeComponents/NavBar/NavBar';
import Logo from '../../HomeComponents/Logo/Logo';



const Home = () => {
  return (
    <div>
      <Home1 />
      <NavBar />
      <Logo />
      <Home2/>
    </div>
  );
};

export default Home;
