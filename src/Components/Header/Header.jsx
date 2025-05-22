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
		ListItemButton,
		useMediaQuery,
		Menu,
		MenuItem,
		Avatar,
		Badge,
		Divider,
		CircularProgress,
	} from "@mui/material";
	import { useLocation, useNavigate } from "react-router-dom";
	import MenuIcon from "@mui/icons-material/Menu";
	import SearchIcon from "@mui/icons-material/Search";
	import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
	import FavoriteIcon from "@mui/icons-material/Favorite";
	import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
	import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
	import LanguageIcon from "@mui/icons-material/Language";
	import ChevronRightIcon from "@mui/icons-material/ChevronRight";
	import { useTranslation } from "react-i18next";
	import { UserContext } from "../../context/UserContext";
	import { CartContext } from "../../context/cart-context";
	import { useWishlist } from "../../context/wishlist-context";
	import {
		collection,
		getDocs,
		doc,
		getDoc,
		query,
		where,
		limit,
	} from "firebase/firestore";
	import { db, auth } from "../../Firebase/firebase";
	import { signOut } from "firebase/auth";
	import logo from "../../assets/logo-udemy.svg";

	const Header = () => {
		// UI Control States
		const [drawerOpen, setDrawerOpen] = useState(false);
		const [showSearch, setShowSearch] = useState(false);
		const [searchQuery, setSearchQuery] = useState("");
		const [isLoading, setIsLoading] = useState(true);
		const [userMenuAnchor, setUserMenuAnchor] = useState(null);
		const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
		const [subCategoryMenuAnchor, setSubCategoryMenuAnchor] = useState(null);
		const [courseMenuAnchor, setCourseMenuAnchor] = useState(null);
		const [isMenuHovered, setIsMenuHovered] = useState(false);

		// Hover States
		const [openBusiness, setOpenBusiness] = useState(false);
		const [openTeach, setOpenTeach] = useState(false);

		// Data States
		const [userData, setUserData] = useState(null);
		const [categories, setCategories] = useState([]);
		const [selectedCategory, setSelectedCategory] = useState(null);
		const [selectedSubCategory, setSelectedSubCategory] = useState(null);
		const [subCategories, setSubCategories] = useState([]);
		const [courses, setCourses] = useState([]);

		// Hooks
		const isMobile = useMediaQuery("(max-width:768px)");
		const location = useLocation();
		const navigate = useNavigate();
		const { user } = useContext(UserContext) || {};
		const { cartItems = [] } = useContext(CartContext) || {};
		const { wishlistItems = [] } = useWishlist() || {};
		const { t, i18n } = useTranslation();

		// Menu State Handlers
		const closeAllMenus = () => {
			setCategoryMenuAnchor(null);
			setSubCategoryMenuAnchor(null);
			setCourseMenuAnchor(null);
			setSelectedCategory(null);
			setSelectedSubCategory(null);
			setIsMenuHovered(false);
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

		const handleCategoryClick = (event) => {
			event.preventDefault();
			setCategoryMenuAnchor(event.currentTarget);
			setIsMenuHovered(true);
		};

		const handleCategoryMouseEnter = (category, event) => {
			setSelectedCategory(category);
			setSubCategoryMenuAnchor(event.currentTarget);
			setCourseMenuAnchor(null); // Reset course menu to avoid conflicts
			setSelectedSubCategory(null); // Reset selected subcategory
			setIsMenuHovered(true);
		};

		const handleSubCategoryMouseEnter = (subCategory, event) => {
			setSelectedSubCategory(subCategory);
			setCourseMenuAnchor(event.currentTarget);
			setIsMenuHovered(true);
		};

		const handleMenuMouseEnter = () => {
			setIsMenuHovered(true);
		};

		const handleMenuMouseLeave = () => {
			setIsMenuHovered(false);
			closeAllMenus();
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
					const [userSnap, categoriesSnap] = await Promise.all([
						user ? getDoc(doc(db, "Users", user.uid)) : Promise.resolve(null),
						getDocs(collection(db, "Categories")),
					]);

					if (userSnap?.exists()) {
						setUserData(userSnap.data());
					}
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
									<Box
										sx={{ position: "relative" }}
										onMouseEnter={handleMenuMouseEnter}
										onMouseLeave={handleMenuMouseLeave}>
										<Typography onClick={handleCategoryClick} sx={linkStyle}>
											{t("Categories")}
										</Typography>
										<Box
											sx={{
												display: "flex",
												position: "absolute",
												top: "100%",
												left: 0,
												zIndex: 1300,
											}}>
											<Menu
												anchorEl={categoryMenuAnchor}
												open={Boolean(categoryMenuAnchor) && isMenuHovered}
												onClose={closeAllMenus}
												anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
												transformOrigin={{ vertical: "top", horizontal: "left" }}
												PaperProps={menuPaperProps}>
												{isLoading ? (
													<Box
														sx={{
															display: "flex",
															justifyContent: "center",
															p: 2,
														}}>
														<CircularProgress size={24} />
													</Box>
												) : categories.length > 0 ? (
													categories.map((category) => (
														<MenuItem
															key={category.id}
															onMouseEnter={(e) =>
																handleCategoryMouseEnter(category, e)
															}
															onClick={() =>
																handleNavigate("category", category.id)
															}
															selected={selectedCategory?.id === category.id}
															sx={{
																display: "flex",
																justifyContent: "space-between",
																alignItems: "center",
															}}>
															<Typography variant="body1">
																{category.name}
															</Typography>
															<ChevronRightIcon
																sx={{ ml: 1, color: "#6a6f73" }}
															/>
														</MenuItem>
													))
												) : (
													<MenuItem disabled>
														<Typography variant="body1">
															{t("No categories available")}
														</Typography>
													</MenuItem>
												)}
											</Menu>
											<Menu
												anchorEl={subCategoryMenuAnchor}
												open={Boolean(subCategoryMenuAnchor) && isMenuHovered}
												onClose={closeAllMenus}
												anchorOrigin={{ vertical: "top", horizontal: "right" }}
												transformOrigin={{ vertical: "top", horizontal: "left" }}
												PaperProps={nestedMenuProps}>
												{isLoading ? (
													<Box
														sx={{
															display: "flex",
															justifyContent: "center",
															p: 2,
														}}>
														<CircularProgress size={24} />
													</Box>
												) : subCategories.length > 0 ? (
													subCategories.map((subCategory) => (
														<MenuItem
															key={subCategory.id}
															onMouseEnter={(e) =>
																handleSubCategoryMouseEnter(subCategory, e)
															}
															onClick={() =>
																handleNavigate("subcategory", subCategory.id)
															}
															selected={
																selectedSubCategory?.id === subCategory.id
															}
															sx={{
																display: "flex",
																justifyContent: "space-between",
																alignItems: "center",
															}}>
															<Typography variant="body1">
																{subCategory.name}
															</Typography>
															<ChevronRightIcon
																sx={{ ml: 1, color: "#6a6f73" }}
															/>
														</MenuItem>
													))
												) : (
													<MenuItem disabled>
														<Typography variant="body1">
															{t("No subcategories available")}
														</Typography>
													</MenuItem>
												)}
											</Menu>
											<Menu
												anchorEl={courseMenuAnchor}
												open={Boolean(courseMenuAnchor) && isMenuHovered}
												onClose={closeAllMenus}
												anchorOrigin={{ vertical: "top", horizontal: "right" }}
												transformOrigin={{ vertical: "top", horizontal: "left" }}
												PaperProps={courseMenuProps}>
												{isLoading ? (
													<Box
														sx={{
															display: "flex",
															justifyContent: "center",
															p: 2,
														}}>
														<CircularProgress size={24} />
													</Box>
												) : courses.length > 0 ? (
													courses.map((course) => (
														<MenuItem
															key={course.id}
															onClick={() => handleNavigate("course", course.id)}
															sx={{
																display: "flex",
																flexDirection: "column",
																alignItems: "flex-start",
																gap: 0.5,
															}}>
															<Typography variant="subtitle1" noWrap>
																{course.title}
															</Typography>
															<Box
																sx={{
																	display: "flex",
																	alignItems: "center",
																	gap: 1,
																	width: "100%",
																}}>
																<Typography
																	variant="caption"
																	color="text.secondary"
																	sx={{ flex: 1 }}>
																	{course.instructor_name}
																</Typography>
																<Typography
																	variant="caption"
																	color="text.secondary">
																	{course.price} {t("EGP")}
																</Typography>
															</Box>
														</MenuItem>
													))
												) : (
													<MenuItem disabled>
														<Typography variant="body1">
															{t("No courses available")}
														</Typography>
													</MenuItem>
												)}
											</Menu>
										</Box>
									</Box>
								</Box>
								<Paper
									component="form"
									onSubmit={handleSearch}
									sx={{ ...searchBarStyle, flexGrow: 1, maxWidth: 600 }}>
									<IconButton type="submit" sx={searchBtnStyle}>
										<SearchIcon sx={{ color: "gray" }} />
									</IconButton>
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
													src={userData?.profile_picture}
													sx={{ width: 32, height: 32, bgcolor: "#8000ff" }}>
													{user.email?.[0].toUpperCase()}
												</Avatar>
											</IconButton>
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
														minWidth: 300,
														maxHeight: "calc(100vh - 64px)",
														"& .MuiMenu-list": {
															padding: 0,
															maxHeight: "calc(100vh - 64px)",
															overflowY: "auto",
															overflowX: "hidden",
															"&::-webkit-scrollbar": { width: "6px" },
															"&::-webkit-scrollbar-track": {
																background: "transparent",
															},
															"&::-webkit-scrollbar-thumb": {
																background: "#8000ff20",
																borderRadius: "3px",
																"&:hover": { background: "#8000ff40" },
															},
														},
														"& .MuiMenuItem-root": {
															px: 2,
															py: 1.5,
															"&:hover": {
																backgroundColor: "#e0ccff",
																color: "#8000ff",
																"& .MuiTypography-root": { color: "#8000ff" },
																"& .MuiSvgIcon-root": { color: "#8000ff" },
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
															"& .MuiTypography-root": { color: "#8000ff" },
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
					)}
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
				</Box>
			</AppBar>
		);
	};

	// Styles
	const menuPaperProps = {
		elevation: 3,
		sx: {
			mt: 1,
			backgroundColor: "#fff",
			fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
			"& .MuiList-root": {
				py: 0,
			},
			"& .MuiMenuItem-root": {
				py: 1.5,
				px: 2,
				color: "#1c1d1f",
				transition: "background-color 0.2s ease",
				"&:hover, &.Mui-selected, &.Mui-selected:hover": {
					backgroundColor: "#ede5f9",
					color: "#6e29d2",
					"& .MuiTypography-root": {
						color: "#6e29d2",
					},
					"& .MuiSvgIcon-root": {
						color: "#6e29d2",
					},
				},
				"&.active": {
					backgroundColor: "#ede5f9",
					color: "#6e29d2",
				},
			},
		},
	};

	const nestedMenuProps = {
		...menuPaperProps,
		sx: {
			...menuPaperProps.sx,
			ml: 0.5,
			"& .MuiMenuItem-root": {
				...menuPaperProps.sx["& .MuiMenuItem-root"],
				minWidth: 200,
			},
		},
	};

	const courseMenuProps = {
		...menuPaperProps,
		sx: {
			...menuPaperProps.sx,
			ml: 0.5,
			width: 300,
			maxHeight: 400,
			overflow: "auto",
			"& .MuiMenuItem-root": {
				...menuPaperProps.sx["& .MuiMenuItem-root"],
				flexDirection: "column",
				alignItems: "flex-start",
				gap: 0.5,
			},
		},
	};

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
		leftFluent: 0,
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
