/** @format */

import React, { useEffect, useState, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase.js";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
	Card,
	CardMedia,
	CardContent,
	Typography,
	Container,
	Box,
	IconButton,
	Rating,
	Popover,
	Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { WishlistContext } from "../context/wishlist-context";
import { CartContext } from "../context/cart-context";

const CourseCard = ({ course, isHovered, onHover, onLeave }) => {
	const navigate = useNavigate();
	const { wishlistItems, addToWishlist, removeFromWishlist } =
		useContext(WishlistContext);
	const { cartItems, addToCart } = useContext(CartContext);
	const [anchorEl, setAnchorEl] = useState(null);
	const [isInCart, setIsInCart] = useState(
		cartItems.some((item) => item.id === course.id)
	);

	useEffect(() => {
		setIsInCart(cartItems.some((item) => item.id === course.id));
	}, [cartItems, course.id]);

	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const handleWishlistToggle = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const isInWishlist = wishlistItems.some((item) => item.id === course.id);
		if (isInWishlist) {
			removeFromWishlist(course.id);
		} else {
			addToWishlist(course);
		}
	};
	const handleAddToCart = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		const courseInCart = cartItems.some((item) => item.id === course.id);
		if (!courseInCart) {
			const courseToAdd = {
				id: course.id,
				title: course.title,
				price: Number(course.price) || 0,
				thumbnail: course.thumbnail,
				instructor_name: course.instructor_name || "Unknown Instructor",
				description: course.description || "",
				rating: course.rating || { rate: 0, count: 0 },
				lectures: course.lectures || 0,
				addedAt: new Date().toISOString(),
			};
			await addToCart(courseToAdd);
			setIsInCart(true);
		}
	};

	const open = Boolean(anchorEl);

	return (
		<Box
			onMouseEnter={(e) => {
				onHover();
				handlePopoverOpen(e);
			}}
			onMouseLeave={() => {
				onLeave();
				handlePopoverClose();
			}}
			sx={{ position: "relative" }}>
			<Card
				sx={{
					width: 320,
					height: "100%",
					display: "flex",
					flexDirection: "column",
					position: "relative",
					transition: "all 0.3s ease",
					"&:hover": {
						transform: "translateY(-4px)",
						boxShadow: 3,
					},
				}}
				onClick={() => navigate(`/course-details/${course.id}`)}>
				<CardMedia
					component="img"
					height="180"
					image={course.thumbnail}
					alt={course.title}
					sx={{
						objectFit: "cover",
					}}
				/>
				<CardContent
					sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
					<Typography
						gutterBottom
						variant="h6"
						sx={{
							fontSize: "1.1rem",
							fontWeight: "bold",
							lineHeight: 1.2,
							mb: 1,
							height: "2.4em",
							overflow: "hidden",
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
						}}>
						{course.title}
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							mb: 1,
							height: "3em",
							overflow: "hidden",
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
						}}>
						{course.description}
					</Typography>
					<Box sx={{ mt: "auto" }}>
						<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
							<Rating
								value={course.rating?.rate || 0}
								readOnly
								size="small"
								precision={0.5}
								sx={{
									color: "#b4690e",
									mr: 1,
								}}
							/>
							<Typography variant="body2" color="text.secondary">
								({course.rating?.count || 0})
							</Typography>
						</Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<Typography
								variant="h6"
								sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
								{course.price === 0 ? "Free" : `${course.price} EGP`}
							</Typography>
							{course.original_price &&
								course.original_price > course.price && (
									<Typography
										variant="body2"
										sx={{
											textDecoration: "line-through",
											color: "text.secondary",
											ml: 1,
										}}>
										{course.original_price} EGP
									</Typography>
								)}
						</Box>
					</Box>
				</CardContent>
			</Card>

			<Popover
				open={open && isHovered}
				anchorEl={anchorEl}
				onClose={handlePopoverClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
				sx={{
					pointerEvents: "none",
					"& .MuiPopover-paper": {
						width: 320,
						p: 2,
						mt: 1,
						pointerEvents: "auto",
						boxShadow: 3,
						position: "relative",
						overflow: "visible",
						"&::before": {
							content: '""',
							position: "absolute",
							top: "-15px",
							left: "50%",
							marginLeft: "-8px",
							width: "16px",
							height: "15px",
							backgroundColor: "white",
							clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
							filter: "drop-shadow(0 -2px 2px rgba(0,0,0,0.1))",
							zIndex: 1,
						},
					},
				}}
				disableRestoreFocus>
				<Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
					{course.title}
				</Typography>
				<Typography variant="body2" sx={{ mb: 2 }}>
					{course.description}
				</Typography>
				<Box sx={{ display: "flex", gap: 1 }}>
					{" "}
					<Button
						variant="contained"
						startIcon={<AddShoppingCartIcon />}
						onClick={handleAddToCart}
						sx={{
							bgcolor: isInCart ? "white" : "#a435f0",
							color: isInCart ? "#6a1b9a" : "white",
							border: isInCart ? "1px solid #6a1b9a" : "none",
							"&:hover": {
								bgcolor: isInCart ? "#f7f1fa" : "#8710d8",
								border: isInCart ? "1px solid #6a1b9a" : "none",
							},
							flex: 1,
							"&.MuiButton-root": {
								textTransform: "none",
								fontWeight: "bold",
							},
						}}>
						{isInCart ? "In cart" : "Add to cart"}
					</Button>
					<IconButton
						onClick={handleWishlistToggle}
						sx={{
							border: "1px solid #e0e0e0",
							borderRadius: 1,
							color: wishlistItems.some((item) => item.id === course.id)
								? "#a435f0"
								: "inherit",
						}}>
						{wishlistItems.some((item) => item.id === course.id) ? (
							<FavoriteIcon />
						) : (
							<FavoriteBorderIcon />
						)}
					</IconButton>
				</Box>
			</Popover>
		</Box>
	);
};

