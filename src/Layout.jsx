import React from 'react';
import Header from './HomeComponents/Header/Header';
import Footer from './HomeComponents/Footer/Footer';
import { Outlet } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

// import InsSignup from './Components/InstructorSignup/InsSignup';
// import Welcomehome from './Components/InstructorSignup/welcomehome';
// import Sidebar from './Components/InstructorSignup/components/Drawer/sidebar';
// import CreateCourse from './Components/InstructorSignup/components/CreateCourse/createcourse';
const Layout = () => {
  return (
    <>
    <CssBaseline>
      <Header />
      <Outlet />
      <Footer />
      </CssBaseline>
    </>
  );
};

export default Layout;
