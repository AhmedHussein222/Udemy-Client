/** @format */

import LanguageIcon from "@mui/icons-material/Language";
import {
  Avatar,
  Box,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

const UserMenu = ({
  userMenuAnchor,
  handleUserMenuClose,
  user,
  userData,
  handleNavigate,
  handleLogout,
  handleLanguageToggle,
  t,
  i18n,
}) => {
  return (
    <Menu
      anchorEl={userMenuAnchor}
      open={Boolean(userMenuAnchor)}
      onClose={handleUserMenuClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            position: "relative",
            mt: 0,
            width: {
              xs: "calc(100vw - 16px)", // Almost full width on mobile with padding
              sm: "320px", // Fixed width on small screens and up
              md: "350px", // Slightly larger on medium screens
            },
            minWidth: {
              xs: "280px",
              sm: "320px",
            },
            maxWidth: {
              xs: "calc(100vw - 16px)",
              sm: "400px",
            },
            maxHeight: {
              xs: "calc(100vh - 100px)", // Account for header and padding on mobile
              sm: "calc(100vh - 80px)", // More space on larger screens
              md: "calc(100vh - 64px)",
            }, // Responsive positioning for mobile only
            "@media (max-width: 600px)": {
              position: "fixed",
              left: "8px !important",
              right: "8px !important",
            },
          },
        },
      }}
      MenuListProps={{
        sx: {
          padding: 0,
          maxHeight: {
            xs: "calc(100vh - 140px)",
            sm: "calc(100vh - 120px)",
            md: "calc(100vh - 100px)",
          },
          overflowY: "auto",
          overflowX: "hidden",
          // Smooth scrolling
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          // Enhanced scrollbar styling
          "&::-webkit-scrollbar": {
            width: {
              xs: "4px", // Thinner on mobile
              sm: "6px",
            },
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#8000ff30",
            borderRadius: "3px",
            "&:hover": {
              background: "#8000ff50",
            },
            "&:active": {
              background: "#8000ff70",
            },
          },
        },
        onMouseLeave: handleUserMenuClose,
      }}
      disableScrollLock={true}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          mt: 1.5,
          // Enhanced responsive width
          width: {
            xs: "calc(100vw - 16px)",
            sm: "320px",
            md: "350px",
          },
          minWidth: {
            xs: "280px",
            sm: "320px",
          },
          maxWidth: {
            xs: "calc(100vw - 16px)",
            sm: "400px",
          },
          maxHeight: {
            xs: "calc(100vh - 100px)",
            sm: "calc(100vh - 80px)",
            md: "calc(100vh - 64px)",
          },
          // Enhanced shadow for better visibility
          boxShadow: {
            xs: "0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)",
            sm: "0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.08)",
          },
          // Border radius for modern look
          borderRadius: {
            xs: "12px",
            sm: "8px",
          },
          // Menu list styling
          "& .MuiMenu-list": {
            padding: {
              xs: "4px 0",
              sm: "8px 0",
            },
            maxHeight: {
              xs: "calc(100vh - 140px)",
              sm: "calc(100vh - 120px)",
              md: "calc(100vh - 100px)",
            },
            overflowY: "auto",
            overflowX: "hidden",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            // Scrollbar styling
            "&::-webkit-scrollbar": {
              width: {
                xs: "4px",
                sm: "6px",
              },
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#8000ff30",
              borderRadius: "3px",
              "&:hover": {
                background: "#8000ff50",
              },
              "&:active": {
                background: "#8000ff70",
              },
            },
          },
          // Enhanced menu item styling
          "& .MuiMenuItem-root": {
            px: {
              xs: 1.5,
              sm: 2,
            },
            py: {
              xs: 1.2,
              sm: 1.5,
            },
            minHeight: {
              xs: "44px", // Touch-friendly on mobile
              sm: "auto",
            },
            fontSize: {
              xs: "0.9rem",
              sm: "1rem",
            },
            "&:hover": {
              backgroundColor: "#e0ccff",
              color: "#8000ff",
              transform: {
                xs: "none", // No transform on mobile for better performance
                sm: "translateX(2px)",
              },
              transition: "all 0.2s ease-in-out",
              "& .MuiTypography-root": {
                color: "#8000ff",
              },
              "& .MuiSvgIcon-root": {
                color: "#8000ff",
              },
            },
            "&:active": {
              backgroundColor: "#d1b3ff",
              transform: "scale(0.98)",
            },
          },
          // Enhanced divider styling
          "& .MuiDivider-root": {
            margin: {
              xs: "2px 8px",
              sm: "4px 0",
            },
            borderColor: "#d1d2e0",
            opacity: 0.7,
          },
          // Responsive typography
          "& .MuiTypography-root": {
            fontSize: {
              xs: "0.85rem",
              sm: "0.9rem",
              md: "1rem",
            },
          },
        },
      }}
    >
      {/* User Profile Section */}
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleNavigate("/userprofile");
        }}
        sx={{
          p: {
            xs: 1.5,
            sm: 2,
          },
          minHeight: {
            xs: "60px",
            sm: "auto",
          },
          "&:hover": {
            backgroundColor: "#e0ccff",
            "& .MuiTypography-root": {
              color: "#8000ff",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Avatar
            src={userData?.profile_picture}
            sx={{
              width: {
                xs: 36,
                sm: 40,
              },
              height: {
                xs: 36,
                sm: 40,
              },
              mr: {
                xs: 1.5,
                sm: 2,
              },
              bgcolor: "#8000ff",
              fontSize: {
                xs: "1rem",
                sm: "1.2rem",
              },
            }}
          >
            {user?.email?.[0].toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                fontSize: {
                  xs: "0.9rem",
                  sm: "1rem",
                },
                lineHeight: 1.2,
                // Text overflow handling
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userData?.first_name} {userData?.last_name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.85rem",
                },
                lineHeight: 1.2,
                // Text overflow handling
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </MenuItem>

      <Divider sx={{ borderColor: "#d1d2e0", my: { xs: 0.5, sm: 1 } }} />

      {/* Learning Section */}
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleNavigate("/MyLearning");
        }}
      >
        {t("My Learning")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleNavigate("/cart");
        }}
      >
        {t("My Cart")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleNavigate("/wishlist");
        }}
      >
        {t("Wishlist")}
      </MenuItem>

      {/* Conditional Teaching Option */}
      {userData?.role !== "instructor" && (
        <MenuItem
          onClick={() => {
            handleUserMenuClose();
            handleNavigate("/Welcomehome");
          }}
        >
          {t("Teach on Udemy")}
        </MenuItem>
      )}

      <Divider sx={{ borderColor: "#d1d2e0", my: { xs: 0.5, sm: 1 } }} />

      {/* Communication Section */}
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleNavigate("/notifications");
        }}
      >
        {t("Notifications")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleNavigate("/messages");
        }}
      >
        {t("Messages")}
      </MenuItem>

      <Divider sx={{ borderColor: "#d1d2e0", my: { xs: 0.5, sm: 1 } }} />

      {/* Account Management Section */}
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleNavigate("/userprofile");
        }}
      >
        {t("Account Settings")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleNavigate("/payment");
        }}
      >
        {t("Payment Methods")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleNavigate("/subscriptions");
        }}
      >
        {t("Subscriptions")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleNavigate("/credits");
        }}
      >
        {t("Udemy Credits")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleNavigate("/purchase-history");
        }}
      >
        {t("Purchase History")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleNavigate("/userprofile");
        }}
      >
        {t("Public Profile")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleNavigate("/userprofile");
        }}
      >
        {t("Edit Profile")}
      </MenuItem>

      <Divider sx={{ borderColor: "#d1d2e0", my: { xs: 0.5, sm: 1 } }} />

      {/* Support and Settings Section */}
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleNavigate("/help");
        }}
      >
        {t("Help and Support")}
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleUserMenuClose();
          handleLanguageToggle();
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LanguageIcon
            sx={{
              mr: 1,
              fontSize: {
                xs: "1.2rem",
                sm: "1.5rem",
              },
            }}
          />
          <Typography
            sx={{
              fontSize: {
                xs: "0.85rem",
                sm: "0.9rem",
              },
            }}
          >
            {i18n.language === "en" ? "عربي" : "English"}
          </Typography>
        </Box>
      </MenuItem>

      <Divider sx={{ borderColor: "#d1d2e0", my: { xs: 0.5, sm: 1 } }} />

      {/* Logout Section */}
      <MenuItem
        onClick={handleLogout}
        sx={{
          color: "#d32f2f",
          fontWeight: "500",
          "&:hover": {
            backgroundColor: "#ffebee",
            color: "#c62828",
          },
        }}
      >
        {t("Log Out")}
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;
