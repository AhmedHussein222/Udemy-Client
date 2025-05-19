/** @format */

import React, { useState, useEffect, useContext } from "react";
import "./Home2.css";
import { db } from "../../Firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/cart-context";
import { WishlistContext } from "../../context/wishlist-context";
import { Button, IconButton, Box } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import logo1 from "../../assets/hands.webp";
import logo2 from "../../assets/certificate.webp";
import logo3 from "../../assets/empty.webp";
import logo4 from "../../assets/organizations.webp";
import preview1 from "../../assets/S1.png";
import preview2 from "../../assets/S2.png";
import preview3 from "../../assets/S3.png";
import preview4 from "../../assets/S4.png";

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
	const navigate = useNavigate();
	const { addToCart, cartItems } = useContext(CartContext);
	const { addToWishlist, removeFromWishlist, wishlistItems } =
		useContext(WishlistContext);
	const ratingValue = course.rating?.rate ?? 0;
	const ratingCount = course.rating?.count ?? 0;

	const isInCart = cartItems.some((item) => item.id === course.id);
	const isInWishlist = wishlistItems.some((item) => item.id === course.id);

	const handleCourseClick = () => {
		navigate(`/course-details/${course.id}`);
	};

	const handleAddToCart = async (e) => {
		e.stopPropagation();
		try {
			const lessonsQuery = query(
				collection(db, "Lessons"),
				where("course_id", "==", course.id.toString())
			);
			const lessonsSnap = await getDocs(lessonsQuery);
			const lessons = lessonsSnap.docs.map((doc) => doc.data());

			const totalMins = lessons.reduce((sum, lesson) => {
				if (lesson.video_url) {
					return sum + (Number(lesson.duration) || 0);
				}
				return sum;
			}, 0);

			const courseData = {
				id: course.id,
				title: course.title || "",
				price: Number(course.price) || 0,
				thumbnail: course.thumbnail || "",
				instructor_name: course.instructor_name || "Unknown Instructor",
				description: course.description || "",
				rating: course.rating || { rate: 0, count: 0 },
				totalHours: Math.floor(totalMins / 60),
				lectures: lessons.length,
				discount: course.discount || 0,
				badge: course.badge || "",
			};

			await addToCart(courseData);
		} catch (error) {
			console.error("Error adding to cart:", error);
		}
	};

	const handleWishlistToggle = async (e) => {
		e.stopPropagation();
		try {
			if (isInWishlist) {
				await removeFromWishlist(course.id);
			} else {
				await addToWishlist(course);
			}
		} catch (error) {
			console.error("Error updating wishlist:", error);
		}
	};

	return (
		<div
			className="course-card"
			style={{
				width: "280px",
				minHeight: "380px",
				border: "1px solid #d1d7dc",
				borderRadius: "4px",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
				transition: "box-shadow 0.2s ease-in-out",
				cursor: "pointer",
				backgroundColor: "#fff",
				flexShrink: 0,
				position: "relative",
				marginRight: "16px",
			}}>
			<div onClick={handleCourseClick} style={{ flex: 1 }}>
				<div style={{ position: "relative" }}>
					<img
						src={course.thumbnail}
						alt={course.title}
						style={{
							width: "100%",
							height: "160px",
							objectFit: "cover",
						}}
					/>
					<IconButton
						onClick={handleWishlistToggle}
						sx={{
							position: "absolute",
							top: 8,
							right: 8,
							backgroundColor: "rgba(255,255,255,0.9)",
							"&:hover": {
								backgroundColor: "rgba(255,255,255,1)",
								color: isInWishlist ? "#a435f0" : "#e91e63",
							},
							color: isInWishlist ? "#a435f0" : "inherit",
						}}>
						{isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
					</IconButton>
				</div>
				<div style={{ padding: "12px" }}>
					<h3
						style={{
							margin: "0 0 8px",
							fontSize: "16px",
							fontWeight: "bold",
							lineHeight: 1.2,
							height: "40px",
							overflow: "hidden",
						}}>
						{course.title}
					</h3>
					<p
						style={{
							margin: "0 0 8px",
							fontSize: "14px",
							color: "#6a6f73",
							height: "20px",
							overflow: "hidden",
						}}>
						{course.instructor_name || "Unknown Instructor"}
					</p>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							marginBottom: "8px",
						}}>
						<span
							style={{
								color: "#b4690e",
								fontWeight: "bold",
								marginRight: "4px",
							}}>
							{ratingValue}
						</span>
						<span style={{ color: "#f69c08" }}>
							{"★".repeat(Math.round(ratingValue)) +
								"☆".repeat(5 - Math.round(ratingValue))}
						</span>
						<span
							style={{
								color: "#6a6f73",
								fontSize: "14px",
								marginLeft: "4px",
							}}>
							({ratingCount.toLocaleString()})
						</span>
					</div>
					<div style={{ marginTop: "auto" }}>
						{course.price === 0 ? (
							<span style={{ fontWeight: "bold", fontSize: "16px" }}>Free</span>
						) : (
							<div>
								<span style={{ fontWeight: "bold", fontSize: "16px" }}>
									{Number(course.price).toFixed(2)} EGP
								</span>
								{course.discount > 0 && (
									<span
										style={{
											textDecoration: "line-through",
											color: "#6a6f73",
											marginLeft: "8px",
											fontSize: "14px",
										}}>
										{(Number(course.price) + Number(course.discount)).toFixed(
											2
										)}{" "}
										EGP
									</span>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
			<div
				style={{
					padding: "12px",
					borderTop: "1px solid #d1d7dc",
					display: "flex",
					gap: "8px",
					justifyContent: "center",
				}}>
				<Button
					variant="contained"
					size="small"
					startIcon={<AddShoppingCartIcon />}
					onClick={handleAddToCart}
					disabled={isInCart}
					fullWidth
					sx={{
						bgcolor: "#a435f0",
						"&:hover": { bgcolor: "#8710d8" },
						"&:disabled": {
							bgcolor: "#e7e7e7",
							color: "#a6a6a6",
						},
					}}>
					{isInCart ? "In Cart" : "Add to Cart"}
				</Button>
			</div>
			{course.badge && (
				<div
					style={{
						position: "absolute",
						top: "12px",
						left: "12px",
						background: "#eceb98",
						padding: "4px 8px",
						borderRadius: "4px",
						fontSize: "12px",
						fontWeight: "bold",
					}}>
					{course.badge}
				</div>
			)}
		</div>
	);
};

const Home2 = () => {
	const [selected, setSelected] = useState(1);
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "Courses"));
				const coursesData = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setCourses(coursesData);
			} catch (error) {
				console.error("Error fetching courses:", error);
			}
		};

		fetchCourses();
	}, []);

	return (
		<>
			<section className="courses-section" style={{ padding: "20px" }}>
				<h2
					style={{
						fontSize: "24px",
						fontWeight: "bold",
						marginBottom: "16px",
						color: "#1c1d1f",
					}}>
					Learners are viewing
				</h2>
				<div
					style={{
						display: "flex",
						overflowX: "auto",
						scrollSnapType: "x mandatory",
						msOverflowStyle: "none",
						scrollbarWidth: "none",
						marginLeft: "-8px",
						marginRight: "-8px",
						padding: "8px",
						"&::-webkit-scrollbar": {
							display: "none",
						},
					}}>
					{courses.map((course) => (
						<CourseCard key={course.id} course={course} />
					))}
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
