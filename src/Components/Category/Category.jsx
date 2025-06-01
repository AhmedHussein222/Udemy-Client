/** @format */
import React, { useState, useEffect, useContext } from "react";
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Typography,
	Grid,
	Stack,
	Button,
	Rating,
	Chip,
	CircularProgress,
	IconButton,
} from "@mui/material";
import { purple, grey } from "@mui/material/colors";
import { db, collection, getDocs, doc, getDoc } from "../../Firebase/firebase";
import { useWishlist } from "../../context/wishlist-context";
import { CartContext } from "../../context/cart-context";
import { UserContext } from "../../context/UserContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function Category() {
	const categories = [
		"Development",
		"Business",
		"IT & Software",
		"Design",
		"Marketing",
	]; // Add your categories here
	const [courses, setCourses] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("Development");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
	const { user } = useContext(UserContext);
	const { cartItems, addToCart } = useContext(CartContext);

	const handleCategoryChange = (category) => {
		setSelectedCategory(category);
	};

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				setLoading(true);
				const coursesCollection = collection(db, "courses");
				const coursesSnapshot = await getDocs(coursesCollection);
				const coursesData = coursesSnapshot.docs
					.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}))
					.filter((course) => course.category === selectedCategory);

				setCourses(coursesData);
				setError(null);
			} catch (err) {
				console.error("Error fetching courses:", err);
				setError("Failed to load courses. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchCourses();
	}, [selectedCategory]);

	useEffect(() => {
		const fetchEnrolledCourses = async () => {
			if (!user) return;
			try {
				const userDoc = doc(db, "users", user.uid);
				const userSnapshot = await getDoc(userDoc);
				if (userSnapshot.exists()) {
					const userData = userSnapshot.data();
					setEnrolledCourses(userData.enrolledCourses || []);
				}
			} catch (err) {
				console.error("Error fetching enrolled courses:", err);
			}
		};

		fetchEnrolledCourses();
	}, [user]);

	useEffect(() => {
		const checkEnrollmentStatus = async () => {
			if (!user?.uid) {
				setEnrolledCourses([]);
				return;
			}
			try {
				const enrollmentsRef = doc(db, "Enrollments", user.uid);
				const enrollmentsDoc = await getDoc(enrollmentsRef);
				if (enrollmentsDoc.exists()) {
					const enrollments = enrollmentsDoc.data().courses || [];
					setEnrolledCourses(enrollments.map((c) => c.id));
				}
			} catch (error) {
				console.error("Error checking enrollment status:", error);
			}
		};
		checkEnrollmentStatus();
	}, [user]);

	const renderCourseButton = (course) => {
		const isEnrolled = enrolledCourses.includes(course.id);
		const isInCart = cartItems.some((item) => item.id === course.id);
		const isFree = typeof course.price === "number" ? course.price === 0 : true;

		return (
			<Button
				variant="contained"
				fullWidth
				startIcon={isEnrolled ? <CheckCircleIcon /> : <AddShoppingCartIcon />}
				onClick={(e) => {
					e.stopPropagation();
					if (!isEnrolled && !isInCart) {
						if (isFree) {
							console.log("Free course enrollment");
						} else {
							// Ensure price is a number when adding to cart
							addToCart({
								...course,
								price: typeof course.price === "number" ? course.price : 0,
							});
						}
					}
				}}
				disabled={isEnrolled}
				sx={{
					bgcolor: isEnrolled
						? "#4caf50"
						: isInCart
						? "#e0e0e0"
						: isFree
						? "#4caf50"
						: "#a435f0",
					color: isInCart ? "#6a1b9a" : "white",
					"&:hover": {
						bgcolor: isEnrolled
							? "#45a049"
							: isInCart
							? "#d5d5d5"
							: isFree
							? "#45a049"
							: "#8710d8",
						transform: "translateY(-1px)",
						boxShadow: 2,
					},
					transition: "all 0.2s ease-in-out",
					textTransform: "none",
					fontWeight: "bold",
					fontSize: "0.9rem",
					py: 1,
					borderRadius: "4px",
				}}>
				{isEnrolled
					? "Enrolled"
					: isInCart
					? "In Cart"
					: isFree
					? "Enroll Free"
					: "Add to Cart"}
			</Button>
		);
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
				<CircularProgress sx={{ color: "#8000ff" }} />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography color="error" variant="h6">
					{error}
				</Typography>
			</Box>
		);
	}
	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
				{selectedCategory} Courses
			</Typography>

			<Stack
				direction="row"
				spacing={2}
				sx={{ mb: 3, flexWrap: "wrap", gap: 1 }}>
				{categories.map((category) => (
					<Button
						key={category}
						variant={selectedCategory === category ? "contained" : "outlined"}
						onClick={() => handleCategoryChange(category)}
						sx={{
							bgcolor:
								selectedCategory === category ? "#8000ff" : "transparent",
							color: selectedCategory === category ? "white" : "#8000ff",
							borderColor: "#8000ff",
							"&:hover": {
								bgcolor:
									selectedCategory === category
										? "#6a1b9a"
										: "rgba(128, 0, 255, 0.1)",
								borderColor: "#8000ff",
							},
							mb: 1,
						}}>
						{category}
					</Button>
				))}
			</Stack>

			{courses.length === 0 ? (
				<Typography variant="h6" sx={{ textAlign: "center", color: grey[600] }}>
					No courses found in this category.
				</Typography>
			) : (
				<Grid container spacing={3}>
					{courses.map((course) => (
						<Grid item xs={12} sm={6} md={4} key={course.id}>
							<Card
								sx={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
									position: "relative",
									transition: "all 0.2s ease-in-out",
									"&:hover": {
										transform: "translateY(-4px)",
										boxShadow: 3,
									},
								}}>
								<IconButton
									sx={{
										position: "absolute",
										top: 8,
										right: 8,
										backgroundColor: "rgba(255, 255, 255, 0.9)",
										"&:hover": {
											backgroundColor: "rgba(255, 255, 255, 1)",
											transform: "scale(1.1)",
										},
										transition: "all 0.2s ease-in-out",
										color: wishlistItems.some((item) => item.id === course.id)
											? "#a435f0"
											: grey[600],
										zIndex: 1,
									}}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										const isInWishlist = wishlistItems.some(
											(item) => item.id === course.id
										);
										if (isInWishlist) {
											removeFromWishlist(course.id);
										} else {
											addToWishlist(course);
										}
									}}>
									{wishlistItems.some((item) => item.id === course.id) ? (
										<FavoriteIcon />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<CardMedia
									component="img"
									height="140"
									image={course.image}
									alt={course.title}
								/>
								<CardContent>
									<Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
										{course.title}
									</Typography>

									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mb: 1 }}>
										{course.instructor}
									</Typography>

									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
										sx={{ mb: 1 }}>
										<Typography variant="body2" fontWeight="bold">
											{course.rating}
										</Typography>
										<Rating
											value={course.rating}
											precision={0.5}
											size="small"
											readOnly
										/>
										<Typography variant="body2" color="text.secondary">
											({course.studentsCount.toLocaleString()} students)
										</Typography>
									</Stack>

									<Stack direction="row" spacing={1} sx={{ mb: 1 }}>
										<Typography variant="body2" color="text.secondary">
											{course.hours} total hours
										</Typography>
										<Typography variant="body2" color="text.secondary">
											• {course.lectures} lectures
										</Typography>
										<Typography variant="body2" color="text.secondary">
											• {course.level}
										</Typography>
									</Stack>

									{course.isBestSeller && (
										<Chip
											label="Bestseller"
											size="small"
											sx={{
												bgcolor: purple[100],
												color: purple[900],
												mb: 1,
											}}
										/>
									)}

									<Stack direction="row" alignItems="center" spacing={1}>
										<Typography variant="h6" fontWeight="bold">
											$
											{typeof course.price === "number"
												? course.price.toFixed(2)
												: "0.00"}
										</Typography>
										<Typography
											variant="body2"
											sx={{
												textDecoration: "line-through",
												color: grey[600],
											}}>
											$
											{typeof course.originalPrice === "number"
												? course.originalPrice.toFixed(2)
												: "0.00"}
										</Typography>
									</Stack>
								</CardContent>

								<Box sx={{ p: 2, mt: "auto" }}>
									{renderCourseButton(course)}
								</Box>
							</Card>
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	);
}

export default Category;
