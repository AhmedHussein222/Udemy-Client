import React, { useState } from "react";
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
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/logo-udemy.svg";

const Header = () => {
  const [openBusiness, setOpenBusiness] = useState(false);
  const [openTeach, setOpenTeach] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff" }} elevation={1}>
      <Box sx={{ px: 2, py: 1 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {isMobile ? (
            <>
              {/* Menu Icon */}
              <IconButton onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>

              {/* Logo Centered */}
              <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
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
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <img src={logo} style={{ width: 90 }} alt="logo" />
                <Typography sx={linkStyle}>Explore</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  onMouseEnter={() => setOpenBusiness(true)}
                  onMouseLeave={() => setOpenBusiness(false)}
                  sx={{ position: "relative" }}
                >
                  <Typography sx={linkStyle}>Udemy Business</Typography>
                  {openBusiness && (
                    <Box sx={popoverStyle}>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: "#001a33" }}>
                        Get your team access to over 27,000 top Udemy courses, anytime, anywhere.
                      </Typography>
                      <Button variant="contained" size="small" sx={businessBtnStyle}>
                        Try Udemy Business
                      </Button>
                    </Box>
                  )}
                </Box>

                <Box
                  onMouseEnter={() => setOpenTeach(true)}
                  onMouseLeave={() => setOpenTeach(false)}
                  sx={{ position: "relative" }}
                >
                  <Typography sx={linkStyle}>Teach on Udemy</Typography>
                  {openTeach && (
                    <Box sx={popoverStyle}>
                      <Typography variant="h6" fontWeight="bold" sx={{ color: "#001a33" }}>
                        Turn what you know into an opportunity and reach millions around the world.
                      </Typography>
                      <Button variant="contained" sx={teachBtnStyle}>Learn more</Button>
                    </Box>
                  )}
                </Box>

                <IconButton sx={iconBtnStyle}>
                  <ShoppingCartOutlinedIcon />
                </IconButton>
                <Button variant="outlined" sx={loginBtnStyle}>Log in</Button>
                <Button variant="contained" sx={signupBtnStyle}>Sign up</Button>
                <Button variant="outlined" sx={langBtnStyle}>
                  <LanguageIcon />
                </Button>
              </Box>
            </>
          )}
        </Box>

        {/* Search Bar - Desktop */}
        {!isMobile && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Paper
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={searchBarStyle}
            >
              <InputBase sx={{ flex: 1, fontSize: "18px" }} placeholder="  Search for anything" />
              <IconButton type="submit" sx={searchBtnStyle}>
                <SearchIcon sx={{ color: "#fff" }} />
              </IconButton>
            </Paper>
          </Box>
        )}

        {/* Search Bar - Mobile */}
        {isMobile && showSearch && (
          <Box sx={{ mt: 2 }}>
            <Paper
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={{ ...searchBarStyle, width: "100%" }}
            >
              <InputBase sx={{ flex: 1, fontSize: "16px" }} placeholder="Search..." />
              <IconButton type="submit" sx={searchBtnStyle}>
                <SearchIcon sx={{ color: "#fff" }} />
              </IconButton>
            </Paper>
          </Box>
        )}

        {/* Drawer */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
          <Box sx={{ width: 250 }}>
            <List>
              <ListItem><ListItemText primary="Explore" /></ListItem>
              <ListItem><ListItemText primary="Udemy Business" /></ListItem>
              <ListItem><ListItemText primary="Teach on Udemy" /></ListItem>
              <ListItem><Button variant="outlined" sx={loginBtnStyle}>LOG IN</Button></ListItem>
              <ListItem><Button variant="contained" sx={signupBtnStyle}>SIGN UP</Button></ListItem>
              <ListItem>
                <ListItemIcon>
                  <LanguageIcon />
                </ListItemIcon>
              </ListItem>
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

const iconBtnStyle = {
  color: "#001a33",
  borderRadius: "4px",
  "&:hover": {
    backgroundColor: "#e0ccff",
    color: "#8000ff",
  },
};

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
  p: "6px 8px",
  display: "flex",
  alignItems: "center",
  width: "80%",
  borderRadius: 999,
  boxShadow: 1,
  border: "1px solid #ccc",
  transition: "0.2s",
  "&:focus-within": {
    borderColor: "#8000ff",
  },
};

const searchBtnStyle = {
  backgroundColor: "#e0ccff",
  borderRadius: "50%",
  p: 1.5,
  ml: 1,
  transition: "0.2s",
  "&:hover": {
    backgroundColor: "#8000ff",
  },
  "&:hover .MuiSvgIcon-root": {
    color: "#fff",
  },
};

export default Header;
