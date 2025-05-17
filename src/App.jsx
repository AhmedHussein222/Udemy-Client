/** @format */

import { CssBaseline } from "@mui/material";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Cart from "./Components/Cart/Cart";
import Category from "./Components/Category/Category";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import CreateCourse from "./Components/Instructor Dashboard/components/CreateCourse/createcourse";
import InsSignup from "./Components/Instructor Dashboard/InsSignup";
import Welcomehome from "./Components/Instructor Dashboard/welcomehome";
import Login from "./Components/LoginUsers/Login";
import Signup from "./Components/SignUpStudents/Signup";
import InsMain from "./Components/Instructor Dashboard/components/Main/Main";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase/firebase";
import { useTranslation } from "react-i18next";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { ThemeProvider, createTheme } from "@mui/material";
import Userprofile from "./Components/Userprofile/userprofile";
import { UserContext } from "./context/UserContext";
import Home from "./Components//Home/Home";

import InsHome from "./Components/Instructor Dashboard/components/Home/home";
import EditCourse from "./Components/Instructor Dashboard/components/Edit Course/edit";
import { CourseProvider } from "./context/CourseContext";
import { CartProvider } from "./context/CartContext";
import Wishlist from "./Components/Wishlist/wishlist";

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
			{ path: "", element: <Home /> },
		],
	},
	{ path: "category", element: <Category /> },
	{
		path: "instructor",
		element: <InsMain />,
		children: [
			{ path: "", element: <InsHome /> },
			{ path: "create", element: <CreateCourse /> },
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
	const direction = i18n.language === "ar" ? "rtl" : "ltr";
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
				<CssBaseline />{" "}
				<UserContext.Provider value={{ user }}>
					<CourseProvider>
						<CartProvider>
							<RouterProvider router={router} />
						</CartProvider>
					</CourseProvider>
				</UserContext.Provider>
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
