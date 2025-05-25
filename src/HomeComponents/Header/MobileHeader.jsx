/** @format */

import React, { useState, useContext } from "react";
import {
	Box,
	IconButton,
	Drawer,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Divider,
	Badge,
	Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SchoolIcon from "@mui/icons-material/School";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../../assets/logo-udemy.svg";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { CartContext } from "../../context/cart-context";
import { useWishlist } from "../../context/wishlist-context";

const MobileHeader = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const navigate = useNavigate();
	const { user } = useContext(UserContext);
	const { cartItems } = useContext(CartContext);
	const { wishlistItems } = useWishlist();

	const toggleDrawer = (open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		setDrawerOpen(open);
	};

	const handleNavigation = (path) => {
		navigate(path);
		setDrawerOpen(false);
	};

	const drawerContent = (
		<Box sx={{ width: 250 }} role="presentation">
			<List>
				{user ? (
					<ListItem>
						<ListItemIcon>
							<Avatar src={user?.photoURL}>
								{user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
							</Avatar>
						</ListItemIcon>
						<ListItemText primary={user.displayName || user.email} />
					</ListItem>
				) : (
					<>
						<ListItem button onClick={() => handleNavigation("/login")}>
							<ListItemIcon>
								<AccountCircleIcon />
							</ListItemIcon>
							<ListItemText primary="Log in" />
						</ListItem>
						<ListItem button onClick={() => handleNavigation("/signup")}>
							<ListItemIcon>
								<AccountCircleIcon />
							</ListItemIcon>
							<ListItemText primary="Sign up" />
						</ListItem>
					</>
				)}
				<Divider />
				<ListItem button onClick={() => handleNavigation("/wishlist")}>
					<ListItemIcon>
						<Badge badgeContent={wishlistItems?.length || 0} color="secondary">
							<FavoriteBorderIcon />
						</Badge>
					</ListItemIcon>
					<ListItemText primary="Wishlist" />
				</ListItem>
				<ListItem button onClick={() => handleNavigation("/cart")}>
					<ListItemIcon>
						<Badge badgeContent={cartItems.length} color="error">
							<ShoppingCartOutlinedIcon />
						</Badge>
					</ListItemIcon>
					<ListItemText primary="Cart" />
				</ListItem>
				<ListItem button>
					<ListItemIcon>
						<BusinessCenterIcon />
					</ListItemIcon>
					<ListItemText primary="Udemy Business" />
				</ListItem>
				<ListItem button>
					<ListItemIcon>
						<SchoolIcon />
					</ListItemIcon>
					<ListItemText primary="Teach on Udemy" />
				</ListItem>
			</List>
		</Box>
	);

	return (
		<Box sx={styles.container}>
			<IconButton onClick={toggleDrawer(true)} sx={styles.menuButton}>
				<MenuIcon />
			</IconButton>
			<img
				src={logo}
				style={styles.logo}
				alt="logo"
				onClick={() => navigate("/")}
			/>
			<Box sx={styles.actions}>
				<IconButton>
					<SearchIcon />
				</IconButton>
				{user && (
					<IconButton>
						<Badge color="error" variant="dot">
							<NotificationsOutlinedIcon />
						</Badge>
					</IconButton>
				)}
			</Box>
			<Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
				{drawerContent}
			</Drawer>
		</Box>
	);
};

const styles = {
	container: {
		display: "flex",
		alignItems: "center",
		width: "100%",
		padding: "8px 16px",
		justifyContent: "space-between",
	},
	menuButton: {
		marginRight: 1,
	},
	logo: {
		width: 80,
		cursor: "pointer",
	},
	actions: {
		display: "flex",
		gap: 1,
	},
};

export default MobileHeader;
