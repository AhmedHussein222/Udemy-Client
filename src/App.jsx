/** @format */

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import Home from "./Components//Home/Home";
import Cart from "./Components/Cart/Cart";
import Category from "./Components/Category/Category";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import CreateCourse from "./Components/Instructor Dashboard/components/CreateCourse/createcourse";
import InsMain from "./Components/Instructor Dashboard/components/Main/Main";
import InsSignup from "./Components/Instructor Dashboard/InsSignup";
import Welcomehome from "./Components/Instructor Dashboard/welcomehome";
import Login from "./Components/LoginUsers/Login";
import Signup from "./Components/SignUpStudents/Signup";
import Userprofile from "./Components/Userprofile/userprofile";
import { UserProvider } from "./context/UserContext";

import CourseDetails from "./Components/Coursedetails/CourseDetails";
import EditCourse from "./Components/Instructor Dashboard/components/Edit Course/edit";
import InsHome from "./Components/Instructor Dashboard/components/Home/home";
import Revenue from "./Components/Instructor Dashboard/components/Revenue";
import Reviews from "./Components/Instructor Dashboard/components/Reviews";
import PaymentPage from "./Components/payment/test";
import Wishlist from "./Components/Wishlist/wishlist";
import { CourseProvider } from "./context/CourseContext";
import AuthGuard from "./Guards/AuthGuard";
import Unauthorized from "./Pages/Unauthorized.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Main />,
		children: [
			{ path: "login", element: <Login /> },
			{ path: "cart", element: <Cart /> },
			{ path: "Userprofile", element: <Userprofile /> },
			{ path: "wishlist", element: <Wishlist /> },
			{ path: "signup", element: <Signup /> },
			{ path: "instructor-signup", element: <InsSignup /> },
			{ path: "coursedetails/:id", element: <CourseDetails /> },
			{ path: "", element: <Home /> },
			{ path: "Welcomehome", element: <Welcomehome /> },

		],
	},
	{ path: "category", element: <Category /> },
	{ path: "pay", element: <PaymentPage /> },
	{ path: "unauthorized", element: <Unauthorized /> },
    
	{
		path: "instructor",
		element:  <AuthGuard allowedRoles={['instructor']} > 
			
			<InsMain />
		</AuthGuard>,
		children: [
			{ path: "", element: <InsHome /> },
			{ path: "courses" , element: <InsHome /> },
			{ path: "create", element: <CreateCourse /> },
			{ path: "edit", element: <EditCourse /> },
			{ path: "reviews", element: <Reviews /> },
			{ path: "revenue", element: <Revenue /> },
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

	useEffect(() => {
		document.body.dir = direction;
	}, [direction]);

	const cache = createCache({
		key: direction === "rtl" ? "muirtl" : "mui",
		stylisPlugins: direction === "rtl" ? [prefixer, rtlPlugin] : [],
	});

	const theme = createTheme({
		direction,
		typography: {
			fontFamily:
				direction === "rtl" ? "Cairo, sans-serif" : "Roboto, sans-serif",
		},
	});

	return (
		<CacheProvider value={cache}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<UserProvider>
					<CourseProvider>
						<RouterProvider router={router} />
					</CourseProvider>
				</UserProvider>
			</ThemeProvider>
		</CacheProvider>
	);
};

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