const CoursesSection = () => {
	const navigate = useNavigate();
	const [courses, setCourses] = useState([]);
	const [subCategories, setSubCategories] = useState([]);
	const [hoveredCourse, setHoveredCourse] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const coursesSnapshot = await getDocs(collection(db, "Courses"));
			const coursesData = coursesSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			const subSnapshot = await getDocs(collection(db, "SubCategories"));
			const subData = subSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setCourses(coursesData);
			setSubCategories(subData);
		};

		fetchData();
	}, []);

	return (
		<Container sx={{ py: 5 }}>
			<Typography
				variant="h4"
				fontWeight="bold"
				fontFamily="initial"
				color="#0d1b2a"
				sx={{ mb: 4 }}>
				What to learn next
			</Typography>
			{subCategories.map((sub, index) => {
				const filteredCourses = courses.filter(
					(course) => course.subcategory_id === sub.subcategory_id
				);

				return filteredCourses.length > 0 ? (
					<Box key={index} sx={{ mb: 5 }}>
						<Typography
							variant="h5"
							fontWeight="bold"
							sx={{ mb: 3, display: "flex", alignItems: "center" }}>
							<span>Featured courses in </span>
							<Box
								component="span"
								sx={{
									color: "purple",
									textDecoration: "underline",
									cursor: "pointer",
									ml: 1,
									"&:hover": {
										color: "#6a1b9a",
									},
								}}
								onClick={() => navigate(`/subcategory/${sub.subcategory_id}`)}>
								{sub.name}
							</Box>
						</Typography>

						<Box sx={{ position: "relative" }}>
							<IconButton
								onClick={() => {
									document.getElementById(`scroll-box-${index}`).scrollBy({
										left: -300,
										behavior: "smooth",
									});
								}}
								sx={{
									position: "absolute",
									left: 0,
									top: "50%",
									transform: "translateY(-50%)",
									zIndex: 2,
									bgcolor: "white",
									boxShadow: 2,
									"&:hover": {
										bgcolor: "#f5f5f5",
									},
								}}>
								<ArrowBackIosIcon />
							</IconButton>

							<Box
								id={`scroll-box-${index}`}
								sx={{
									display: "flex",
									gap: 2,
									overflowX: "auto",
									scrollBehavior: "smooth",
									pb: 2,
									px: 4,
									msOverflowStyle: "none",
									scrollbarWidth: "none",
									"&::-webkit-scrollbar": {
										display: "none",
									},
								}}>
								{filteredCourses.map((course) => (
									<CourseCard
										key={course.id}
										course={course}
										isHovered={hoveredCourse === course.id}
										onHover={() => setHoveredCourse(course.id)}
										onLeave={() => setHoveredCourse(null)}
									/>
								))}
							</Box>

							<IconButton
								onClick={() => {
									document.getElementById(`scroll-box-${index}`).scrollBy({
										left: 300,
										behavior: "smooth",
									});
								}}
								sx={{
									position: "absolute",
									right: 0,
									top: "50%",
									transform: "translateY(-50%)",
									zIndex: 2,
									bgcolor: "white",
									boxShadow: 2,
									"&:hover": {
										bgcolor: "#f5f5f5",
									},
								}}>
								<ArrowForwardIosIcon />
							</IconButton>
						</Box>
					</Box>
				) : null;
			})}
		</Container>
	);
};

export default CoursesSection;
