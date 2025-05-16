/** @format */

import React, { useState, useContext, useEffect } from "react";
import {
  AppBar,
  Typography,
  Button,
  IconButton,
  Box,
  InputBase,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import logo from "../../assets/logo-udemy.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/firebase.js";

const Header = () => {
  const [openBusiness, setOpenBusiness] = useState(false);
  const [openTeach, setOpenTeach] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery("(max-width:768px)");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  const [openExplore, setOpenExplore] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
    handleClose();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      const categoriesSnapshot = await getDocs(collection(db, "Categories"));
      const subcategoriesSnapshot = await getDocs(
        collection(db, "SubCategories")
      );
      const coursesSnapshot = await getDocs(collection(db, "Courses"));

      const categories = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const subcategories = subcategoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const courses = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("✅ Subcategories from Firebase:", subcategories);
      console.log("✅ Courses from Firebase:", courses);

      const categoriesWithSubs = categories.map((category) => {
        const subsForCat = subcategories
          .filter(
            (sub) =>
              sub.category_id === category.id ||
              sub.category_Id === category.id ||
              sub.categoryID === category.id
          )
          .map((sub) => {
            const coursesForSub = courses.filter(
              (course) =>
                course.subcategory_id === sub.id ||
                course.subcategory_Id === sub.id ||
                course.subCategoryId === sub.id
            );

            console.log(
              `🎯 Courses for subcategory "${sub.name}":`,
              coursesForSub
            );

            return { ...sub, courses: coursesForSub };
          });

        return { ...category, subcategories: subsForCat };
      });

      console.log(
        "✅ Final categories with subcategories and courses:",
        categoriesWithSubs
      );
      setCategories(categoriesWithSubs);
    };

    fetchData();
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff" }} elevation={1}>
      <Box sx={{ px: 2, py: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {isMobile ? (
            <>
              {/* Menu Icon */}
              <IconButton onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>

              {/* Logo Centered */}
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <img src={logo} style={{ width: 90 }} alt="logo" />
              </Box>

              {/* Icons on Right */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={() => setShowSearch(!showSearch)}>
                  <SearchIcon />
                </IconButton>

                <IconButton>
                  <ShoppingCartOutlinedIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              {/* Logo */}
              <img src={logo} style={{ width: 90 }} alt="logo" />
              {/* Explore */}
              {/* Explore */}
              <Box
                onMouseEnter={() => setOpenExplore(true)}
                onMouseLeave={() => {
                  setOpenExplore(false);
                  setHoveredCategory(null);
                  setHoveredSubcategory(null);
                }}
                sx={{ position: "relative", display: "inline-block" }}
              >
                <Typography sx={linkStyle}>Explore</Typography>

                {openExplore && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      zIndex: 10,
                      display: "flex",
                      gap: 2,
                      backgroundColor: "#fff",
                      boxShadow: 3,
                      p: 2,
                      minWidth: 600,
                    }}
                  >
                    {/* العمود الأول: Categories */}
                    <Box sx={{ minWidth: 150 }}>
                      {categories.map((cat) => (
                        <Typography
                          key={cat.id}
                          sx={{
                            ...linkStyle,
                            fontWeight:
                              hoveredCategory?.id === cat.id
                                ? "bold"
                                : "normal",
                            backgroundColor:
                              hoveredCategory?.id === cat.id
                                ? "#f3e5f5"
                                : "transparent",
                          }}
                          onMouseEnter={() => {
                            setHoveredCategory(cat);
                            console.log("🔥 Hovered category:", cat);
                            setHoveredSubcategory(null);
                          }}
                        >
                          {cat.name}
                        </Typography>
                      ))}
                    </Box>

                    {/* العمود الثاني: Subcategories */}
                    {hoveredCategory &&
                      hoveredCategory.subcategories?.length > 0 && (
                        <Box sx={{ minWidth: 150 }}>
                          {hoveredCategory.subcategories.map((sub) => (
                            <Typography
                              key={sub.id}
                              sx={{
                                ...linkStyle,
                                fontWeight:
                                  hoveredSubcategory?.id === sub.id
                                    ? "bold"
                                    : "normal",
                                backgroundColor:
                                  hoveredSubcategory?.id === sub.id
                                    ? "#f3e5f5"
                                    : "transparent",
                              }}
                              onMouseEnter={() => setHoveredSubcategory(sub)}
                            >
                              {sub.name}
                            </Typography>
                          ))}
                        </Box>
                      )}

                    {/* العمود الثالث: Courses */}
                    {hoveredSubcategory &&
                      hoveredSubcategory.courses?.length > 0 && (
                        <Box sx={{ minWidth: 200 }}>
                          {hoveredSubcategory.courses.map((course) => (
                            <Typography
                              key={course.id}
                              sx={{ ...linkStyle, cursor: "pointer" }}
                              onClick={() => navigate(`/course/${course.id}`)}
                            >
                              {course.name}
                            </Typography>
                          ))}
                        </Box>
                      )}
                  </Box>
                )}
              </Box>
              {/* Search Bar */}
              <Paper
                component="form"
                onSubmit={(e) => e.preventDefault()}
                sx={{
                  ...searchBarStyle,
                  flexGrow: 1,
                  maxWidth: 600,
                }}
              >
                <IconButton type="submit" sx={searchBtnStyle}>
                  <SearchIcon sx={{ color: "gray" }} />
                </IconButton>
                <InputBase
                  sx={{ flex: 1, fontSize: "16px" }}
                  placeholder="Search for anything"
                />
              </Paper>
              {/* Udemy Business */}
              <Box
                onMouseEnter={() => setOpenBusiness(true)}
                onMouseLeave={() => setOpenBusiness(false)}
                sx={{ position: "relative" }}
              >
                <Typography sx={linkStyle}>Udemy Business</Typography>
                {openBusiness && (
                  <Box sx={popoverStyle}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#001a33" }}
                    >
                      Get your team access to over 27,000 top Udemy courses,
                      anytime, anywhere.
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={businessBtnStyle}
                    >
                      Try Udemy Business
                    </Button>
                  </Box>
                )}
              </Box>
              {/* Teach on Udemy */}
              <Box
                onMouseEnter={() => setOpenTeach(true)}
                onMouseLeave={() => setOpenTeach(false)}
                sx={{ position: "relative" }}
              >
                <Typography sx={linkStyle}>Teach on Udemy</Typography>
                {openTeach && (
                  <Box sx={popoverStyle}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#001a33" }}
                    >
                      Turn what you know into an opportunity and reach millions
                      around the world.
                    </Typography>
                    <Button variant="contained" sx={teachBtnStyle}>
                      Learn more
                    </Button>
                  </Box>
                )}
              </Box>{" "}
              {/* Icons and Buttons */}
              {user ? (
                <>
                  <IconButton onClick={() => navigate("/wishlist")}>
                    <FavoriteBorderIcon />
                  </IconButton>
                  <IconButton>
                    <Badge color="error" variant="dot">
                      <NotificationsOutlinedIcon />
                    </Badge>
                  </IconButton>
                  <IconButton onClick={() => navigate("/cart")}>
                    <ShoppingCartOutlinedIcon />
                  </IconButton>
                  <IconButton onClick={handleMenu}>
                    <Avatar src={user?.photoURL} sx={{ width: 32, height: 32 }}>
                      {user?.displayName?.[0] ||
                        user?.email?.[0]?.toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate("/Userprofile");
                      }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                location.pathname !== "/login" &&
                location.pathname !== "/signup" && (
                  <>
                    <IconButton onClick={() => navigate("/cart")}>
                      <ShoppingCartOutlinedIcon />
                    </IconButton>
                    <Button
                      variant="outlined"
                      sx={loginBtnStyle}
                      onClick={() => navigate("/login")}
                    >
                      Log in
                    </Button>
                    <Button
                      variant="contained"
                      sx={signupBtnStyle}
                      onClick={() => navigate("/signup")}
                    >
                      Sign up
                    </Button>
                  </>
                )
              )}
              <Button variant="outlined" sx={langBtnStyle}>
                <LanguageIcon />
              </Button>
            </Box>
          )}
        </Box>
        {/* Search Bar - Mobile */}
        {isMobile && showSearch && (
          <Box sx={{ mt: 2 }}>
            <Paper
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={{ ...searchBarStyle, width: "100%" }}
            >
              <InputBase
                sx={{ flex: 1, fontSize: "16px" }}
                placeholder="Search..."
              />
              <IconButton type="submit" sx={searchBtnStyle}>
                <SearchIcon sx={{ color: "#fff" }} />
              </IconButton>
            </Paper>
          </Box>
        )}{" "}
        {/* Drawer */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
          <Box sx={{ width: 300 }} role="presentation">
            {/* Search Icon + Cart + Login ... لو تحبي تضيفيهم */}

            {/* Explore List */}
            <List>
              <ListItem>
                <ListItemText
                  primary="Explore"
                  primaryTypographyProps={{ fontWeight: "bold" }}
                />
              </ListItem>

              {categories.map((category) => (
                <Box key={category.id} sx={{ pl: 2 }}>
                  <ListItem
                    button
                    onClick={() =>
                      setHoveredCategory((prev) =>
                        prev?.id === category.id ? null : category
                      )
                    }
                  >
                    <ListItemText primary={category.name} />
                  </ListItem>

                  {/* Subcategories */}
                  {hoveredCategory?.id === category.id &&
                    category.subcategories?.map((sub) => (
                      <Box key={sub.id} sx={{ pl: 3 }}>
                        <ListItem
                          button
                          onClick={() =>
                            setHoveredSubcategory((prev) =>
                              prev?.id === sub.id ? null : sub
                            )
                          }
                        >
                          <ListItemText primary={sub.name} />
                        </ListItem>

                        {/* Courses */}
                        {hoveredSubcategory?.id === sub.id &&
                          sub.courses?.map((course) => (
                            <Box key={course.id} sx={{ pl: 4 }}>
                              <ListItem
                                button
                                onClick={() => {
                                  navigate(`/course/${course.id}`);
                                  setDrawerOpen(false);
                                }}
                              >
                                <ListItemText primary={course.name} />
                              </ListItem>
                            </Box>
                          ))}
                      </Box>
                    ))}
                </Box>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </AppBar>
  );
};

// Styles
const linkStyle = {
  cursor: "pointer",
  px: 1,
  py: 1,
  borderRadius: "4px",
  transition: "0.2s",
  color: "#001a33",
  "&:hover": {
    color: "#8000ff",
    backgroundColor: "#e0ccff",
  },
};

// const iconBtnStyle = {
//   color: "#001a33",
//   borderRadius: "4px",
//   "&:hover": {
//     backgroundColor: "#e0ccff",
//     color: "#8000ff",
//   },
// };

const loginBtnStyle = {
  color: "#8000ff",
  borderColor: "#8000ff",
  textTransform: "none",
  fontWeight: "bold",
  borderRadius: "4px",
  py: 1,
  "&:hover": {
    backgroundColor: "#e0ccff",
    borderColor: "#8000ff",
  },
};

const signupBtnStyle = {
  backgroundColor: "#8000ff",
  color: "#fff",
  textTransform: "none",
  fontWeight: "bold",
  borderRadius: "4px",
  py: 1,
  "&:hover": {
    backgroundColor: "#6a1b9a",
  },
};

const langBtnStyle = {
  color: "rgb(37, 36, 36)",
  borderColor: "#8000ff",
  textTransform: "none",
  borderRadius: "4px",
  py: 1,
  "&:hover": {
    backgroundColor: "#e0ccff",
    borderColor: "#8000ff",
  },
};

const popoverStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  bgcolor: "#fff",
  boxShadow: 3,
  p: 2,
  mt: 1,
  borderRadius: 2,
  zIndex: 10,
  minWidth: 250,
};

const businessBtnStyle = {
  backgroundColor: "#8000ff",
  fontWeight: "bold",
  width: "100%",
};

const teachBtnStyle = {
  backgroundColor: "#8000ff",
  fontWeight: "bold",
  width: "100%",
};

const searchBarStyle = {
  p: "0px 0px",
  display: "flex",
  alignItems: "left",
  borderRadius: 999,
  border: "1px solid gray",
  // transition: "0.2s",
  "&:focus-within": {
    borderColor: "#8000ff",
  },
};

const searchBtnStyle = {
  backgroundColor: "transparent",
  borderRadius: "50%",
  p: 2,
  ml: 1,
  transition: "0.2s",
  "&:hover": {
    backgroundColor: "transparent",
  },
  "& .MuiSvgIcon-root": {
    color: "gray",
    transition: "0.2s",
  },
  "&:hover .MuiSvgIcon-root": {
    color: "black",
  },
};

export default Header;
