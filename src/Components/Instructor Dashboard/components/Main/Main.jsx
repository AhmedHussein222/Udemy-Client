import AccountCircle from '@mui/icons-material/AccountCircle';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { Box, Collapse, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const menuItems = [
  {
    title: 'Courses',
    icon: <OndemandVideoIcon sx={{ color: 'white' }} />,
    subItems: [
      { title: 'All Courses', path: '/instructor/courses' },
      { title: 'Create Course', path: '/instructor/create' },
    ]
  },
  // {
  //   title: 'Communication',
  //   icon: <CommentOutlinedIcon sx={{ color: 'white' }} />,
  //   subItems: [
  //     { title: 'Messages', path: '/instructor/messages' },
  //     { title: 'Announcements', path: '/instructor/announcements' }
  //   ]
  // },
  {
    title: 'Performance',
    icon: <BarChartOutlinedIcon sx={{ color: 'white' }} />,
    subItems: [
      { title: 'Reviews', path: '/instructor/reviews' },
      { title: 'Revenue', path: '/instructor/revenue' }
    ]
  },
  // {
  //   title: 'Tools',
  //   icon: <BuildOutlinedIcon sx={{ color: 'white' }} />,
  //   subItems: [
  //     { title: 'Settings', path: '/instructor/settings' },
  //     { title: 'Resources', path: '/instructor/resources' }
  //   ]
  // },
  // {
  //   title: 'Resources',
  //   icon: <HelpOutlineOutlinedIcon sx={{ color: 'white' }} />,
  //   subItems: [
  //     { title: 'Help Center', path: '/instructor/help' },
  //     { title: 'Community', path: '/instructor/community' }
  //   ]
  // }
];

function InsMain() {
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
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleSubItemClick = (path) => {
    nav(path);
    setOpen(false);
  };

  const DrawerList = (
    <Box sx={{ 
      width: 250,
      color: 'white',
      backgroundColor: 'black',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }} role="presentation">
      <Grid container justifyContent="center" sx={{ margin: 2 }}>
        <Grid item>
          <img
            src="https://logos-world.net/wp-content/uploads/2021/11/Udemy-Symbol.png"
            alt="Udemy Logo"
            style={{
              width: 'auto',
              height: '4rem',
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
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
                {expandedItems[item.title] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={expandedItems[item.title]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.subItems.map((subItem) => (
                  <ListItemButton
                    key={subItem.title}
                    onClick={() => handleSubItemClick(subItem.path)}
                    sx={{
                      pl: 4,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
      <AppBar position="static" sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
            <Box display="flex" alignItems="center">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}
              >
                <MenuIcon sx={{ color: 'black' }} />
              </IconButton>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography variant="body1" onClick={() => nav("/")} color={grey[700]} sx={{ fontWeight: 'bold' }}>
                Student
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle sx={{ color: 'black' }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: 'black',
            color: 'white',
          },
        }}
      >
        {DrawerList}
      </Drawer>
      <Outlet />
    </Box>
  );
}

export default InsMain;
