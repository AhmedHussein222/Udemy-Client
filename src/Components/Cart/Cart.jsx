/** @format */

import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Grid,
	Stack,
	TextField,
	Typography,
	CircularProgress,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useContext, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTranslation } from "react-i18next";
import { CartContext } from "../../context/cart-context";
import { WishlistContext } from "../../context/wishlist-context";
import { useNavigate } from "react-router-dom";

function Cart() {
	const { t } = useTranslation();
	const navigate = useNavigate();
		const { cartItems, loading, removeFromCart } =		useContext(CartContext);
	const { saveForLater, addToWishlist } = useContext(WishlistContext);
	const [couponCode, setCouponCode] = useState("");

	const handleCheckout = () => {
		navigate("/checkout");
	};

	const handleRemoveItem = async (courseId) => {
		await removeFromCart(courseId);
	};

	const handleSaveForLater = async (course) => {
		const success = await saveForLater(course);
		if (success) {
			await removeFromCart(course.id);
		}
	};

	const handleMoveToWishlist = async (course) => {
		const success = await addToWishlist(course);
		if (success) {
			await removeFromCart(course.id);
		}
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "50vh",
				}}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ width: "100%", minHeight: "80vh", bgcolor: "#f7f9fa", py: 4 }}>
			{cartItems.length === 0 ? (
				<Stack
					direction="column"
					alignItems="center"
					sx={{ px: { xs: 2, md: 4 }, width: "100%" }}>
					<Card
						sx={{
							width: "100%",
							maxWidth: "700px",
							mt: 4,
							ml: { xs: 0, md: 2 },
							border: "none",
							boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
							borderRadius: "8px",
						}}>
							<Box 
								sx={{ 
									cursor: "pointer",
									'&:hover': {
										bgcolor: "#f7f9fa"
									}
								}} 
								onClick={() => navigate("/")}>
								<CardMedia
									component="img"
									src="../../assets/empty-shopping-cart-v2-2x.webp"
									alt="Cart empty"
									sx={{
										mt: 6,
										mb: 2,
										width: "200px",
										objectFit: "contain",
										mx: "auto"
									}}
								/>
								<CardContent sx={{ textAlign: "center", pb: 4 }}>
									<Typography
										variant="h6"
										sx={{
											fontFamily: "Roboto, sans-serif",
											color: "#1c1d1f",
											mb: 2,
											fontWeight: 700,
										}}>
										{t("Your cart is empty. Keep shopping to find a course!")}
									</Typography>
									<Button
										variant="contained"
										onClick={(e) => {
											e.stopPropagation();
											navigate("/");
										}}
										sx={{
											bgcolor: "#a435f0",
											color: "#fff",
											textTransform: "none",
											fontFamily: "Roboto, sans-serif",
											fontWeight: 600,
											borderRadius: "4px",
											px: 4,
											py: 1.5,
											"&:hover": { bgcolor: "#8710d8" },
										}}>
										{t("Keep shopping")}
									</Button>
								</CardContent>
							</Box>
					</Card>
				</Stack>
			) : (
				<Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, md: 4 } }}>
					<Typography
						variant="h4"
						sx={{
							fontFamily: "Roboto, sans-serif",
							color: "#1c1d1f",
							fontWeight: 700,
							mb: 2,
						}}>
						{t("Shopping Cart")}
					</Typography>
					<Typography
						variant="subtitle1"
						sx={{
							fontFamily: "Roboto, sans-serif",
							color: "#1c1d1f",
							fontWeight: 400,
							mb: 3,
						}}>
						{cartItems.length} {t("courses in cart")}
					</Typography>

					<Box
						sx={{
							display: "flex",
							gap: 4,
							flexDirection: { xs: "column", md: "row" },
						}}>
						{/* Main Cart Items - 70% width */}
						<Box sx={{ flex: "1 1 70%" }}>
							{cartItems.map((item) => (
								<Card
									key={item.id}
									sx={{
										mb: 2,
										ml: { xs: 0, md: 1 },
										border: "none",
										boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
										borderRadius: "8px",
										minHeight: "220px",
										width: "100%",
									}}>
									<CardContent sx={{ height: "100%", p: 3 }}>
										<Grid container spacing={2} sx={{ height: "100%" }}>
											<Grid item xs={12} sm={3}>
												<Box sx={{ height: "160px", width: "100%" }}>
													<CardMedia
														component="img"
														image={item.thumbnail}
														alt={item.title}
														sx={{
															borderRadius: "4px",
															height: "100%",
															width: "100%",
															objectFit: "cover",
														}}
													/>
												</Box>
											</Grid>
											<Grid item xs={12} sm={7}>
												<Box
													sx={{
														height: "100%",
														display: "flex",
														flexDirection: "column",
													}}>
													<Typography
														variant="h6"
														sx={{
															fontFamily: "Roboto, sans-serif",
															color: "#1c1d1f",
															fontWeight: 700,
															mb: 1,
														}}>
														{item.title}
													</Typography>
													<Typography
														variant="body2"
														sx={{
															fontFamily: "Roboto, sans-serif",
															color: "#6a6f73",
															mb: 2,
															overflow: "hidden",
															display: "-webkit-box",
															WebkitBoxOrient: "vertical",
															WebkitLineClamp: 3,
															wordBreak: "break-word",
															whiteSpace: "normal",
														}}>
														{item.description}
													</Typography>
													<Typography
														variant="body2"
														sx={{
															fontFamily: "Roboto, sans-serif",
															color: "#6a6f73",
															mb: 1,
														}}>
														{t("By")}{" "}
														{item.instructor_name || t("Unknown Instructor")}
													</Typography>
													<Stack direction="row" spacing={1} sx={{ mb: 2 }}>
														{item.bestSeller && (
															<Box
																sx={{
																	bgcolor: "#eceb98",
																	color: "#3d3c0a",
																	fontFamily: "Roboto, sans-serif",
																	fontSize: "12px",
																	fontWeight: 700,
																	px: 1,
																	py: 0.5,
																	borderRadius: "4px",
																}}>
																{t("Bestseller")}
															</Box>
														)}
														<Stack direction="row" alignItems="center">
															<Typography
																sx={{
																	fontFamily: "Roboto, sans-serif",
																	color: "#b32d0f",
																	fontWeight: 700,
																	fontSize: "14px",
																	mr: 0.5,
																}}>
																{(item.rating?.rate || 0).toFixed(1)}
															</Typography>
															{[...Array(5)].map((_, index) => (
																<StarIcon
																	key={index}
																	sx={{
																		color:
																			index < Math.floor(item.rating?.rate || 0)
																				? "#f3ca8c"
																				: grey[300],
																		fontSize: "16px",
																	}}
																/>
															))}
															{item.rating?.count > 0 && (
																<Typography
																	variant="body2"
																	sx={{
																		fontFamily: "Roboto, sans-serif",
																		color: "#6a6f73",
																		ml: 1,
																	}}>
																	({item.rating.count})
																</Typography>
															)}
														</Stack>
													</Stack>
													<Stack
														direction="row"
														spacing={1}
														alignItems="center"
														sx={{ borderTop: "1px solid #d1d7dc", pt: 2 }}>
														<Typography
															variant="body2"
															sx={{
																fontFamily: "Roboto, sans-serif",
																color: "#6a6f73",
																fontSize: "12px",
															}}>
															{item.totalHours || 0} {t("hours")}
														</Typography>
														<Typography
															variant="body2"
															sx={{
																fontFamily: "Roboto, sans-serif",
																color: "#6a6f73",
																fontSize: "12px",
															}}>
															•
														</Typography>
														<Typography
															variant="body2"
															sx={{
																fontFamily: "Roboto, sans-serif",
																color: "#6a6f73",
																fontSize: "12px",
															}}>
															{item.lectures || 0} {t("lectures")}
														</Typography>
													</Stack>
												</Box>
											</Grid>
											<Grid item xs={12} sm={2}>
												<Stack
													spacing={1}
													alignItems="flex-end"
													justifyContent="space-between"
													height="100%">
													<Box sx={{ mb: 2 }}>
														<Stack
															direction="row"
															alignItems="center"
															spacing={0.5}
															justifyContent="flex-end">
															<Typography
																variant="h6"
																sx={{
																	fontFamily: "Roboto, sans-serif",
																	color: "#1c1d1f",
																	fontWeight: 700,
																}}>
																{t("E£")} {Number(item.discount ? (item.price - (item.price * item.discount / 100)) : item.price).toFixed(2)}
															</Typography>
														</Stack>
														{item.price && item.discount && (
															<Typography
																variant="body2"
																sx={{
																	fontFamily: "Roboto, sans-serif",
																	color: "#6a6f73",
																	textDecoration: "line-through",
																	fontSize: "14px",
																}}>
																{t("E£")} {Number(item.price).toFixed(2)}
															</Typography>
														)}
													</Box>
													<Stack direction="column" spacing={0.5}>
														<Button
															variant="text"
															size="small"
															sx={{
																fontFamily: "Roboto, sans-serif",
																color: "#a435f0",
																textTransform: "none",
																fontWeight: 500,
																justifyContent: "flex-end",
																"&:hover": {
																	bgcolor: "#ede5f9",
																	color: "#6d28d2",
																},
																minWidth: "120px",
															}}
															onClick={() => handleRemoveItem(item.id)}>
															{t("Remove")}
														</Button>
														<Button
															variant="text"
															size="small"
															sx={{
																fontFamily: "Roboto, sans-serif",
																color: "#a435f0",
																textTransform: "none",
																fontWeight: 500,
																justifyContent: "flex-end",
																"&:hover": {
																	bgcolor: "#ede5f9",
																	color: "#6d28d2",
																},
																minWidth: "120px",
															}}
															onClick={() => handleSaveForLater(item)}>
															{t("Save for later")}
														</Button>
														<Button
															variant="text"
															size="small"
															sx={{
																fontFamily: "Roboto, sans-serif",
																color: "#a435f0",
																textTransform: "none",
																fontWeight: 500,
																justifyContent: "flex-end",
																"&:hover": {
																	bgcolor: "#ede5f9",
																	color: "#6d28d2",
																},
																minWidth: "120px",
															}}
															onClick={() => handleMoveToWishlist(item)}>
															{t("Move to wishlist")}
														</Button>
													</Stack>
												</Stack>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							))}
						</Box>

						{/* Checkout Section - 30% width */}
						<Box
							sx={{
								flex: "0 0 30%",
								position: { md: "sticky" },
								top: { md: "20px" },
								height: "fit-content",
								alignSelf: "flex-start",
							}}>
							<Card
								sx={{
									width: "100%",
									ml: { xs: 0, md: 1 },
									border: "none",
									boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
									borderRadius: "8px",
								}}>
								<CardContent sx={{ p: 3 }}>
									<Typography
										variant="h6"
										sx={{
											fontFamily: "Roboto, sans-serif",
											color: "#1c1d1f",
											fontWeight: 700,
											mb: 1,
										}}>
										{t("Total:")}
									</Typography>
									<Typography
										variant="h4"
										sx={{
											fontFamily: "Roboto, sans-serif",
											color: "#1c1d1f",
											fontWeight: 700,
											mb: 2,
										}}>
										{t("E£")} {cartItems.reduce((total, item) => total + (item.discount ? (item.price - (item.price * item.discount / 100)) : item.price), 0).toFixed(2)}
									</Typography>
									<Button
										variant="contained"
										fullWidth
										sx={{
											bgcolor: "#a435f0",
											color: "#fff",
											textTransform: "none",
											fontFamily: "Roboto, sans-serif",
											fontWeight: 600,
											py: 1.5,
											borderRadius: "4px",
											"&:hover": { bgcolor: "#8710d8" },
										}}
										onClick={handleCheckout}
										endIcon={<ArrowForwardIcon />}>
										{t("Checkout")}
									</Button>
									<Typography
										variant="body2"
										sx={{
											fontFamily: "Roboto, sans-serif",
											color: "#6a6f73",
											fontSize: "12px",
											mt: 1,
											textAlign: "center",
										}}>
										{t("You won't be charged yet")}
									</Typography>
									<Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #d1d7dc" }}>
										<Typography
											variant="subtitle2"
											sx={{
												fontFamily: "Roboto, sans-serif",
												color: "#1c1d1f",
												fontWeight: 700,
												mb: 1,
											}}>
											{t("Promotions")}
										</Typography>
										<Stack direction="row" spacing={1}>
											<TextField
												size="small"
												placeholder={t("Enter Coupon")}
												value={couponCode}
												onChange={(e) => setCouponCode(e.target.value)}
												sx={{
													"& .MuiOutlinedInput-root": {
														borderRadius: "4px",
														fontFamily: "Roboto, sans-serif",
													},
												}}
											/>
											<Button
												variant="contained"
												size="small"
												sx={{
													bgcolor: "#a435f0",
													color: "#fff",
													textTransform: "none",
													fontFamily: "Roboto, sans-serif",
													fontWeight: 600,
													px: 2,
													"&:hover": { bgcolor: "#8710d8" },
												}}>
												{t("Apply")}
											</Button>
										</Stack>
									</Box>
								</CardContent>
							</Card>
						</Box>
					</Box>
				</Box>
			)}
		</Box>
	);
}

export default Cart;
