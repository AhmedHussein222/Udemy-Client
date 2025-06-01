import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import Cart from "./Pages/Cart";
import Category from "./Components/Category/Category";
import CategoryPage from "./Components/Courses/CatCourses";
import SubcategoryPage from "./Components/Courses/SubCourses";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import EditCourse from "./Components/Instructor Dashboard/components/Edit Course/edit";
import InsHome from "./Components/Instructor Dashboard/components/Home/home";
import InsMain from "./Components/Instructor Dashboard/components/Main/Main";
import Revenue from "./Components/Instructor Dashboard/components/Revenue";
import Reviews from "./Components/Instructor Dashboard/components/Reviews";
import InsSignup from "./Components/Instructor Dashboard/InsSignup";
import Welcomehome from "./Components/Instructor Dashboard/welcomehome";
import Login from "./Components/LoginUsers/Login";
import MyLearning from "./Components/MyLearning/MyLearning";
import SearchResults from "./Components/Search/SearchResults";
import Signup from "./Components/SignUpStudents/Signup";
import Userprofile from "./Components/Userprofile/userprofile";
import Wishlist from "./Components/Wishlist/wishlist";
import { CartProvider } from "./context/CartContext";
import { EnrolledCoursesProvider } from "./context/EnrolledCoursesContext";
import { UserContext , UserProvider } from "./context/UserContext";
import { WishlistProvider } from "./context/WishlistContext";
import AuthGuard from "./Guards/AuthGuard";
import Navbar from "./HomeAfterLoginComponents/NavBar";
import Career from "./HomeComponents/Career/Career";
import CourseCondent from "./Pages/courseContent";
import NotFound from "./Pages/NotFound";
import CourseGuard from "./Guards/CourseGuard";
import InstructorProfile from "./Pages/instructorprofile";
import Home from "./Pages/Home";
import HomeAfterLogin from "./Pages/HomeLogin";
import CourseDetails from "./Pages/CourseDetails";
import CheckoutComponent from "./Pages/checkout";
import Unauthorized from './Pages/Unauthorized';
import ForgotPassword from "./Components/LoginUsers/ForgotPassword";
import Home2 from "./HomeComponents/Home2/Home2";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: "", element: <HomeRoute /> }, 
			{ path: "login", element: <Login /> },
			{ path: "forgot-password", element: <ForgotPassword /> },
      { path: "cart", element: <Cart /> },
      { path: "Userprofile", element: <Userprofile /> },
      { path: "/subcategory/:subcategoryId", element: <SubcategoryPage /> },
      { path: "/category/:categoryId", element: <CategoryPage /> },
      { path: "Home2", element: <Home /> },
      { path: "HomeLogin", element: <Navbar /> },
      { path: "wishlist", element: <Wishlist /> },
      { path: "signup", element: <Signup /> },
      { path: "instructor/:id", element: <InstructorProfile/>},
      { path: "instructor-signup", element: <InsSignup /> },
      { path: "course/:id", element: <CourseDetails /> },
      { path: "search", element: <SearchResults /> },
      { path: "Welcomehome", element: <Welcomehome /> },
      { path: "checkout", element: <CheckoutComponent /> },
      { path: "MyLearning", element: <MyLearning /> },
      { path: "/MyLearning/:id", element: 
        <CourseGuard>
          <CourseCondent />

        </CourseGuard>
     },
      { path: "/career-accelerators", element: <Career /> },
			{ path: "/category/:id", element: <Category /> },
			{ path: "/unauthorized", element: <Unauthorized /> },
      {path: "/pro",element:<Home2 />},
      {path:"*", element: <NotFound />},
    ],
  }, 
  {
    path: "instructor",
    element: (
      <AuthGuard allowedRoles={["instructor"]}>
        <InsMain />
      </AuthGuard>
    ),
    children: [
      { path: "", element: <InsHome /> },
      { path: "courses", element: <InsHome /> },
      { path: "create", element: <EditCourse /> },
      { path: "edit", element: <EditCourse /> },
      { path: "reviews", element: <Reviews /> },
      { path: "revenue", element: <Revenue /> },
    ],
  },
  {path:"*", element: <NotFound />},

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
function HomeRoute() {
  const { user } = useContext(UserContext);
  return    user ? <HomeAfterLogin /> :<Home />
    
}
const App = () => {
  const { i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

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
      fontFamily: direction === "rtl" ? "Cairo, sans-serif" : "Roboto, sans-serif",
    },
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserProvider>
            <CartProvider>
              <WishlistProvider>
                <EnrolledCoursesProvider>
                  <RouterProvider router={router} />
                </EnrolledCoursesProvider>
              </WishlistProvider>
            </CartProvider>
        </UserProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
