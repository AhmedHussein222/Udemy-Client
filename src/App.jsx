import { CssBaseline } from "@mui/material";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cart from "./Components/Cart/Cart";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import CreateCourse from "./Components/InstructorSignup/components/CreateCourse/createcourse";
import InsSignup from "./Components/InstructorSignup/InsSignup";
import Welcomehome from "./Components/InstructorSignup/welcomehome";
import Login from "./Components/LoginUsers/Login";
import Signup from "./Components/SignUpStudents/Signup";
const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/cart", element: <Cart /> },
  { path: "/signup", element: <Signup /> },
  { path: "/instructor-signup", element: <InsSignup /> },
  { path: "/", element: <Welcomehome /> },
  { path: "/CreateCourse", element: <CreateCourse /> },
]);

function App() {
  return (
    <CssBaseline>
      <Header />
      {/* <Sidebar/> */}
      <RouterProvider router={router}></RouterProvider>

      <Footer />
    </CssBaseline>
  );
}

export default App;