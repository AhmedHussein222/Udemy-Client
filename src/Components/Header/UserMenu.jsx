/** @format */

import {
	Avatar,
	Box,
	Divider,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import React from "react";

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
			PaperProps={{
				elevation: 0,
				sx: {
					overflow: "visible",
					filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
					mt: 1.5,
					minWidth: 200,
					maxHeight: "calc(100vh - 64px)",
					"& .MuiMenu-list": {
						padding: 0,
						maxHeight: "calc(100vh - 64px)",
						overflowY: "auto",
						overflowX: "hidden",
						"&::-webkit-scrollbar": {
							width: "6px",
						},
						"&::-webkit-scrollbar-track": {
							background: "transparent",
						},
						"&::-webkit-scrollbar-thumb": {
							background: "#8000ff40",
							borderRadius: "3px",
							"&:hover": {
								background: "#8000ff60",
							},
						},
					},
					"& .MuiMenuItem-root": {
						px: 2,
						py: 1.5,
						"&:hover": {
							backgroundColor: "#e0ccff",
							color: "#8000ff",
							"& .MuiTypography-root": {
								color: "#8000ff",
							},
							"& .MuiSvgIcon-root": {
								color: "#8000ff",
							},
						},
					},
					"& .MuiDivider-root": {
						margin: "4px 0",
						borderColor: "#d1d2e0",
					},
				},
			}}>
			<MenuItem
				onClick={() => {
					handleUserMenuClose();
					handleNavigate("/userprofile");
				}}
				sx={{
					p: 2,
					"&:hover": {
						backgroundColor: "#e0ccff",
						"& .MuiTypography-root": {
							color: "#8000ff",
						},
					},
				}}>
				<Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
					<Avatar
						src={userData?.profile_picture}
						sx={{ width: 40, height: 40, mr: 2, bgcolor: "#8000ff" }}>
						{user?.email?.[0].toUpperCase()}
					</Avatar>
					<Box>
						<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
							{userData?.first_name} {userData?.last_name}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{user?.email}
						</Typography>
					</Box>
				</Box>
			</MenuItem>
			<Divider sx={{ borderColor: "#d1d2e0", my: 1 }} />
			<MenuItem
				onClick={() => {
					handleUserMenuClose();
					handleNavigate("/MyLearning");
				}}>
				{t("My Learning")}
			</MenuItem>
			<MenuItem
				onClick={() => {
					handleUserMenuClose();
					handleNavigate("/cart");
				}}>
				{t("My Cart")}
			</MenuItem>
			<MenuItem
				onClick={() => {
					handleUserMenuClose();
					handleNavigate("/wishlist");
				}}>
				{t("Wishlist")}
			</MenuItem>
			{userData?.role !== "instructor" && (
				<MenuItem
					onClick={() => {
						handleUserMenuClose();
						handleNavigate("/Welcomehome");
					}}>
					{t("Teach on Udemy")}
				</MenuItem>
			)}
			<Divider sx={{ borderColor: "#d1d2e0", my: 1 }} />
			<MenuItem
				onClick={() => {
					handleUserMenuClose();
					handleNavigate("/notifications");
				}}>
				{t("Notifications")}
			</MenuItem>
			<MenuItem
				onClick={() => {
					handleUserMenuClose();
					handleNavigate("/messages");
				}}>
				{t("Messages")}
			</MenuItem>
			<Divider sx={{ borderColor: "#d1d2e0", my: 1 }} />
			<MenuItem
				onClick={() => {
					handleUserMenuClose();
					handleNavigate("/userprofile");
				}}>
				{t("Account Settings")}
			</MenuItem>
			<MenuItem
				onClick={() => {
					handleUserMenuClose();
					handleNavigate("/payment");
				}}>
				{t("Payment Methods")}
			</MenuItem>
			<MenuItem
				onClick={() => {
					handleUserMenuClose();
					handleNavigate("/subscriptions");
				}}>
				{t("Subscriptions")}
			</MenuItem>
			<MenuItem
				onClick={() => {
					handleUserMenuClose();
					handleNavigate("/credits");
				}}>
				{t("Udemy Credits")}
			</MenuItem>
			<MenuItem
				onClick={() => {
					handleUserMenuClose();
					handleNavigate("/purchase-history");
				}}>
				{t("Purchase History")}
			</MenuItem>
			<MenuItem
				onClick={() => {
					handleUserMenuClose();
					handleNavigate("/userprofile");
				}}>
				{t("Public Profile")}
			</MenuItem>
			<MenuItem
				onClick={() => {
					handleUserMenuClose();
					handleNavigate("/userprofile");
				}}>
				{t("Edit Profile")}
			</MenuItem>
			<Divider sx={{ borderColor: "#d1d2e0", my: 1 }} />
			<MenuItem
				onClick={() => {
					handleUserMenuClose();
					handleNavigate("/help");
				}}>
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
				}}>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					<LanguageIcon sx={{ mr: 1 }} />
					{i18n.language === "en" ? "عربي" : "English"}
				</Box>
			</MenuItem>
			<Divider sx={{ borderColor: "#d1d2e0", my: 1 }} />
			<MenuItem onClick={handleLogout} sx={{ color: "#d32f2f" }}>
				{t("Log Out")}
			</MenuItem>
		</Menu>
	);
};

export default UserMenu;
