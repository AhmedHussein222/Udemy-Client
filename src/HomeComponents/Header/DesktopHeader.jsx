/** @format */

import React, { useState, useContext } from "react";
import {
	Typography,
	Button,
	IconButton,
	Box,
	InputBase,
	Paper,
	Badge,
	Avatar,
	Menu,
	MenuItem,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NavigationMenu from "./NavigationMenu";
import logo from "../../assets/logo-udemy.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { CartContext } from "../../context/cart-context";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { useWishlist } from "../../context/wishlist-context";

const styles = {
	linkStyle: {
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
	},
	loginBtnStyle: {
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
	},
	signupBtnStyle: {
		backgroundColor: "#8000ff",
		color: "#fff",
		textTransform: "none",
		fontWeight: "bold",
		borderRadius: "4px",
		py: 1,
		"&:hover": {
			backgroundColor: "#6a1b9a",
		},
	},
	langBtnStyle: {
		color: "rgb(37, 36, 36)",
		borderColor: "#8000ff",
		textTransform: "none",
		borderRadius: "4px",
		py: 1,
		"&:hover": {
			backgroundColor: "#e0ccff",
			borderColor: "#8000ff",
		},
	},
	popoverStyle: {
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
	},
	searchBarStyle: {
		p: "0px 0px",
		display: "flex",
		alignItems: "left",
		borderRadius: 999,
		border: "1px solid gray",
		"&:focus-within": {
			borderColor: "#8000ff",
		},
	},
	searchBtnStyle: {
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
	},
};

const DesktopHeader = () => {
	const [openBusiness, setOpenBusiness] = useState(false);
	const [openTeach, setOpenTeach] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useContext(UserContext);
	const { cartItems } = useContext(CartContext);
	const { wishlistItems } = useWishlist();

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
			navigate("/");
		} catch (error) {
			console.error("Logout error:", error);
		}
		handleClose();
	};

	const renderWishlistIcon = () => {
		const hasWishlistItems = wishlistItems && wishlistItems.length > 0;
		return hasWishlistItems ? (
			<FavoriteIcon sx={{ color: "#a435f0" }} />
		) : (
			<FavoriteBorderIcon />
		);
	};

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
			<img
				src={logo}
				style={{ width: 90 }}
				alt="logo"
				onClick={() => navigate("/")}
			/>
			<NavigationMenu />
			<Paper
				component="form"
				onSubmit={(e) => e.preventDefault()}
				sx={{ ...styles.searchBarStyle, flexGrow: 1, maxWidth: 600 }}>
				<IconButton type="submit" sx={styles.searchBtnStyle}>
					<SearchIcon sx={{ color: "gray" }} />
				</IconButton>
				<InputBase
					sx={{ flex: 1, fontSize: "16px" }}
					placeholder="Search for anything"
				/>
			</Paper>

			<Box
				onMouseEnter={() => setOpenBusiness(true)}
				onMouseLeave={() => setOpenBusiness(false)}
				sx={{ position: "relative" }}>
				<Typography sx={styles.linkStyle}>Udemy Business</Typography>
				{openBusiness && (
					<Box sx={styles.popoverStyle}>
						<Typography
							variant="h6"
							fontWeight="bold"
							sx={{ color: "#001a33" }}>
							Get your team access to over 27,000 top Udemy courses, anytime,
							anywhere.
						</Typography>
						<Button
							variant="contained"
							size="small"
							sx={{
								backgroundColor: "#8000ff",
								fontWeight: "bold",
								width: "100%",
							}}>
							Try Udemy Business
						</Button>
					</Box>
				)}
			</Box>

			<Box
				onMouseEnter={() => setOpenTeach(true)}
				onMouseLeave={() => setOpenTeach(false)}
				sx={{ position: "relative" }}>
				<Typography sx={styles.linkStyle}>Teach on Udemy</Typography>
				{openTeach && (
					<Box sx={styles.popoverStyle}>
						<Typography
							variant="h6"
							fontWeight="bold"
							sx={{ color: "#001a33" }}>
							Turn what you know into an opportunity and reach millions around
							the world.
						</Typography>
						<Button
							variant="contained"
							sx={{
								backgroundColor: "#8000ff",
								fontWeight: "bold",
								width: "100%",
							}}>
							Learn more
						</Button>
					</Box>
				)}
			</Box>

			{user ? (
				<>
					<IconButton
						onClick={() => navigate("/wishlist")}
						sx={{ color: "inherit" }}>
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
					</IconButton>
					<IconButton>
						<Badge color="error" variant="dot">
							<NotificationsOutlinedIcon />
						</Badge>
					</IconButton>
					<IconButton onClick={() => navigate("/cart")}>
						<Badge badgeContent={cartItems.length} color="error">
							<ShoppingCartOutlinedIcon />
						</Badge>
					</IconButton>
					<IconButton onClick={handleMenu}>
						<Avatar src={user?.photoURL} sx={{ width: 32, height: 32 }}>
							{user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
						</Avatar>
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleClose}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "right",
						}}
						transformOrigin={{
							vertical: "top",
							horizontal: "right",
						}}>
						<MenuItem
							onClick={() => {
								handleClose();
								navigate("/Userprofile");
							}}>
							Profile
						</MenuItem>
						<MenuItem onClick={handleLogout}>Logout</MenuItem>
					</Menu>
				</>
			) : (
				location.pathname !== "/login" &&
				location.pathname !== "/signup" && (
					<>
						<IconButton onClick={() => navigate("/cart")}>
							<Badge badgeContent={cartItems.length} color="error">
								<ShoppingCartOutlinedIcon />
							</Badge>
						</IconButton>
						<Button
							variant="outlined"
							sx={styles.loginBtnStyle}
							onClick={() => navigate("/login")}>
							Log in
						</Button>
						<Button
							variant="contained"
							sx={styles.signupBtnStyle}
							onClick={() => navigate("/signup")}>
							Sign up
						</Button>
					</>
				)
			)}
			<Button variant="outlined" sx={styles.langBtnStyle}>
				<LanguageIcon />
			</Button>
		</Box>
	);
};

export default DesktopHeader;
