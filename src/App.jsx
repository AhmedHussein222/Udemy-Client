import React from 'react'
import Header from './Components/Header/Header'
import { CssBaseline } from '@mui/material';
import Footer from './Components/Footer/Footer';
import Cart from './Components/Cart/Cart';
import Signup from './Components/SignUpStudents/Signup';
import Login from './Components/LoginUsers/Login';
import InsSignup from './Components/InstructorSignup/InsSignup';
import Welcomehome from './Components/InstructorSignup/welcomehome';
import Sidebar from './Components/InstructorSignup/components/Drawer/sidebar';
import CreateCourse from './Components/InstructorSignup/components/CreateCourse/createcourse';

function App() {
  return (
<CssBaseline>
  <Header/>
  {/* <Cart/> */}
  {/* <Signup /> */}
  {/* <Login /> */}
  {/* <InsSignup /> */}
  <Welcomehome />
  {/* <Sidebar/> */}
  {/* <Footer/> */}

</CssBaseline>
   
  )
}

export default App