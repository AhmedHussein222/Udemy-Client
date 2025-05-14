import { CssBaseline } from "@mui/material";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Cart from "./Components/Cart/Cart";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import CreateCourse from "./Components/Instructor Dashboard/components/CreateCourse/createcourse";
import InsMain from "./Components/Instructor Dashboard/components/Main/Main";
import InsSignup from "./Components/Instructor Dashboard/InsSignup";
import Login from "./Components/LoginUsers/Login";
import Signup from "./Components/SignUpStudents/Signup";
import InsMain from "./Components/Instructor Dashboard/components/Main/Main";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase/firebase";
import { useTranslation } from "react-i18next";
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import {  ThemeProvider, createTheme } from '@mui/material';
import Userprofile from "./Components/Userprofile/userprofile";
import { UserContext } from "./context/UserContext";
 import Home from "./Components//Home/Home";

import InsHome from "./Components/Instructor Dashboard/components/Home/home";
import EditCourse from "./Components/Instructor Dashboard/components/Edit Course/edit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "cart", element: <Cart /> },
      { path: "signup", element: <Signup /> },
      { path: "instructor-signup", element: <InsSignup /> },
      { path: "", element: <Home /> },
    ],
  },
  { path: "instructor", element: <InsMain />, 
    children:[
      { path: "", element: <InsHome /> },
      { path: "courses", element: <InsHome /> },
      { path: "communication", element: <InsHome /> },
      { path: "performance", element: <InsHome /> },
      { path: "create", element: <CreateCourse /> },
      { path: "edit", element: <EditCourse /> },
    ],
  },
]);

function Main() {
  return (
    <>
      <CssBaseline>
        <Header />
        <Outlet />
        <Footer />
      </CssBaseline>
    </>
  );
}



const App = () => {
  const { i18n } = useTranslation();
  const direction = i18n.language === 'ar' ? 'rtl' : 'ltr';
  const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser); 
      } else {
        setUser(null);
      }
    });
   document.body.dir = direction;
  
    return () => unsubscribe(); 
  }, [direction]);

  const cache = createCache({
    key: direction === 'rtl' ? 'muirtl' : 'mui',
    stylisPlugins: direction === 'rtl' ? [prefixer, rtlPlugin] : [],
  });



   const theme = createTheme({
    direction,
    typography: {
      fontFamily: direction === 'rtl' ? 'Cairo, sans-serif' : 'Roboto, sans-serif',
    },
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserContext.Provider value={{ user }}>
          <RouterProvider router={router} />
        </UserContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
