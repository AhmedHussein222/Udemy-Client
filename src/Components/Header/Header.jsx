/** @format */

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
	AppBar,
	Avatar,
	Badge,
	Box,
	Button,
	IconButton,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../Firebase/firebase";
import logo from "../../assets/logo-udemy.svg";
import { UserContext } from "../../context/UserContext";
import { CartContext } from "../../context/cart-context";
import { useWishlist } from "../../context/wishlist-context";
import ExploreMenu from "./ExploreMenu";
import MobileDrawer from "./MobileDrawer";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

const Header = () => {
	// UI Control States
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [userMenuAnchor, setUserMenuAnchor] = useState(null);
	const [isMenuHovered, setIsMenuHovered] = useState(false);

	// Hover States
	const [openBusiness, setOpenBusiness] = useState(false);
	const [openTeach, setOpenTeach] = useState(false);

	// Data States
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedSubCategory, setSelectedSubCategory] = useState(null);
	const [subCategories, setSubCategories] = useState([]);
	const [courses, setCourses] = useState([]);

	// Hooks
	const isMobile = useMediaQuery("(max-width:768px)");
	const location = useLocation();
	const navigate = useNavigate();
	const { user, userData } = useContext(UserContext) || {};
	const { cartItems = [] } = useContext(CartContext) || {};
	const { wishlistItems = [] } = useWishlist() || {};
	const { t, i18n } = useTranslation();

	// Menu State Handlers
	const closeAllMenus = () => {
		setIsMenuHovered(false);
		setSelectedCategory(null);
		setSelectedSubCategory(null);
	};

	const handleDrawerToggle = () => {
		setDrawerOpen((prev) => !prev);
		closeAllMenus();
	};

	const handleUserMenuClick = (event) => {
		setUserMenuAnchor(event.currentTarget);
	};

	const handleUserMenuClose = () => {
		setUserMenuAnchor(null);
	};

	// Main navigation handler
	const handleNavigate = (pathOrType, id) => {
		if (id) {
			switch (pathOrType) {
				case "category":
					navigate(`/category/${id}`);
					break;
				case "subcategory":
					navigate(`/subcategory/${id}`);
					break;
				case "course":
					navigate(`/course/${id}`);
					break;
				default:
					break;
			}
		} else {
			navigate(pathOrType);
		}
		closeAllMenus();
		if (drawerOpen) {
			handleDrawerToggle();
		}
	};

	// Authentication Handler
	const handleLogout = async () => {
		try {
			await signOut(auth);
			handleNavigate("/");
		} catch (error) {
			console.error("Error logging out:", error);
		}
	};

	// Language Handler
	const handleLanguageToggle = () => {
		const newLang = i18n.language === "en" ? "ar" : "en";
		i18n.changeLanguage(newLang);
		localStorage.setItem("lang", newLang);
	};

	// Search Handler
	const handleSearch = (e) => {
		e.preventDefault();
		const query = searchQuery.trim();
		if (query) {
			handleNavigate(`/search?q=${encodeURIComponent(query)}`);
			setShowSearch(false);
		}
	};

	// UI Helper Functions
	const renderWishlistIcon = () => {
		const hasItems = wishlistItems?.length > 0;
		return hasItems ? (
			<FavoriteIcon sx={{ color: "#a435f0" }} />
		) : (
			<FavoriteBorderIcon />
		);
	};

	// Data Fetching Effects
	useEffect(() => {
		const fetchAllData = async () => {
			setIsLoading(true);
			try {
				const categoriesSnap = await getDocs(collection(db, "Categories"));
				const categoriesData = categoriesSnap.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setCategories(categoriesData);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchAllData();
	}, [user]);

	useEffect(() => {
		const fetchSubCategories = async () => {
			if (!selectedCategory?.id) {
				setSubCategories([]);
				return;
			}
			try {
				const q = query(
					collection(db, "SubCategories"),
					where("category_id", "==", selectedCategory.id)
				);
				const snapshot = await getDocs(q);
				const data = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setSubCategories(data);
			} catch (error) {
				console.error("Error fetching subcategories:", error);
				setSubCategories([]);
			}
		};
		fetchSubCategories();
	}, [selectedCategory]);

	useEffect(() => {
		const fetchCourses = async () => {
			if (!selectedSubCategory?.id) {
				setCourses([]);
				return;
			}
			try {
				const q = query(
					collection(db, "Courses"),
					where("subcategory_id", "==", selectedSubCategory.id),
					limit(10)
				);
				const snapshot = await getDocs(q);
				const data = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setCourses(data);
			} catch (error) {
				console.error("Error fetching courses:", error);
				setCourses([]);
			}
		};
		fetchCourses();
	}, [selectedSubCategory]);

	useEffect(() => {
		const savedLang = localStorage.getItem("lang");
		if (savedLang) {
			i18n.changeLanguage(savedLang);
		}
	}, [i18n]);

	return (
		<AppBar position="static" sx={{ backgroundColor: "#fff" }} elevation={1}>
			<Box sx={{ px: 2, py: 1 }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					{isMobile ? (
						<>
							<IconButton onClick={handleDrawerToggle}>
								<MenuIcon />
							</IconButton>
							<Box
								sx={{
									position: "absolute",
									left: "50%",
									transform: "translateX(-50%)",
									cursor: "pointer",
								}}
								onClick={() => handleNavigate("/")}>
								<img src={logo} style={{ width: 90 }} alt="logo" />
							</Box>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<IconButton onClick={() => setShowSearch(!showSearch)}>
									<SearchIcon />
								</IconButton>
								<IconButton onClick={() => handleNavigate("/cart")}>
									<Badge badgeContent={cartItems.length} color="error">
										<ShoppingCartOutlinedIcon />
									</Badge>
								</IconButton>
							</Box>
						</>
					) : (
						<>
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
								<Box
									sx={{ cursor: "pointer" }}
									onClick={() => handleNavigate("/")}>
									<img src={logo} style={{ width: 90 }} alt="logo" />
								</Box>
								<ExploreMenu
									categories={categories}
									selectedCategory={selectedCategory}
									setSelectedCategory={setSelectedCategory}
									subCategories={subCategories}
									selectedSubCategory={selectedSubCategory}
									setSelectedSubCategory={setSelectedSubCategory}
									courses={courses}
									isLoading={isLoading}
									isMenuHovered={isMenuHovered}
									setIsMenuHovered={setIsMenuHovered}
									handleNavigate={handleNavigate}
									closeAllMenus={closeAllMenus}
									t={t}
								/>
							</Box>

							<SearchBar
								searchQuery={searchQuery}
								setSearchQuery={setSearchQuery}
								handleSearch={handleSearch}
								t={t}
							/>
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
										onClick={() => handleNavigate("/Welcomehome")}
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
											<Button
												onClick={() => handleNavigate("/Welcomehome")}
												variant="contained"
												sx={teachBtnStyle}>
												{t("Learn more")}
											</Button>
										</Box>
									)}
								</Box>
							) : (
								<Typography
									onClick={() => handleNavigate("/instructor")}
									sx={linkStyle}>
									{t("instructor")}
								</Typography>
							)}
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
								{user ? (
									<>
										<IconButton
											sx={outlinedIconStyle}
											onClick={() => handleNavigate("/wishlist")}>
											<Badge
												badgeContent={wishlistItems?.length || 0}
												color="secondary"
												max={99}
												sx={{
													"& .MuiBadge-badge": {
														backgroundColor: "#d32f2f",
														color: "#fff",
													},
												}}>
												{renderWishlistIcon()}
											</Badge>
										</IconButton>
										<IconButton sx={outlinedIconStyle}>
											<NotificationsOutlinedIcon />
										</IconButton>
										<IconButton
											sx={iconBtnStyle}
											onClick={() => handleNavigate("/cart")}>
											<Badge badgeContent={cartItems.length} color="error">
												<ShoppingCartOutlinedIcon />
											</Badge>
										</IconButton>
										<IconButton onClick={handleUserMenuClick}>
											<Avatar
												src={userData?.profile_picture || user?.photoURL}
												sx={{ width: 32, height: 32, bgcolor: "#8000ff" }}>
												{user.email?.[0].toUpperCase()}
											</Avatar>
										</IconButton>
										<UserMenu
											userMenuAnchor={userMenuAnchor}
											handleUserMenuClose={handleUserMenuClose}
											user={user}
											userData={userData}
											wishlistItems={wishlistItems}
											handleNavigate={handleNavigate}
											handleLogout={handleLogout}
											handleLanguageToggle={handleLanguageToggle}
											t={t}
											i18n={i18n}
										/>
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
									onClick={handleLanguageToggle}>
									<LanguageIcon sx={{ mr: 1 }} />
									{i18n.language === "en" ? "عربي" : "English"}
								</Button>
							</Box>
						</>
					)}
				</Box>
				{isMobile && showSearch && (
					<Box sx={{ mt: 2 }}>
						<SearchBar
							searchQuery={searchQuery}
							setSearchQuery={setSearchQuery}
							handleSearch={handleSearch}
							t={t}
						/>
					</Box>
				)}
				<MobileDrawer
					drawerOpen={drawerOpen}
					handleDrawerToggle={handleDrawerToggle}
					categories={categories}
					selectedCategory={selectedCategory}
					setSelectedCategory={setSelectedCategory}
					subCategories={subCategories}
					user={user}
					userData={userData}
					wishlistItems={wishlistItems}
					handleNavigate={handleNavigate}
					handleLogout={handleLogout}
					handleLanguageToggle={handleLanguageToggle}
					renderWishlistIcon={renderWishlistIcon}
					t={t}
					i18n={i18n}
					location={location}
				/>
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
	color: "#1c1d1f",
	"&:hover": {
		color: "#8000ff",
		backgroundColor: "#e0ccff",
	},
};

const iconBtnStyle = {
	color: "#1c1d1f",
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

export default Header;