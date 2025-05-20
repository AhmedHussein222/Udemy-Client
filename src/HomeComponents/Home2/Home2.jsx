/** @format */

import React, { useState, useEffect, useRef } from "react";
import "./Home2.css";
import { db } from "../../Firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
	Card,
	CardContent,
	CardMedia,
	Typography,
	Box,
	Rating,
	IconButton,
	Button,
} from "@mui/material";
import {
	ArrowForwardIos,
	ShoppingCart,
	FavoriteBorder as FavoriteBorderIcon,
	Favorite as FavoriteIcon,
	ArrowBackIos,
} from "@mui/icons-material";
import logo1 from "../../assets/hands.webp";
import logo2 from "../../assets/certificate.webp";
import logo3 from "../../assets/empty.webp";
import logo4 from "../../assets/organizations.webp";
import preview1 from "../../assets/S1.png";
import preview2 from "../../assets/S2.png";
import preview3 from "../../assets/S3.png";
import preview4 from "../../assets/S4.png";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart-context";
import { useWishlist } from "../../context/wishlist-context";

const leftCards = [
	{
		id: 1,
		img: logo1,
		title: "Hands-on training",
		description:
			"Upskill effectively with AI-powered coding exercises, practice tests, and quizzes.",
		previewImg: preview1,
	},
	{
		id: 2,
		img: logo2,
		title: "Expert-led content",
		description:
			"Learn from industry professionals with real-world experience.",
		previewImg: preview2,
	},
	{
		id: 3,
		img: logo3,
		title: "Interactive learning",
		description: "Engage with content that adapts to your pace and style.",
		previewImg: preview3,
	},
	{
		id: 4,
		img: logo4,
		title: "Certification programs",
		description: "Earn credentials that boost your career prospects.",
		previewImg: preview4,
	},
];

