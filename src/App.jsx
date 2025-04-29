import React from 'react'
import Header from './Components/Header/Header'
import { CssBaseline } from '@mui/material';
import Footer from './Components/Footer/Footer';
import Cart from './Components/Cart/Cart';
import Signup from './Components/SignUp/Signup';
import Login from './Components/LoginUser/Login';
import InsSignup from './Components/InstructorSignup/InsSignup';

function App() {
  return (
<CssBaseline>
  <Header/>
  {/* <Signup /> */}
  {/* <Login /> */}
  <InsSignup />
  <Footer/>

</CssBaseline>
   
  )
}

export default App