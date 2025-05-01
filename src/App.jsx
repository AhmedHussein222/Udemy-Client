import React from 'react'
import Header from './HomeComponents/Header/Header'
import Home from './HomeComponents/Home/Home'
import { CssBaseline } from '@mui/material';
import Footer from './HomeComponents/Footer/Footer';
import Navbar from './HomeComponents/NavBar/NavBar';
import Logo from './HomeComponents/Logo/Logo'
import Home2 from './HomeComponents/Home2/Home2'

function App() {
  return (
<CssBaseline>
  <Header/>
  <Home/>
  <Navbar/>
  <Logo/>
  <Home2/>
  <Footer/>
</CssBaseline>
   
  )
}

export default App