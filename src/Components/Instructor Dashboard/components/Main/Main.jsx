import AccountCircle from "@mui/icons-material/AccountCircle";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import {
  Box,
  Collapse,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";

const InsMain = () => {
  const { t } = useTranslation();
  let nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleSubItemClick = (path) => {
    nav(path);
    setOpen(false);
  };

  // Localized menu items
  const menuItems = [
    {
      title: t("Courses"),
      icon: <OndemandVideoIcon sx={{ color: "white" }} />,
      subItems: [
        { title: t("All Courses"), path: "/instructor/courses" },
        { title: t("Create Course"), path: "/instructor/create" },
      ],
    },
    {
      title: t("Performance"),
      icon: <BarChartOutlinedIcon sx={{ color: "white" }} />,
      subItems: [
        { title: t("Reviews"), path: "/instructor/reviews" },
        { title: t("Revenue"), path: "/instructor/revenue" },
      ],
    },
  ];

  const DrawerList = (
    <Box
      sx={{
        width: 250,
        color: "white",
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      role="presentation"
    >
      <Grid container justifyContent="center" sx={{ margin: 2 }}>
        <Grid item>
          <img
            src="https://logos-world.net/wp-content/uploads/2021/11/Udemy-Symbol.png"
            alt="Udemy Logo"
            style={{
              width: "auto",
              height: "4rem",
            }}
          />
        </Grid>
      </Grid>
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.title}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleItemClick(item.title)}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
                {expandedItems[item.title] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse
              in={expandedItems[item.title]}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {item.subItems.map((subItem) => (
                  <ListItemButton
                    key={subItem.title}
                    onClick={() => handleSubItemClick(subItem.path)}
                    sx={{
                      pl: 4,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <ListItemText primary={subItem.title} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "white" }}>
        <Toolbar>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Box display="flex" alignItems="center">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon sx={{ color: "black" }} />
              </IconButton>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography
                variant="body1"
                onClick={() => nav("/")}
                color={grey[700]}
                sx={{
                  fontWeight: "bold",
                  borderRadius: 1,
                  cursor: "pointer",
                  ":hover": { backgroundColor: "#ede5f9" },
                }}
              >
                {t("Student")}
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle sx={{ color: "black" }} />
              </IconButton>{" "}
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                disableScrollLock={true}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      minWidth: 180,
                      boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
                    },
                  },
                }}
                MenuListProps={{
                  sx: {
                    py: 0.5,
                  },
                }}
              >
                <MenuItem
                  onClick={handleClose}
                  sx={{
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "#e0ccff",
                    },
                  }}
                >
                  {t("Profile")}
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  sx={{
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "#e0ccff",
                    },
                  }}
                >
                  {t("My account")}
                </MenuItem>
              </Menu>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "black",
            color: "white",
          },
        }}
      >
        {DrawerList}
      </Drawer>
      <Outlet />
    </Box>
  );
};

export default InsMain;
