/** @format */

import React, { useEffect, useState, useContext } from "react";
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
	Menu,
	MenuItem,
	Avatar,
	Badge,
	Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { UserContext } from "../../context/UserContext";
import { CartContext } from "../../context/cart-context";
import { auth, db } from "../../Firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/logo-udemy.svg";
import { useTranslation } from "react-i18next";

const Header = () => {
	const [openBusiness, setOpenBusiness] = useState(false);
	const [openTeach, setOpenTeach] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [userData, setUserData] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const isMobile = useMediaQuery("(max-width:768px)");
	const location = useLocation();
	const navigate = useNavigate();
	const { user } = useContext(UserContext);
	const { cartItems } = useContext(CartContext);

	useEffect(() => {
		const fetchUserData = async () => {
			if (user) {
				try {
					const userDocRef = doc(db, "Users", user.uid);
					const docSnap = await getDoc(userDocRef);
					if (docSnap.exists()) {
						setUserData(docSnap.data());
					}
				} catch (error) {
					console.error("Error fetching user data:", error);
				}
			}
		};
		fetchUserData();
	}, [user]);

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		try {
			await auth.signOut();
			navigate("/");
		} catch (error) {
			console.error("Error logging out:", error);
		}
		handleMenuClose();
	};

	const { t, i18n } = useTranslation();
	const toggleLanguage = () => {
		const newLang = i18n.language === "en" ? "ar" : "en";
		i18n.changeLanguage(newLang);
		localStorage.setItem("lang", newLang);
	};
	useEffect(() => {
		const savedLang = localStorage.getItem("lang");
		if (savedLang) {
			i18n.changeLanguage(savedLang);
		}
	}, [i18n]);

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	};

	return (
		<AppBar position="static" sx={{ backgroundColor: "#fff" }} elevation={1}>
			<Box sx={{ px: 2, py: 1 }}>
				{/* Header */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					{isMobile ? (
						<>
							{/* Menu Icon */}
							<IconButton onClick={toggleDrawer}>
								<MenuIcon />
							</IconButton>
							{/* Logo Centered */}{" "}
							<Box
								sx={{
									position: "absolute",
									left: "50%",
									transform: "translateX(-50%)",
									cursor: "pointer",
								}}
								onClick={() => navigate("/")}>
								<img src={logo} style={{ width: 90 }} alt="logo" />
							</Box>
							{/* Icons on Right */}
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<IconButton onClick={() => setShowSearch(!showSearch)}>
									<SearchIcon />
								</IconButton>{" "}
								<IconButton onClick={() => navigate("/cart")}>
									<Badge badgeContent={cartItems.length} color="error">
										<ShoppingCartOutlinedIcon />
									</Badge>
								</IconButton>
							</Box>
						</>
					) : (
						<>
							{" "}
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
								<Box sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
									<img src={logo} style={{ width: 90 }} alt="logo" />
								</Box>
								<Typography sx={linkStyle}>{t("Explore")}</Typography>
							</Box>
							{/* Search Bar */}{" "}
							<Paper
								component="form"
								onSubmit={handleSearch}
								sx={{
									...searchBarStyle,
									flexGrow: 1,
									maxWidth: 600,
								}}>
								<IconButton type="submit" sx={searchBtnStyle}>
									<SearchIcon sx={{ color: "gray" }} />
								</IconButton>{" "}
								<InputBase
									sx={{ flex: 1, fontSize: "16px" }}
									placeholder={t("Search for anything")}
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</Paper>
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
								<Box
									onMouseEnter={() => setOpenBusiness(true)}
									onMouseLeave={() => setOpenBusiness(false)}
									sx={{ position: "relative" }}>
									<Typography sx={linkStyle}>{t("Udemy Business")}</Typography>
									{openBusiness && (
										<Box sx={popoverStyle}>
											<Typography
												variant="h6"
												fontWeight="bold"
												sx={{ color: "#001a33" }}>
												{t(
													"Get your team access to over 27,000 top Udemy courses, anytime, anywhere."
												)}
											</Typography>
											<Button
												variant="contained"
												size="small"
												sx={businessBtnStyle}>
												{t("Try Udemy Business")}
											</Button>
										</Box>
									)}
								</Box>
							{userData?.role !== "instructor" ? (
								<Box
									onMouseEnter={() => setOpenTeach(true)}
									onMouseLeave={() => setOpenTeach(false)}
									sx={{ position: "relative" }}>
										
									<Typography
										onClick={() => navigate("/Welcomehome")}
										sx={linkStyle}>
										{t("Teach on Udemy")}
									</Typography>

									{openTeach && (
										<Box sx={popoverStyle}>
											<Typography
												variant="h6"
												fontWeight="bold"
												sx={{ color: "#001a33" }}>
												{t(
													"Turn what you know into an opportunity and reach millions around the world."
												)}
											</Typography>
											<Button onClick={()=>navigate("/Welcomehome")} variant="contained" sx={teachBtnStyle}>
												{t("Learn more")}
											</Button>
										</Box>
									)}
								</Box>
							) : (
								<Typography
									onClick={() => navigate("/instructor")}
									sx={linkStyle}>
									{t("Instructor")}
								</Typography>
							)}
								{user ? (
									<>
										<IconButton
											sx={outlinedIconStyle}
											onClick={() => navigate("/wishlist")}>
											<FavoriteBorderIcon />
										</IconButton>
										<IconButton sx={outlinedIconStyle}>
											<NotificationsOutlinedIcon />
										</IconButton>
										<IconButton
											sx={iconBtnStyle}
											onClick={() => navigate("/cart")}>
											<Badge badgeContent={cartItems.length} color="error">
												<ShoppingCartOutlinedIcon />
											</Badge>
										</IconButton>
										<IconButton onClick={handleMenuOpen}>
											<Avatar
												src={userData?.profile_picture}
												sx={{ width: 32, height: 32, bgcolor: "#8000ff" }}>
												{user.email?.[0].toUpperCase()}
											</Avatar>
										</IconButton>
										<Menu
											anchorEl={anchorEl}
											open={Boolean(anchorEl)}
											onClose={handleMenuClose}
											anchorOrigin={{
												vertical: "bottom",
												horizontal: "right",
											}}
											transformOrigin={{
												vertical: "top",
												horizontal: "right",
											}}
											PaperProps={{
												elevation: 0,
												sx: {
													overflow: "visible",
													filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
													mt: 1.5,
													minWidth: 300,
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
															background: "#8000ff20",
															borderRadius: "3px",
															"&:hover": {
																background: "#8000ff40",
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
													handleMenuClose();
													navigate("/userprofile");
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
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														width: "100%",
													}}>
													<Avatar
														src={userData?.profile_picture}
														sx={{
															width: 40,
															height: 40,
															mr: 2,
															bgcolor: "#8000ff",
														}}>
														{user?.email?.[0].toUpperCase()}
													</Avatar>
													<Box>
														<Typography
															variant="subtitle1"
															sx={{ fontWeight: "bold" }}>
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
													handleMenuClose();
													navigate("/userprofile");
												}}>
												{t("My Learning")}
											</MenuItem>
											<MenuItem
												onClick={() => {
													handleMenuClose();
													navigate("/cart");
												}}>
												{t("My Cart")}
											</MenuItem>
											<MenuItem
												onClick={() => {
													handleMenuClose();
													navigate("/wishlist");
												}}>
												{t("Wishlist")}
											</MenuItem>{" "}
											{userData?.role !== "instructor" && (
												<MenuItem
													onClick={() => {
														handleMenuClose();
														navigate("/Welcomehome");
													}}>
													{t("Teach on Udemy")}
												</MenuItem>
											)}
											<Divider sx={{ borderColor: "#d1d2e0", my: 1 }} />
											<MenuItem
												onClick={() => {
													handleMenuClose();
													navigate("/notifications");
												}}>
												{t("Notifications")}
											</MenuItem>
											<MenuItem
												onClick={() => {
													handleMenuClose();
													navigate("/messages");
												}}>
												{t("Messages")}
											</MenuItem>
											<Divider sx={{ borderColor: "#d1d2e0", my: 1 }} />
											<MenuItem
												onClick={() => {
													handleMenuClose();
													navigate("/userprofile");
												}}>
												{t("Account Settings")}
											</MenuItem>
											<MenuItem
												onClick={() => {
													handleMenuClose();
													navigate("/payment");
												}}>
												{t("Payment Methods")}
											</MenuItem>
											<MenuItem
												onClick={() => {
													handleMenuClose();
													navigate("/subscriptions");
												}}>
												{t("Subscriptions")}
											</MenuItem>
											<MenuItem
												onClick={() => {
													handleMenuClose();
													navigate("/credits");
												}}>
												{t("Udemy Credits")}
											</MenuItem>
											<MenuItem
												onClick={() => {
													handleMenuClose();
													navigate("/purchase-history");
												}}>
												{t("Purchase History")}
											</MenuItem>
											<MenuItem
												onClick={() => {
													handleMenuClose();
													navigate("/userprofile");
												}}>
												{t("Public Profile")}
											</MenuItem>
											<MenuItem
												onClick={() => {
													handleMenuClose();
													navigate("/userprofile");
												}}>
												{t("Edit Profile")}
											</MenuItem>
											<Divider sx={{ borderColor: "#d1d2e0", my: 1 }} />
											<MenuItem
												onClick={() => {
													handleMenuClose();
													navigate("/help");
												}}>
												{t("Help and Support")}
											</MenuItem>{" "}
											<MenuItem
												onClick={() => {
													handleMenuClose();
													toggleLanguage();
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
											<MenuItem
												onClick={handleLogout}
												sx={{ color: "#d32f2f" }}>
												{t("Log Out")}
											</MenuItem>
										</Menu>
									</>
								) : (
									<>
										<IconButton
											sx={iconBtnStyle}
											onClick={() => navigate("/cart")}>
											<Badge badgeContent={cartItems.length} color="error">
												<ShoppingCartOutlinedIcon />
											</Badge>
										</IconButton>
										{location.pathname !== "/login" && (
											<Button
												variant="outlined"
												sx={loginBtnStyle}
												onClick={() => navigate("/login")}>
												{t("Log in")}
											</Button>
										)}
										{location.pathname !== "/signup" && (
											<Button
												variant="contained"
												sx={signupBtnStyle}
												onClick={() => navigate("/signup")}>
												{t("Sign up")}
											</Button>
										)}
									</>
								)}
								<Button
									variant="outlined"
									sx={langBtnStyle}
									onClick={toggleLanguage}>
									<LanguageIcon sx={{ mr: 1 }} />
									{i18n.language === "en" ? "English" : "عربي"}
								</Button>
							</Box>
						</>
					)}
				</Box>
				{/* Search Bar - Mobile */}
				{isMobile && showSearch && (
					<Box sx={{ mt: 2 }}>
						<Paper
							component="form"
							onSubmit={handleSearch}
							sx={{ ...searchBarStyle, width: "100%" }}>
							<InputBase
								sx={{ flex: 1, fontSize: "16px" }}
								placeholder={t("Search...")}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<IconButton type="submit" sx={searchBtnStyle}>
								<SearchIcon sx={{ color: "gray" }} />
							</IconButton>
						</Paper>
					</Box>
				)}{" "}
				{/* Drawer */}
				<Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
					<Box sx={{ width: 250 }}>
						<List>
							<ListItem>
								<ListItemText primary={t("Explore")} />
							</ListItem>
							<ListItem>
								<ListItemText primary={t("Udemy Business")} />
							</ListItem>
							<ListItem>
								<ListItemText primary={t("Teach on Udemy")} />
							</ListItem>
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
												toggleDrawer();
											}}
										/>
									</ListItem>{" "}
									<ListItem
										button
										onClick={() => {
											navigate("/wishlist");
											toggleDrawer();
										}}>
										<ListItemIcon>
											<FavoriteBorderIcon />
										</ListItemIcon>
										<ListItemText primary={t("Wishlist")} />
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<NotificationsOutlinedIcon />
										</ListItemIcon>
										<ListItemText primary={t("Notifications")} />
									</ListItem>
									<ListItem
										button
										onClick={() => {
											navigate("/cart");
											toggleDrawer();
										}}>
										<ListItemIcon>
											<ShoppingCartOutlinedIcon />
										</ListItemIcon>
										<ListItemText primary={t("Shopping Cart")} />
									</ListItem>
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
													toggleDrawer();
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
													toggleDrawer();
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
									onClick={toggleLanguage}>
									<LanguageIcon sx={{ mr: 1 }} />
									{i18n.language === "en" ? "عربي" : "English"}
								</Button>
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

const outlinedIconStyle = {
	...iconBtnStyle,
	"& .MuiSvgIcon-root": {
		stroke: "currentColor",
		strokeWidth: 1,
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
