import { CssBaseline } from "@mui/material";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Cart from "./Components/Cart/Cart";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import CreateCourse from "./Components/Instructor Dashboard/components/CreateCourse/createcourse";
import InsSignup from "./Components/Instructor Dashboard/InsSignup";
import Welcomehome from "./Components/Instructor Dashboard/welcomehome";
import Login from "./Components/LoginUsers/Login";
import Signup from "./Components/SignUpStudents/Signup";
import InsMain from "./Components/Instructor Dashboard/components/Main/Main";
import Home from "./Components/Instructor Dashboard/components/Home/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: "login", element: <Login /> },
      { path: "cart", element: <Cart /> },
      { path: "signup", element: <Signup /> },
      { path: "instructor-signup", element: <InsSignup /> },
      { path: "", element: <Welcomehome /> },
    ],
  },


  { path: "instructor", element: <InsMain />, 
    children:[
      { path: "", element: <Home /> },
      { path: "create", element: <CreateCourse /> },

    ]
  },
]);

function Main() {
  return (
    <>
      <Header />
      <Outlet />

      <Footer />
    </>
  );
}



function App() {
  return (
    <CssBaseline>
      <RouterProvider router={router}></RouterProvider>
    </CssBaseline>
  );
}

export default App;