const CourseCard = ({ course }) => {
	const { addToCart, cartItems } = useCart();
	const { addToWishlist, wishlistItems } = useWishlist();
	const [hovered, setHovered] = useState(false);
	const [popupPosition, setPopupPosition] = useState("right");
	const navigate = useNavigate();
	const timeoutRef = useRef(null);

	const ratingValue = course.rating?.rate || 0;
	const ratingCount = course.rating?.count || 0;
	const isInCart = cartItems.find((item) => item.id === course.id);
	const isInWishlist = wishlistItems.find((item) => item.id === course.id);

	const handleMouseEnter = (event) => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		const cardElement = event.currentTarget;
		const rect = cardElement.getBoundingClientRect();
		const screenWidth = window.innerWidth;
		const threshold = screenWidth * 0.7;
		setPopupPosition(rect.right > threshold ? "left" : "right");
		timeoutRef.current = setTimeout(() => setHovered(true), 100);
	};

	const handleMouseLeave = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setHovered(false);
			setPopupPosition("right");
		}, 300);
	};

	const handleWishlistToggle = async (e) => {
		e.stopPropagation();
		if (!course || !course.id || !course.title || !course.price) {
			console.error("Invalid course data:", course);
			return;
		}

		const courseToAdd = {
			id: course.id,
			title: course.title,
			price: Number(course.price) || 0,
			thumbnail: course.thumbnail || "",
			instructor_name: course.instructor_name || "Unknown Instructor",
			description: course.description || "",
			rating: course.rating || { rate: 0, count: 0 },
		};
		await addToWishlist(courseToAdd);
	};

	const handleAddToCart = (e) => {
		e.stopPropagation();
		if (!course || !course.id || !course.title || !course.price) {
			console.error("Invalid course data:", course);
			return;
		}

		const courseToAdd = {
			id: course.id,
			title: course.title,
			price: Number(course.price) || 0,
			thumbnail: course.thumbnail || "",
			instructor_name: course.instructor_name || "Unknown Instructor",
			description: course.description || "",
			rating: course.rating || { rate: 0, count: 0 },
			totalHours: Number(course.totalHours || 0),
			lectures: Number(course.lectures || 0),
			addedAt: new Date().toISOString(),
		};
		addToCart(courseToAdd);
	};

	return (
		<Card
			sx={{
				minWidth: 260,
				maxWidth: 320,
				width: "100%",
				borderRadius: 2,
				boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
				transition: "transform 0.3s ease, box-shadow 0.3s ease",
				"&:hover": {
					transform: "translateY(-6px)",
					boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
				},
				position: "relative",
				cursor: "pointer",
				m: 1,
				overflow: "visible",
				zIndex: 1,
			}}
			onClick={() => navigate(`/course-details/${course.id}`)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			<CardMedia
				component="img"
				height="180"
				image={course.thumbnail}
				alt={course.title}
				sx={{ objectFit: "cover", borderRadius: "6px 6px 0 0" }}
			/>
			<IconButton
				onClick={handleWishlistToggle}
				sx={{
					position: "absolute",
					top: 8,
					right: 8,
					backgroundColor: "rgba(255, 255, 255, 0.8)",
					"&:hover": {
						backgroundColor: "rgba(255, 255, 255, 1)",
					},
				}}>
				{isInWishlist ? (
					<FavoriteIcon sx={{ color: "#a435f0" }} />
				) : (
					<FavoriteBorderIcon sx={{ color: "grey" }} />
				)}
			</IconButton>
			<CardContent sx={{ padding: 2 }}>
				<Typography variant="h6" fontWeight={600} noWrap>
					{course.title}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						mt: 0.5,
						mb: 1,
						overflow: "hidden",
						textOverflow: "ellipsis",
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
					}}>
					{course.description}
				</Typography>
				<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
					<Typography variant="body2" fontWeight={600} mr={1}>
						{ratingValue}
					</Typography>
					<Rating value={ratingValue} readOnly precision={0.5} size="small" />
					<Typography variant="body2" color="text.secondary" ml={1}>
						({ratingCount.toLocaleString()})
					</Typography>
				</Box>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					{course.price === 0 ? (
						<>
							<Typography variant="h6" color="success.main" fontWeight={700}>
								Free
							</Typography>
							{course.discount > 0 && (
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ textDecoration: "line-through" }}>
									{(Number(course.price) + Number(course.discount)).toFixed(2)}{" "}
									EGP
								</Typography>
							)}
						</>
					) : (
						<>
							<Typography variant="h6" fontWeight={700}>
								{course.price} EGP
							</Typography>
							{course.discount > 0 && (
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ textDecoration: "line-through" }}>
									{(Number(course.price) + Number(course.discount)).toFixed(2)}{" "}
									EGP
								</Typography>
							)}
						</>
					)}
				</Box>
				{course.badge && (
					<Typography
						variant="caption"
						sx={{
							mt: 1,
							display: "inline-block",
							bgcolor: "primary.main",
							color: "white",
							px: 1,
							py: 0.5,
							borderRadius: 1,
						}}>
						{course.badge}
					</Typography>
				)}
			</CardContent>
			{hovered && (
				<Box
					sx={{
						position: "absolute",
						top: "0",
						...(popupPosition === "right"
							? {
									left: "100%",
									marginLeft: "12px",
									"&::before": {
										content: '""',
										position: "absolute",
										top: "20px",
										left: "-6px",
										width: "12px",
										height: "12px",
										background: "white",
										transform: "rotate(45deg)",
										borderLeft: "1px solid #ddd",
										borderBottom: "1px solid #ddd",
										zIndex: 1000,
									},
							  }
							: {
									right: "100%",
									marginRight: "12px",
									"&::before": {
										content: '""',
										position: "absolute",
										top: "20px",
										right: "-6px",
										width: "12px",
										height: "12px",
										background: "white",
										transform: "rotate(45deg)",
										borderTop: "1px solid #ddd",
										borderRight: "1px solid #ddd",
										zIndex: 1000,
									},
							  }),
						width: "280px",
						background: "white",
						border: "1px solid #ddd",
						borderRadius: "4px",
						padding: "16px",
						boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
						zIndex: 10000,
						isolation: "isolate",
						pointerEvents: "auto",
						overflow: "hidden",
						wordBreak: "break-word",
						overflowWrap: "break-word",
					}}>
					<Typography
						variant="h6"
						fontWeight="bold"
						gutterBottom
						sx={{
							whiteSpace: "normal",
							wordBreak: "break-word",
							overflowWrap: "break-word",
						}}>
						{course.title}
					</Typography>
					<Typography
						variant="body2"
						sx={{
							mb: 1.5,
							maxHeight: "80px",
							overflow: "hidden",
							whiteSpace: "normal",
							wordBreak: "break-word",
							overflowWrap: "break-word",
						}}>
						{course.description}
					</Typography>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							mb: 2,
						}}>
						<Typography variant="body1" fontWeight="bold">
							{course.price} EGP
						</Typography>
						<IconButton
							onClick={handleWishlistToggle}
							sx={{
								color: isInWishlist ? "#8e2de2" : "grey.400",
							}}>
							{isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
						</IconButton>
					</Box>
					<Button
						variant="contained"
						color="primary"
						size="small"
						sx={{
							background: isInCart ? "white" : "#8e2de2",
							color: isInCart ? "#8e2de2" : "white",
							border: isInCart ? "1px solid #8e2de2" : "none",
							borderRadius: "2%",
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							gap: "8px",
							fontWeight: "bold",
							fontSize: "15px",
							alignSelf: "center",
							transition: "all 0.3s ease",
							"&:hover": {
								background: isInCart ? "white" : "#7016b3",
							},
						}}
						onClick={handleAddToCart}
						fullWidth>
						{isInCart ? "In Cart" : "Add to Cart"}
						<ShoppingCart />
					</Button>
				</Box>
			)}
		</Card>
	);
};

