import React, { Children, useState } from 'react';
import { Box, Drawer, Button, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Grid, Stack } from '@mui/material';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { grey } from '@mui/material/colors';
import Home from '../Home/home';
import CreateCourse from '../CreateCourse/createcourse';
import { Outlet, useNavigate } from 'react-router-dom';


const iconMap = {
  Courses: <OndemandVideoIcon sx={{ color: 'white' }} />,
  Communication: <CommentOutlinedIcon sx={{ color: 'white' }} />,
  Performance: <BarChartOutlinedIcon sx={{ color: 'white' }} />,
  Tools: <BuildOutlinedIcon sx={{ color: 'white' }} />,
  Resources: <HelpOutlineOutlinedIcon sx={{ color: 'white' }} />,
};
function InsMain() {
  let nav = useNavigate()
  const [open, setOpen] = useState(false); 
//   const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null); 

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{
        width: 250,
        color: 'white',
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
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

      <List sx={{ flexGrow: 1 }}>
        {['Courses', 'Communication', 'Performance', 'Tools', 'Resources'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{iconMap[text]}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

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
