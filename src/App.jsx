import React from 'react'
import Header from './Components/Header/Header'
import { CssBaseline } from '@mui/material';
import Footer from './Components/Footer/Footer';
import Cart from './Components/Cart/Cart';

function App() {
  return (
<CssBaseline>
  <Header/>
  <Cart/>
  <Footer/>

</CssBaseline>
   
  )
}

export default App