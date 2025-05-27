/** @format */

import {
	Box,
	Button,
    Badge,
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LanguageIcon from "@mui/icons-material/Language";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import React from "react";
import { useNavigate } from "react-router-dom";

const MobileDrawer = ({
	drawerOpen,
	handleDrawerToggle,
	categories,
	selectedCategory,
	setSelectedCategory,
	subCategories,
	user,
	userData,
	wishlistItems,
	handleNavigate,
	handleLogout,
	handleLanguageToggle,
	renderWishlistIcon,
	t,
	i18n,
	location,
}) => {
	const navigate = useNavigate();

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
		color: "#1c1d1f",
		borderColor: "#8000ff",
		textTransform: "none",
		borderRadius: "4px",
		py: 1,
		"&:hover": {
			backgroundColor: "#e0ccff",
			borderColor: "#8000ff",
		},
	};

	return (
		<Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
			<Box sx={{ width: 280 }}>
				<List>
					<ListItem>
						<ListItemText primary={t("Categories")} />
					</ListItem>
					{categories.map((category) => (
						<div key={category.id}>
							<ListItemButton
								onClick={() => {
									setSelectedCategory(category);
									handleNavigate("category", category.id);
								}}>
								<ListItemText primary={category.name} />
								<ChevronRightIcon />
							</ListItemButton>
							{selectedCategory?.id === category.id &&
								subCategories.length > 0 && (
									<List component="div" disablePadding>
										{subCategories.map((subCategory) => (
											<ListItemButton
												key={subCategory.id}
												sx={{ pl: 4 }}
												onClick={() => {
													handleNavigate("subcategory", subCategory.id);
												}}>
												<ListItemText primary={subCategory.name} />
											</ListItemButton>
										))}
									</List>
								)}
						</div>
					))}
					<Divider sx={{ my: 1 }} />
					<ListItemButton
						onClick={() => {
							navigate("/");
							handleDrawerToggle();
						}}>
						<ListItemText primary={t("Home")} />
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							navigate("/about");
							handleDrawerToggle();
						}}>
						<ListItemText primary={t("About Us")} />
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							navigate("/contact");
							handleDrawerToggle();
						}}>
						<ListItemText primary={t("Contact Us")} />
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							navigate("/help");
							handleDrawerToggle();
						}}>
						<ListItemText primary={t("Help Center")} />
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							navigate("/terms");
							handleDrawerToggle();
						}}>
						<ListItemText primary={t("Terms of Service")} />
					</ListItemButton>
					<ListItemButton
						onClick={() => {
							navigate("/privacy");
							handleDrawerToggle();
						}}>
						<ListItemText primary={t("Privacy Policy")} />
					</ListItemButton>
					<Divider sx={{ my: 1 }} />
					{user ? (
						<>
							<ListItem>
								<ListItemIcon>
									<Avatar
										src={userData?.profile_picture}
										sx={{ bgcolor: "#8000ff" }}>
										{user.email?.[0].toUpperCase()}
									</Avatar>
								</ListItemIcon>
								<ListItemText
									primary={t("Profile")}
									onClick={() => {
										navigate("/userprofile");
										handleDrawerToggle();
									}}
								/>
							</ListItem>
							<ListItemButton
								onClick={() => {
									navigate("/wishlist");
									handleDrawerToggle();
								}}>
								<ListItemIcon>
									<Badge
										badgeContent={wishlistItems?.length || 0}
										color="secondary"
										max={99}
										sx={{
											"& .MuiBadge-badge": {
												backgroundColor: "#a435f0",
												color: "#fff",
											},
										}}>
										{renderWishlistIcon()}
									</Badge>
								</ListItemIcon>
								<ListItemText primary={t("Wishlist")} />
							</ListItemButton>
							<ListItem>
								<ListItemIcon>
									<NotificationsOutlinedIcon />
								</ListItemIcon>
								<ListItemText primary={t("Notifications")} />
							</ListItem>
							<ListItemButton
								onClick={() => {
									navigate("/cart");
									handleDrawerToggle();
								}}>
								<ListItemIcon>
									<ShoppingCartOutlinedIcon />
								</ListItemIcon>
								<ListItemText primary={t("Shopping Cart")} />
							</ListItemButton>
							<ListItem>
								<Button
									variant="outlined"
									sx={loginBtnStyle}
									onClick={handleLogout}>
									{t("LOG OUT")}
								</Button>
							</ListItem>
						</>
					) : (
						<>
							<ListItem>
								<ListItemIcon>
									<ShoppingCartOutlinedIcon />
								</ListItemIcon>
								<ListItemText primary={t("Shopping Cart")} />
							</ListItem>
							{location.pathname !== "/login" && (
								<ListItem>
									<Button
										variant="outlined"
										sx={loginBtnStyle}
										onClick={() => {
											navigate("/login");
											handleDrawerToggle();
										}}>
										{t("LOG IN")}
									</Button>
								</ListItem>
							)}
							{location.pathname !== "/signup" && (
								<ListItem>
									<Button
										variant="contained"
										sx={signupBtnStyle}
										onClick={() => {
											navigate("/signup");
											handleDrawerToggle();
										}}>
										{t("SIGN UP")}
									</Button>
								</ListItem>
							)}
						</>
					)}
					<ListItem>
						<Button
							variant="outlined"
							sx={langBtnStyle}
							onClick={handleLanguageToggle}>
							<LanguageIcon sx={{ mr: 1 }} />
							{i18n.language === "en" ? "عربي" : "English"}
						</Button>
					</ListItem>
				</List>
			</Box>
		</Drawer>
	);
};

export default MobileDrawer;
