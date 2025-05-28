/** @format */

import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import {
	Box,
	Typography,
	Grid,
	CircularProgress,
	Container,
	Button,
	Card,
	CardContent,
	CardMedia,
	Rating,
	Avatar,
	Stack,
	IconButton,
} from "@mui/material";
import { CartContext } from "../../context/cart-context";
import { WishlistContext } from "../../context/wishlist-context";
import { useTranslation } from "react-i18next";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const SearchResults = () => {
	const [searchResults, setSearchResults] = useState({
		courses: [],
		instructors: [],
	});
	const [loading, setLoading] = useState(true);
	const location = useLocation();
	const navigate = useNavigate();
	const searchQuery = new URLSearchParams(location.search).get("q");
	const { t } = useTranslation();
	const { addToCart, cartItems } = useContext(CartContext);
	const { addToWishlist, removeFromWishlist, wishlistItems } =
		useContext(WishlistContext);

	const handleAddToCart = async (e, course) => {
		e.preventDefault();
		e.stopPropagation();

		if (!course || !course.id || !course.title) {
			return;
		}

		try {
			// Fetch lessons to calculate total duration and count
			const lessonsQuery = query(
				collection(db, "Lessons"),
				where("course_id", "==", course.id.toString())
			);
			const lessonsSnap = await getDocs(lessonsQuery);
			const lessons = lessonsSnap.docs.map((doc) => ({
				...doc.data(),
			}));

			// Calculate total duration and lectures count
			const totalMins = lessons.reduce((sum, lesson) => {
				if (lesson.video_url) {
					return sum + (Number(lesson.duration) || 0);
				}
				return sum;
			}, 0);
			const courseToAdd = {
				id: course.id,
				course_id: course.id, // Match CartProvider structure
				title: course.title || "",
				price: parseFloat(course.price || 0),
				thumbnail: course.thumbnail || "",
				instructor_name: course.instructor_name || "Unknown Instructor",
				description: course.description || "",
				rating: course.rating || { rate: 0, count: 0 },
				totalHours: Math.floor(totalMins / 60),
				lectures: lessons.length,
				addedAt: new Date().toISOString(),
				badge: course.badge || "",
				discount: parseFloat(course.discount || 0),
			};

			const success = await addToCart(courseToAdd);
			if (!success) {
				// Assuming warningModal is imported and configured
				// import { warningModal } from "../../services/swal";
				// warningModal(t("Course is already in your cart!"));
				console.log("Course is already in cart");
			}
		} catch (error) {
			console.error("Error adding to cart:", error);
		}
	};

	const calculateSimilarity = (str1, str2) => {
		const track = Array(str2.length + 1)
			.fill(null)
			.map(() => Array(str1.length + 1).fill(null));
		for (let i = 0; i <= str1.length; i += 1) {
			track[0][i] = i;
		}
		for (let j = 0; j <= str2.length; j += 1) {
			track[j][0] = j;
		}
		for (let j = 1; j <= str2.length; j += 1) {
			for (let i = 1; i <= str1.length; i += 1) {
				const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
				track[j][i] = Math.min(
					track[j][i - 1] + 1,
					track[j - 1][i] + 1,
					track[j - 1][i - 1] + indicator
				);
			}
		}
		return (
			1 - track[str2.length][str1.length] / Math.max(str1.length, str2.length)
		);
	};

	useEffect(() => {
		const fetchSearchResults = async () => {
			setLoading(true);
			try {
				const coursesSnapshot = await getDocs(collection(db, "Courses"));
				const allCourses = coursesSnapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						id: doc.id,
						course_id: doc.id,
						title: data.title || "",
						price: parseFloat(data.price || 0),
						thumbnail: data.thumbnail || "",
						instructor_name: data.instructor_name || "",
						instructor_id: data.instructor_id || "",
						description: data.description || "",
						rating: data.rating || { rate: 0, count: 0 },
						discount: parseFloat(data.discount || 0),
						badge: data.badge || "",
						enrolled_students: parseInt(data.enrolled_students || 0, 10),
					};
				});

				const instructorsSnapshot = await getDocs(
					query(collection(db, "Users"), where("role", "==", "instructor"))
				);

				const allInstructors = await Promise.all(
					instructorsSnapshot.docs.map(async (doc) => {
						const instructorData = doc.data();

						const instructorCourses = allCourses.filter(
							(course) => course.instructor_id === doc.id
						);

						const reviewsSnapshot = await getDocs(
							query(
								collection(db, "Reviews"),
								where("instructor_id", "==", doc.id)
							)
						);
						const reviews = reviewsSnapshot.docs.map((doc) => doc.data());

						const totalRating = reviews.reduce(
							(sum, review) => sum + (review.rating || 0),
							0
						);
						const averageRating =
							reviews.length > 0 ? totalRating / reviews.length : 0;

						return {
							id: doc.id,
							...instructorData,
							coursesCount: instructorCourses.length,
							studentsCount: instructorCourses.reduce(
								(sum, course) => sum + (course.enrolled_students || 0),
								0
							),
							rating: averageRating,
							reviewsCount: reviews.length,
						};
					})
				);

				const searchTermLower = searchQuery?.toLowerCase() || "";
				const scoredCourses = allCourses
					.map((course) => {
						const titleMatch = (course.title?.toLowerCase() || "").includes(
							searchTermLower
						);
						const descMatch = (
							course.description?.toLowerCase() || ""
						).includes(searchTermLower);
						const instructorMatch = (
							course.instructor_name?.toLowerCase() || ""
						).includes(searchTermLower);

						if (titleMatch || descMatch || instructorMatch) {
							return {
								...course,
								searchScore: 1,
							};
						}

						return {
							...course,
							searchScore: Math.max(
								calculateSimilarity(
									course.title?.toLowerCase() || "",
									searchTermLower
								),
								calculateSimilarity(
									course.description?.toLowerCase() || "",
									searchTermLower
								),
								calculateSimilarity(
									course.instructor_name?.toLowerCase() || "",
									searchTermLower
								)
							),
						};
					})
					.filter((course) => course.searchScore > 0.1)
					.sort((a, b) => b.searchScore - a.searchScore);

				const scoredInstructors = allInstructors
					.map((instructor) => ({
						...instructor,
						searchScore: Math.max(
							calculateSimilarity(
								`${instructor.first_name} ${instructor.last_name}`.toLowerCase(),
								searchTermLower
							),
							calculateSimilarity(
								instructor.bio?.toLowerCase() || "",
								searchTermLower
							)
						),
					}))
					.filter((instructor) => instructor.searchScore > 0.2)
					.sort((a, b) => b.searchScore - a.searchScore);

				setSearchResults({
					courses: scoredCourses,
					instructors: scoredInstructors,
				});
			} catch (error) {
				console.error("Error fetching search results:", error);
			}
			setLoading(false);
		};

		if (searchQuery) {
			fetchSearchResults();
		} else {
			setLoading(false);
		}
	}, [searchQuery]);

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "60vh",
				}}>
				<CircularProgress sx={{ color: "#8000ff" }} />
			</Box>
		);
	}

	if (!searchQuery) {
		return (
			<Container sx={{ py: 4, textAlign: "center" }}>
				<Typography variant="h5">{t("Please enter a search term")}</Typography>
			</Container>
		);
	}

	const totalResults =
		searchResults.courses.length + searchResults.instructors.length;
	if (totalResults === 0) {
		return (
			<Container sx={{ py: 4, textAlign: "center" }}>
				<Typography variant="h5">
					{t('No results found for "{0}"', searchQuery)}
				</Typography>
			</Container>
		);
	}

	return (
		<Container sx={{ py: 4 }}>
			<Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
				{t('Search Results for "{0}" ({1} results)', [
					searchQuery,
					totalResults,
				])}
			</Typography>

			{searchResults.instructors.length > 0 && (
				<>
					<Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
						{t("Instructors ({0})", searchResults.instructors.length)}
					</Typography>
					<Grid container spacing={3}>
						{searchResults.instructors.map((instructor) => (
							<Grid item xs={12} md={6} key={instructor.id}>
								<Card
									sx={{
										display: "flex",
										height: "100%",
										bgcolor: "#fff",
										boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
									}}>
									<Box
										sx={{
											p: 2,
											display: "flex",
											flexDirection: "column",
											flex: 1,
										}}>
										<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
											<Avatar
												src={instructor.profile_picture}
												alt={`${instructor.first_name} ${instructor.last_name}`}
												sx={{ width: 64, height: 64, mr: 2 }}
											/>
											<Box>
												<Typography variant="h6" sx={{ fontWeight: 600 }}>
													{instructor.first_name} {instructor.last_name}
												</Typography>
												<Typography
													variant="body2"
													color="text.secondary"
													sx={{ mb: 1 }}>
													{instructor.title || "Instructor"}
												</Typography>
											</Box>
										</Box>

										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ mb: 2 }}>
											{instructor.bio?.slice(0, 150)}
											{instructor.bio?.length > 150 ? "..." : ""}
										</Typography>

										<Stack direction="row" spacing={2} sx={{ mb: 2 }}>
											<Box sx={{ display: "flex", alignItems: "center" }}>
												<StarIcon
													sx={{ fontSize: 16, color: "orange", mr: 0.5 }}
												/>
												<Typography variant="body2">
													{instructor.rating.toFixed(1)} (
													{instructor.reviewsCount} {t("reviews")})
												</Typography>
											</Box>
											<Box sx={{ display: "flex", alignItems: "center" }}>
												<VideoLibraryIcon sx={{ fontSize: 16, mr: 0.5 }} />
												<Typography variant="body2">
													{instructor.coursesCount} {t("courses")}
												</Typography>
											</Box>
											<Box sx={{ display: "flex", alignItems: "center" }}>
												<PeopleIcon sx={{ fontSize: 16, mr: 0.5 }} />
												<Typography variant="body2">
													{instructor.studentsCount} {t("students")}
												</Typography>
											</Box>
										</Stack>

										<Box
											sx={{
												mt: "auto",
												display: "flex",
												justifyContent: "center",
											}}>
											<Button
												variant="outlined"
												color="primary"
												onClick={() => navigate(`/instructor/${instructor.id}`)}
												sx={{ textTransform: "none" }}>
												{t("View Profile")}
											</Button>
										</Box>
									</Box>
								</Card>
							</Grid>
						))}
					</Grid>
				</>
			)}

			{searchResults.courses.length > 0 && (
				<>
					<Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
						{t("Courses ({0})", searchResults.courses.length)}
					</Typography>
					<Grid container spacing={2} justifyContent="center">
						{searchResults.courses.slice(0, 3).map((course) => (
							<Grid item xs={12} sm={6} md={4} key={course.id}>
								<Card
									onClick={() => navigate(`/course/${course.id}`)}
									sx={{
										height: "100%",
										width: 320,
										mx: "auto",
										display: "flex",
										flexDirection: "column",
										bgcolor: "#fff",
										boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
										transition: "all 0.3s ease",
										cursor: "pointer",
										"&:hover": {
											transform: "translateY(-4px)",
											boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
										},
									}}>
									<CardMedia
										component="img"
										sx={{ height: 150, objectFit: "cover" }}
										image={course.thumbnail || "/placeholder-image.jpg"}
										alt={course.title}
									/>
									<CardContent
										sx={{
											flexGrow: 1,
											display: "flex",
											flexDirection: "column",
											p: 2,
										}}>
										<Typography
											variant="h6"
											sx={{ fontSize: "1rem", mb: 1, fontWeight: 600 }}
											noWrap>
											{course.title}
										</Typography>
										<Typography
											variant="body2"
											sx={{
												color: "text.secondary",
												mb: 1,
												cursor: "pointer",
												"&:hover": {
													color: "primary.main",
												},
											}}
											onClick={(e) => {
												e.stopPropagation();
												navigate(`/instructor/${course.instructor_id}`);
											}}
											noWrap>
											{course.instructor_name}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ mb: 2 }}
											noWrap>
											{course.description}
										</Typography>
										{course.rating && (
											<Box
												sx={{ display: "flex", alignItems: "center", mb: 2 }}>
												<Rating
													value={course.rating.rate}
													readOnly
													size="small"
													precision={0.1}
												/>
												<Typography
													variant="body2"
													color="text.secondary"
													sx={{ ml: 1 }}>
													({course.rating.count})
												</Typography>
											</Box>
										)}
										<Box sx={{ mt: "auto" }}>
											<Box
												sx={{
													display: "flex",
													alignItems: "center",
													mb: 1,
													justifyContent: "space-between",
												}}>
												<Typography
													variant="h6"
													color="primary.main"
													sx={{ fontWeight: "bold" }}>
													${parseFloat(course.price || 0).toFixed(2)}
												</Typography>
												{course.discount > 0 && (
													<Typography
														variant="body2"
														sx={{
															textDecoration: "line-through",
															color: "text.secondary",
														}}>
														$
														{(
															(course.price * 100) /
															(100 - course.discount)
														).toFixed(2)}
													</Typography>
												)}
												<IconButton
													onClick={(e) => {
														e.stopPropagation();
														const isInWishlist = wishlistItems.some(
															(item) => item.id === course.id
														);
														if (isInWishlist) {
															removeFromWishlist(course.id);
														} else {
															addToWishlist(course);
														}
													}}
													sx={{ ml: 1 }}>
													{wishlistItems.some(
														(item) => item.id === course.id
													) ? (
														<FavoriteIcon sx={{ color: "#a435f0" }} />
													) : (
														<FavoriteBorderIcon />
													)}
												</IconButton>
											</Box>
											<Button
												variant="contained"
												fullWidth
												color="primary"
												onClick={(e) => handleAddToCart(e, course)}
												disabled={cartItems.some(
													(item) => item.id === course.id
												)}
												sx={{
													textTransform: "none",
													py: 1,
												}}>
												{cartItems.some((item) => item.id === course.id)
													? t("In Cart")
													: t("Add to Cart")}
											</Button>
										</Box>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</>
			)}
		</Container>
	);
};

export default SearchResults;