const Home2 = () => {
	const [selected, setSelected] = useState(1);
	const [courses, setCourses] = useState([]);
	const scrollRef = useRef(null);

	const scrollLeft = () => {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({
				left: -300,
				behavior: "smooth",
			});
		}
	};

	const scrollRight = () => {
		if (scrollRef.current) {
			scrollRef.current.scrollBy({
				left: 300,
				behavior: "smooth",
			});
		}
	};

	useEffect(() => {
		const fetchCoursesWithRatings = async () => {
			try {
				const reviewsSnapshot = await getDocs(collection(db, "Reviews"));
				const ratingsMap = {};

				reviewsSnapshot.forEach((doc) => {
					const data = doc.data();
					const courseId = data.course_id;
					const rating = data.rating;

					if (ratingsMap[courseId]) {
						ratingsMap[courseId].push(rating);
					} else {
						ratingsMap[courseId] = [rating];
					}
				});

				const averageRatings = {};
				Object.keys(ratingsMap).forEach((courseId) => {
					const ratings = ratingsMap[courseId];
					const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
					averageRatings[courseId] = avg;
				});

				const querySnapshot = await getDocs(collection(db, "Courses"));
				const coursesData = querySnapshot.docs.map((doc) => {
					const courseData = doc.data();
					const avgRating = averageRatings[doc.id] || 0;

					return {
						id: doc.id,
						...courseData,
						rating: {
							rate: Number(avgRating.toFixed(1)),
							count: ratingsMap[doc.id]?.length || 0,
						},
					};
				});

				setCourses(coursesData);
			} catch (error) {
				console.error("Error fetching courses with ratings:", error);
			}
		};

		fetchCoursesWithRatings();
	}, []);

	return (
		<>
			<section className="courses-section">
				<h2 className="section-title">Learners are viewing</h2>

				<div className="courses-scroll-wrapper">
					<button className="scroll-button left" onClick={scrollLeft}>
						<ArrowBackIos />
					</button>

					<div className="courses-container" ref={scrollRef}>
						{courses.map((course) => (
							<CourseCard key={course.id} course={course} />
						))}
					</div>

					<button className="scroll-button right" onClick={scrollRight}>
						<ArrowForwardIos />
					</button>
				</div>
			</section>

			<section className="focus-section">
				<h2 className="section-title">Learning focused on your goals</h2>
				<div className="focus-grid">
					<div className="left-options">
						{leftCards.map((card) => (
							<div
								key={card.id}
								className={`option-card ${
									selected === card.id ? "active" : ""
								}`}
								onClick={() => setSelected(card.id)}>
								<img src={card.img} alt={card.title} className="option-img" />
								<div>
									<h4>{card.title}</h4>
									<p>{card.description}</p>
									<span className="explore-link">
										Explore course <ArrowForwardIos fontSize="small" />
									</span>
								</div>
							</div>
						))}
					</div>

					<div className="right-preview">
						<img
							src={leftCards.find((c) => c.id === selected)?.previewImg}
							alt="Preview"
							className="preview-img"
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default Home2;
