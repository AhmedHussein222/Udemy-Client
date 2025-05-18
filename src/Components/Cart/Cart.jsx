/** @format */

import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Stack,
	TextField,
	Typography,
	CircularProgress,
} from "@mui/material";
import { grey, purple, yellow } from "@mui/material/colors";
import React, { useContext, useState } from "react";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTranslation } from "react-i18next";
import { CartContext } from "../../context/cart-context";
import { useNavigate } from "react-router-dom";

function Cart() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { cartItems, loading, removeFromCart, getCartTotal } =
		useContext(CartContext);
	const [couponCode, setCouponCode] = useState("");

	const handleCheckout = () => {
		navigate("/checkout");
	};

	const handleRemoveItem = async (courseId) => {
		await removeFromCart(courseId);
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
		<Box sx={{ width: "100%", minHeight: "80vh", pb: 4 }}>
			{cartItems.length === 0 ? (
				<Stack
					direction="column"
					alignItems="center"
					sx={{ px: 2, width: "100%", pb: 3 }}>
					<Card
						sx={{
							width: "100%",
							maxWidth: "800px",
							marginTop: "20px",
							borderRadius: "10px",
							px: 2,
						}}>
						<CardActionArea onClick={() => navigate("/")}>
							<CardMedia
								component="img"
								height="140"
								image="/src/assets/empty-shopping-cart-v2-2x.webp"
								alt="Cart empty"
								sx={{
									marginTop: 5,
									marginBottom: 3,
									width: "100%",
									objectFit: "contain",
									mx: "auto",
								}}
							/>
							<CardContent>
								<Typography
									marginBottom={3}
									variant="subtitle1"
									component="div"
									textAlign="center">
									{t("Your cart is empty. Keep shopping to find a course!")}
								</Typography>
								<Button
									variant="contained"
									sx={{
										backgroundColor: purple[700],
										color: "#fff",
										textTransform: "none",
										fontWeight: "bold",
										borderRadius: "4px",
										py: 1,
										mt: 2,
										mb: 3,
										display: "block",
										mx: "auto",
										"&:hover": { backgroundColor: purple[900] },
									}}
									size="large">
									{t("Keep shopping")}
								</Button>
							</CardContent>
						</CardActionArea>
					</Card>
				</Stack>
			) : (
				<>
					<Box sx={{ px: 3 }}>
						<Typography
							variant="h4"
							sx={{
								textAlign: "start",
								marginTop: "20px",
								fontWeight: "bold",
							}}>
							{t("Shopping Cart")}
						</Typography>
						<Typography
							variant="h6"
							sx={{
								textAlign: "start",
								marginTop: "20px",
								fontWeight: "bold",
							}}>
							{cartItems.length} {t("courses in cart")}
						</Typography>
					</Box>

					<Grid container spacing={3} sx={{ px: 3, py: 2 }}>
						{/* Cart Items */}
						<Grid item xs={12} md={8}>
							{cartItems.map((item) => (
								<Card key={item.id} sx={{ mb: 2 }}>
									<CardContent>
										<Grid container spacing={2}>
											<Grid item xs={12} sm={3}>
												<CardMedia
													component="img"
													image={item.thumbnail}
													alt={item.title}
													sx={{
														borderRadius: 1,
														height: 100,
														objectFit: "cover",
													}}
												/>
											</Grid>
											<Grid item xs={12} sm={7}>
												<Typography variant="h6" gutterBottom>
													{item.title}
												</Typography>
												<Typography variant="body2" color="textSecondary">
													{t("By")} {item.instructor}
												</Typography>
												<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
													{item.bestSeller && (
														<Button
															variant="text"
															size="small"
															sx={{
																backgroundColor: purple[100],
																color: purple[700],
																"&:hover": {
																	backgroundColor: purple[100],
																},
															}}>
															{t("Best seller")}
														</Button>
													)}
													<Stack direction="row">
														{[...Array(5)].map((_, index) => (
															<StarBorderIcon
																key={index}
																sx={{
																	color:
																		index < Math.floor(item.rating || 0)
																			? yellow[700]
																			: grey[400],
																	fontSize: "1rem",
																}}
															/>
														))}
													</Stack>
												</Stack>
												<Stack direction="row" spacing={2} sx={{ mt: 1 }}>
													{item.totalHours && (
														<Typography variant="body2" color="textSecondary">
															{item.totalHours} {t("total hours")}
														</Typography>
													)}
													{item.lectures && (
														<Typography variant="body2" color="textSecondary">
															{item.lectures} {t("lectures")}
														</Typography>
													)}
													{item.level && (
														<Typography variant="body2" color="textSecondary">
															{item.level}
														</Typography>
													)}
												</Stack>
											</Grid>
											<Grid item xs={12} sm={2}>
												<Stack spacing={1} alignItems="flex-end">
													<Typography variant="h6" sx={{ color: purple[700] }}>
														{t("E£")} {Number(item.price).toFixed(2)}
													</Typography>
													{item.originalPrice && (
														<Typography
															variant="body2"
															sx={{
																textDecoration: "line-through",
																color: grey[500],
															}}>
															{t("E£")} {Number(item.originalPrice).toFixed(2)}
														</Typography>
													)}
													<Stack direction="column" spacing={1}>
														<Button
															variant="text"
															color="error"
															size="small"
															onClick={() => handleRemoveItem(item.id)}>
															{t("Remove")}
														</Button>
														<Button
															variant="text"
															size="small"
															sx={{ color: purple[700] }}>
															{t("Save for later")}
														</Button>
														<Button
															variant="text"
															size="small"
															sx={{ color: purple[700] }}>
															{t("Move to wishlist")}
														</Button>
													</Stack>
												</Stack>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							))}
						</Grid>

						{/* Total and Checkout */}
						<Grid item xs={12} md={4}>
							<Card sx={{ position: "sticky", top: 20 }}>
								<CardContent>
									<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
										{t("Total")}
									</Typography>

									<Typography
										variant="h5"
										sx={{ fontWeight: "bold", color: purple[700] }}>
										{t("E£")} {getCartTotal().toFixed(2)}
									</Typography>

									<Button
										variant="contained"
										fullWidth
										sx={{
											mt: 2,
											backgroundColor: purple[700],
											"&:hover": { backgroundColor: purple[900] },
										}}
										onClick={handleCheckout}
										endIcon={<ArrowForwardIcon />}>
										{t("Checkout")}
									</Button>

									<Typography
										variant="body2"
										sx={{
											color: grey[600],
											mt: 1,
											pb: 2,
											borderBottom: "1px solid",
											borderColor: "divider",
										}}>
										{t("You won't be charged yet")}
									</Typography>

									<Box sx={{ mt: 2 }}>
										<Typography variant="subtitle2" gutterBottom>
											{t("Promotions")}
										</Typography>
										<Stack direction="row" spacing={1}>
											<TextField
												size="small"
												placeholder={t("Enter coupon")}
												value={couponCode}
												onChange={(e) => setCouponCode(e.target.value)}
												fullWidth
											/>
											<Button
												variant="contained"
												size="small"
												sx={{
													backgroundColor: purple[700],
													"&:hover": { backgroundColor: purple[900] },
												}}>
												{t("Apply")}
											</Button>
										</Stack>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</>
			)}
		</Box>
	);
}

export default Cart;
