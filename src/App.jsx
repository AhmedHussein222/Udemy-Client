import { CssBaseline, } from "@mui/material";
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
import EditCourse from "./Components/Instructor Dashboard/components/Edit Course/edit";

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
      { path: "courses", element: <Home /> },
      { path: "communication", element: <Home /> },
      { path: "performance", element: <Home /> },
      { path: "create", element: <CreateCourse /> },
      { path: "edit", element: <EditCourse /> },

    ]
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



function App() {
  return (
    <CssBaseline>
      <RouterProvider router={router}></RouterProvider>
    </CssBaseline>
  );
}

export default App;








// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Layout from './Layout';
// import Home from './Components/Home/Home';
// import Cart from './Components/Cart/Cart';
// import Signup from './Components/SignUpStudents/Signup';
// import Login from './Components/LoginUsers/Login';
// import InsSignup from './Components/InstructorSignup/InsSignup';
// import Career from './HomeComponents/Career/Career'
// // import Welcomehome from './Components/InstructorSignup/welcomehome';
// import Sidebar from './Components/InstructorSignup/components/Drawer/sidebar';
// import CreateCourse from './Components/InstructorSignup/components/CreateCourse/createcourse';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           {/* <Route index element={<Welcomehome />} />  */}
//           <Route path="cart" element={<Cart />} />
//           <Route path="login" element={<Login />} />
//           <Route path="signup" element={<Signup />} />
//           <Route path="instructor-signup" element={<InsSignup />} />
//           <Route path="sidebar" element={<Sidebar />} />
//           <Route path="create-course" element={<CreateCourse />} />
//           <Route path="career-accelerators" element={<Career />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;