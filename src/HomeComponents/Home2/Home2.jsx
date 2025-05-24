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
		<Box
			key={course.id}
			sx={{ position: "relative", width: 280, flex: "0 0 auto" }}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			<Card
				onClick={(e) => {
					if (e.target.closest("button")) return;
					navigate(`/course/${course.id}`);
				}}
				sx={{
					cursor: "pointer",
					height: "420px",
					display: "flex",
					flexDirection: "column",
				}}>
				{" "}
				<img
					src={course.thumbnail}
					alt={course.title}
					style={{
						width: "100%",
						height: "150px",
						objectFit: "cover",
						objectPosition: "center",
						borderRadius: "8px 8px 0 0",
						minHeight: "150px",
						maxHeight: "150px",
					}}
				/>
				<CardContent>
					{" "}
					<Typography
						gutterBottom
						variant="h6"
						component="div"
						sx={{
							fontWeight: "bold",
							color: "#000000",
							width: "100%",
							height: "72px",
							wordBreak: "normal",
							overflowWrap: "break-word",
							whiteSpace: "normal",
							display: "-webkit-box",
							WebkitLineClamp: 3,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
							mb: 1,
							fontSize: "1rem",
							lineHeight: "1.5",
						}}>
						{course.title}
					</Typography>{" "}
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							width: "100%",
							minHeight: "84px",
							maxHeight: "84px",
							display: "block",
							overflow: "hidden",
							wordBreak: "normal",
							overflowWrap: "break-word",
							whiteSpace: "normal",
							mb: 2,
							lineHeight: "1.4",
							fontSize: "0.875rem",
							"& > *": {
								display: "-webkit-box",
								WebkitBoxOrient: "vertical",
								WebkitLineClamp: 4,
							},
						}}>
						{course.description}
					</Typography>
					{/* التقييم والسعر */}
					{(() => {
						const ratingValue = course.rating?.rate || 0;
						const ratingCount = course.rating?.count || 0;
						const price = Number(course.price) || 0;
						const discount = Number(course.discount) || 0;

						return (
							<>
								{" "}
								<div
									className="rating"
									style={{
										marginBottom: 16,
										display: "flex",
										alignItems: "center",
										gap: 8,
										height: "24px",
									}}>
									<span style={{ fontWeight: "bold" }}>
										{ratingValue.toFixed(1)}
									</span>
									<span style={{ color: "#ffb400", fontSize: "18px" }}>
										{"★".repeat(Math.round(ratingValue)) +
											"☆".repeat(5 - Math.round(ratingValue))}
									</span>
									<span style={{ color: "#666" }}>
										({ratingCount.toLocaleString()})
									</span>
								</div>
								<div
									className="pricing"
									style={{
										marginBottom: 8,
										fontWeight: "bold",
										height: "24px",
									}}>
									{price === 0 ? (
										<>
											<span style={{ color: "green" }}>Free</span>
											{discount > 0 && (
												<span
													style={{
														textDecoration: "line-through",
														marginLeft: 8,
														color: "#999",
													}}>
													{(price + discount).toFixed(2)} EGP
												</span>
											)}
										</>
									) : (
										<>
											<span>{price.toFixed(2)} EGP</span>
											{discount > 0 && (
												<span
													style={{
														textDecoration: "line-through",
														marginLeft: 8,
														color: "#999",
													}}>
													{(price + discount).toFixed(2)} EGP
												</span>
											)}
										</>
									)}
								</div>
							</>
						);
					})()}
				</CardContent>
			</Card>{" "}
			{/* Popup on hover */}{" "}
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
										zIndex: 0,
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
										zIndex: 0,
									},
							  }),
						width: "280px",
						minWidth: "280px",
						background: "white",
						border: "1px solid #ddd",
						borderRadius: "4px",
						padding: "16px",
						boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
						zIndex: 99,
						display: "flex",
						flexDirection: "column",
					}}>
					{" "}
					<Typography
						variant="h6"
						fontWeight="bold"
						gutterBottom
						sx={{
							wordBreak: "normal",
							width: "100%",
							overflowWrap: "break-word",
							whiteSpace: "normal",
							display: "block",
						}}>
						{course.title}
					</Typography>
					<Typography
						variant="body2"
						sx={{
							mb: 1.5,
							wordBreak: "normal",
							width: "100%",
							overflowWrap: "break-word",
							whiteSpace: "normal",
						}}>
						{course.description}
					</Typography>{" "}
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
							onClick={(e) => handleWishlistToggle(e, course)}
							sx={{
								color: wishlistItems.find((item) => item.id === course.id)
									? "#8e2de2"
									: "grey.400",
							}}>
							{wishlistItems.find((item) => item.id === course.id) ? (
								<FavoriteIcon />
							) : (
								<FavoriteBorderIcon />
							)}
						</IconButton>
					</Box>
					<Button
						variant="contained"
						color="primary"
						size="small"
						sx={{
							background: cartItems.find((item) => item.id === course.id)
								? "white"
								: "#8e2de2",
							color: cartItems.find((item) => item.id === course.id)
								? "#8e2de2"
								: "white",
							border: cartItems.find((item) => item.id === course.id)
								? "1px solid #8e2de2"
								: "none",
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
								background: cartItems.find((item) => item.id === course.id)
									? "white"
									: "#7016b3",
							},
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleAddToCart(course);
						}}
						fullWidth>
						{cartItems.find((item) => item.id === course.id)
							? "In Cart"
							: "Add to Cart"}
						<ShoppingCart />
					</Button>
				</Box>
			)}
		</Box>
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
