/** @format */

import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	CircularProgress,
	Container,
	IconButton,
	Typography,
	Snackbar,
	Alert,
	Popover,
	Stack,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React, { useState, useRef, useEffect, useContext } from "react";
import { useWishlist } from "../../context/wishlist-context";
import { useCart } from "../../context/cart-context";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { db, doc, getDoc } from "../../Firebase/firebase";

function Wishlist() {
	const { t } = useTranslation();
	const { wishlistItems, removeFromWishlist } = useWishlist();
	const { addToCart, cartItems } = useCart();
	const { user } = useContext(UserContext);
	const [enrolledCourses, setEnrolledCourses] = useState([]);
	const [notification, setNotification] = useState({
		open: false,
		message: "",
		severity: "success",
	});
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [isHovering, setIsHovering] = useState(false);
	const closeTimeoutRef = useRef(null);

	const handleRemoveFromWishlist = async (courseId, event) => {
		// Prevent event propagation to avoid triggering card click events
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		// Close any open popover
		setAnchorEl(null);
		setSelectedCourse(null);

		await removeFromWishlist(courseId);
		setNotification({
			open: true,
			message: t("Course removed from wishlist"),
			severity: "success",
		});
	};

	const handleMoveToCart = async (course) => {
		try {
			// Close any open popover
			setAnchorEl(null);
			setSelectedCourse(null);

			await addToCart(course);
			await removeFromWishlist(course.id);
			setNotification({
				open: true,
				message: t("Course moved to cart successfully"),
				severity: "success",
			});
		} catch (error) {
			setNotification({
				open: true,
				message: t(`Failed to move course to cart: ${error.message}`),
				severity: "error",
			});
		}
	};

	const handleCloseNotification = () => {
		setNotification({ ...notification, open: false });
	};

	const handlePopoverOpen = (event, course) => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
		}
		setIsHovering(true);
		setAnchorEl(event.currentTarget);
		setSelectedCourse(course);
	};

	const handlePopoverClose = () => {
		setIsHovering(false);
		closeTimeoutRef.current = setTimeout(() => {
			if (!isHovering) {
				setAnchorEl(null);
				setSelectedCourse(null);
			}
		}, 300);
	};

	const handleMouseEnterPopover = () => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
		}
		setIsHovering(true);
	};

	const handleMouseLeavePopover = () => {
		setIsHovering(false);
		closeTimeoutRef.current = setTimeout(() => {
			if (!isHovering) {
				setAnchorEl(null);
				setSelectedCourse(null);
			}
		}, 300);
	};

	useEffect(() => {
		const fetchEnrolledCourses = async () => {
			if (user?.id) {
				const userDoc = doc(db, "users", user.id);
				const userSnapshot = await getDoc(userDoc);

				if (userSnapshot.exists()) {
					setEnrolledCourses(userSnapshot.data().enrolledCourses || []);
				} else {
					setEnrolledCourses([]);
				}
			} else {
				setEnrolledCourses([]);
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

	useEffect(() => {
		return () => {
			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current);
			}
		};
	}, []);

	const open = Boolean(anchorEl);
	const id = open ? "course-popover" : undefined;

	const renderCourseButton = (course) => {
		const isEnrolled = enrolledCourses.includes(course.id);
		const isInCart = cartItems.some((item) => item.id === course.id);

		return (
			<Button
				variant="contained"
				fullWidth
				startIcon={isEnrolled ? <CheckCircleIcon /> : <AddShoppingCartIcon />}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					if (!isEnrolled) {
						handleMoveToCart(course);
					}
				}}
				disabled={isEnrolled}
				sx={{
					bgcolor: isEnrolled
						? "#4caf50"
						: isInCart
						? "#f5f5f5"
						: course.price === 0
						? "#4caf50"
						: "#a435f0",
					color: isInCart ? "#6a1b9a" : "white",
					textTransform: "none",
					flex: 1,
					"&:hover": {
						bgcolor: isEnrolled
							? "#388e3c"
							: isInCart
							? "#f0f0f0"
							: course.price === 0
							? "#388e3c"
							: "#8710d8",
					},
				}}>
				{isEnrolled
					? "Enrolled"
					: isInCart
					? "In Cart"
					: course.price === 0
					? "Enroll Free"
					: "Add to Cart"}
			</Button>
		);
	};

	const renderEmptyWishlist = () => (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "60vh",
				gap: 2,
			}}>
			<Typography variant="h5" gutterBottom>
				{t("Your wishlist is empty")}
			</Typography>
			<Button
				component={Link}
				to="/courses"
				variant="contained"
				color="primary">
				{t("Browse courses now")}
			</Button>
		</Box>
	);

	if (!wishlistItems) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
				<Typography>{t("Loading wishlist...")}</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ width: "100%", minHeight: "80vh", bgcolor: "#f7f9fa", py: 4 }}>
			<Snackbar
				open={notification.open}
				autoHideDuration={3000}
				onClose={handleCloseNotification}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				sx={{
					left: "50% !important",
					right: "auto !important",
					transform: "translateX(-50%)",
				}}>
				<Alert
					onClose={handleCloseNotification}
					severity={notification.severity}>
					{notification.message}
				</Alert>
			</Snackbar>

			{wishlistItems.length === 0 ? (
				renderEmptyWishlist()
			) : (
				<Container>
					<Typography
						variant="h4"
						fontWeight="bold"
						fontFamily="initial"
						color="#0d1b2a"
						sx={{ mb: 4 }}>
						{t("My Wishlist")}
					</Typography>

					<Box sx={{ position: "relative" }}>
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: {
									xs: "1fr",
									sm: "1fr 1fr",
									md: "repeat(4, 1fr)",
								},
								gap: 2,
								pb: 1,
							}}>
							{wishlistItems.map((course) => (
								<Card
									key={course.id}
									sx={{
										position: "relative",
										"&:hover": {
											boxShadow: "0 0 10px rgba(0,0,0,0.2)",
										},
									}}
									onMouseEnter={(event) => handlePopoverOpen(event, course)}
									onMouseLeave={handlePopoverClose}>
									<Box>
										<Link
											to={`/course/${course.id}`}
											style={{ textDecoration: "none", color: "inherit" }}>
											<CardMedia
												component="img"
												height="140"
												image={course.thumbnail}
												alt={course.title}
											/>
											<CardContent>
												<Typography variant="subtitle1" fontWeight="600" noWrap>
													{course.title}
												</Typography>
												<Typography
													variant="body2"
													color="text.secondary"
													sx={{ mb: 1 }}>
													{course.description?.slice(0, 60)}...
												</Typography>

												<Box display="flex" alignItems="center" mb={1}>
													<Typography
														variant="body2"
														fontWeight="bold"
														mr={0.5}>
														{course.rating?.rate || "0.0"}
													</Typography>
													<StarIcon sx={{ color: "#f5c518", fontSize: 18 }} />
												</Box>

												<Box
													display="flex"
													alignItems="center"
													justifyContent="space-between">
													<Box>
														{course.price === 0 ? (
															<Typography
																variant="body1"
																fontWeight="bold"
																color="green">
																{t("Free")}
															</Typography>
														) : (
															<Box display="flex" alignItems="center" gap={1}>
																<Typography
																	variant="body1"
																	fontWeight="bold"
																	color="text.primary">
																	$
																	{course.discount
																		? (
																				course.price -
																				(course.price * course.discount) / 100
																		  ).toFixed(2)
																		: course.price}
																</Typography>
																{course.discount > 0 && (
																	<Typography
																		variant="body2"
																		sx={{
																			textDecoration: "line-through",
																			color: "gray",
																		}}>
																		${course.price}
																	</Typography>
																)}
															</Box>
														)}
													</Box>
												</Box>
											</CardContent>
										</Link>
									</Box>
								</Card>
							))}
						</Box>

						<Popover
							id={id}
							open={open}
							anchorEl={anchorEl}
							onClose={handlePopoverClose}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							sx={{
								zIndex: 1300,
								pointerEvents: "auto",
							}}
							PaperProps={{
								onMouseEnter: handleMouseEnterPopover,
								onMouseLeave: handleMouseLeavePopover,
								sx: {
									pointerEvents: "auto",
									boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
								},
							}}
							disableRestoreFocus
							slotProps={{
								paper: {
									sx: {
										width: "auto",
										minWidth: 300,
										transition: "box-shadow 0.3s ease-in-out",
										"&:hover": {
											boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
										},
									},
								},
							}}>
							<Box sx={{ p: 2, width: 300 }}>
								{selectedCourse && (
									<>
										<Typography
											variant="h6"
											fontWeight="bold"
											color="black"
											gutterBottom>
											{selectedCourse.title}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ mb: 2 }}>
											{selectedCourse.description}
										</Typography>
										<Box display="flex" gap={1}>
											{" "}
											{renderCourseButton(selectedCourse)}
											<IconButton
												onClick={(event) => {
													event.preventDefault();
													event.stopPropagation();
													handleRemoveFromWishlist(selectedCourse.id, event);
													setAnchorEl(null); // Ensure popover closes immediately
												}}
												sx={{
													backgroundColor: "rgba(255,255,255,0.9)",
													"&:hover": {
														backgroundColor: "#ffebee",
													},
												}}>
												<DeleteIcon sx={{ color: "#ef5350" }} />
											</IconButton>
										</Box>
									</>
								)}
							</Box>
						</Popover>
					</Box>
				</Container>
			)}
		</Box>
	);
}

export default Wishlist;
