import React from 'react'
import Header from './Components/Header/Header'
import Home from './Components/Home/Home'
import { CssBaseline } from '@mui/material';
import Footer from './Components/Footer/Footer';
import Navbar from './Components/NavBar/NavBar';
import Logo from './Components/Logo/Logo'

function App() {
  return (
<CssBaseline>
  <Header/>
  <Home/>
  <Navbar/>
  <Logo/>
  <Footer/>
</CssBaseline>
   
  )
}

export default App