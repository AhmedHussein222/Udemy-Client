/** @format */

import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Grid,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import React, { useState } from "react";
import { green, grey } from "@mui/material/colors";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../Firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { Snackbar } from "@mui/material";
import { useTranslation } from "react-i18next";

function Signup() {
	const [firebaseError, setFirebaseError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			fullname: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data) => {
		setLoading(true);
		setFirebaseError("");

		try {
			const methods = await fetchSignInMethodsForEmail(auth, data.email);
			if (methods.length > 0) {
				setFirebaseError("This email is already registered.");
				setLoading(false);
				return;
			}

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				data.email,
				data.password
			);

			const [first_name, last_name] = data.fullname.trim().split(" ");
			const user = userCredential.user;
			await setDoc(doc(db, "Users", user.uid), {
				first_name,
				last_name: last_name || "",
				email: data.email,
				password: data.password, 
				createdAt: new Date(),
				role: "student",
				user_id: user.uid, 
			});

			setSnackbarMessage("Registration successful! Redirecting...");
			setOpenSnackbar(true);

			setTimeout(() => {
				navigate("/Userprofile");
			}, 2000);
		} catch (error) {
			console.error("Signup error:", error.message);
			setFirebaseError(error.message);
		}

		setLoading(false);
	};

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const { t } = useTranslation();

	return (
		<Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
			<Snackbar
				open={openSnackbar}
				autoHideDuration={5000}
				onClose={handleCloseSnackbar}
				message={snackbarMessage}
				anchorOrigin={{
					vertical: "top",
					horizontal: "center",
					color: green[500],
				}}
			/>
			<Grid
				container
				spacing={4}
				alignItems="center"
				justifyContent={"space-around"}>
				<Grid item xs={12} lg={6} sx={{ textAlign: "center" }}>
					<Box
						component="img"
						src="https://frontends.udemycdn.com/components/auth/desktop-illustration-x1.webp"
						alt="Illustration"
						sx={{
							width: "100%",
							maxWidth: 600,
							height: "auto",
							mx: "auto",
						}}
					/>
				</Grid>

				<Grid item xs={12} lg={6}>
					<Box sx={{ maxWidth: 500, mx: "auto", px: 2 }}>
						<Typography
							variant="h4"
							gutterBottom
							fontWeight="bold"
							textAlign="center">
							{t("Sign up with email")}
						</Typography>

						<form onSubmit={handleSubmit(onSubmit)}>
							<Stack spacing={2}>
								<TextField
									fullWidth
									size="medium"
									label={t("Fullname")}
									variant="outlined"
									{...register("fullname", { required: true, maxLength: 20 })}
								/>
								{errors.fullname?.type === "required" && (
									<Typography color="error">
										{t("Fullname is required.")}
									</Typography>
								)}

								<TextField
									fullWidth
									size="medium"
									label={t("Email")}
									variant="outlined"
									{...register("email", {
										required: true,
										pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
									})}
								/>
								{errors.email?.type === "required" && (
									<Typography color="error">
										{t("Email is required.")}
									</Typography>
								)}
								{errors.email?.type === "pattern" && (
									<Typography color="error">
										{t("Email is not valid.")}
									</Typography>
								)}

								<TextField
									fullWidth
									size="medium"
									label={t("Password")}
									type="password"
									variant="outlined"
									{...register("password", {
										required: "Password is required",
										minLength: {
											value: 6,
											message: "Password must be at least 6 characters",
										},
									})}
								/>
								{errors.password?.type === "required" && (
									<Typography color="error">
										{t("Password is required.")}
									</Typography>
								)}
								{errors.password?.type === "minLength" && (
									<Typography color="error">
										{t("Password must be at least 6 characters.")}
									</Typography>
								)}

								<FormGroup>
									<FormControlLabel
										control={<Checkbox />}
										label={t(
											"Send me special offers, personalized recommendations, and learning tips."
										)}
									/>
								</FormGroup>

								<Button
									type="submit"
									fullWidth
									variant="contained"
									startIcon={<MailOutlineIcon fontSize="small" />}
									sx={{
										backgroundColor: "#8000ff",
										color: "#fff",
										textTransform: "none",
										fontWeight: "bold",
										borderRadius: "4px",
										py: 1.2,
										mt: 1,
										"&:hover": { backgroundColor: "#6a1b9a" },
									}}
									disabled={loading}>
									{loading ? t("Loading...") : t("Continue with email")}
								</Button>
								{firebaseError && (
									<Typography color="error" textAlign="center">
										{firebaseError}
									</Typography>
								)}
							</Stack>
						</form>

						<Typography
							variant="body1"
							align="center"
							sx={{ mt: 4, fontWeight: "bold" }}>
							{t("Other sign up options")}
						</Typography>

						<Stack
							direction="row"
							gap={2}
							justifyContent="center"
							mt={2}
							mb={3}>
							<Button
								variant="outlined"
								sx={{
									textTransform: "none",
									display: "flex",
									alignItems: "center",
									gap: 1,
									px: 2,
									py: 1,
									borderRadius: "8px",
									borderColor: "#8000ff",
								}}>
								<img
									src="https://static.cdnlogo.com/logos/g/38/google-icon.svg"
									alt="Google"
									style={{ width: 20, height: 20 }}
								/>
							</Button>

							<Button
								variant="outlined"
								sx={{
									textTransform: "none",
									display: "flex",
									alignItems: "center",
									gap: 1,
									px: 2,
									py: 1,
									borderRadius: "8px",
									borderColor: "#8000ff",
								}}>
								<img
									src="https://i.pinimg.com/736x/42/75/49/427549f6f22470ff93ca714479d180c2.jpg"
									alt="Facebook"
									style={{ width: 20, height: 20 }}
								/>
							</Button>

							<Button
								variant="outlined"
								sx={{
									textTransform: "none",
									display: "flex",
									alignItems: "center",
									gap: 1,
									px: 2,
									py: 1,
									borderRadius: "8px",
									borderColor: "#8000ff",
								}}>
								<img
									src="https://pixsector.com/cache/56f2646e/avd5cee2ff5ea9da4d328.png"
									alt="Apple"
									style={{ width: 20, height: 20 }}
								/>
							</Button>
						</Stack>

						<Typography variant="subtitle2" align="center" sx={{ mb: 3 }}>
							{t("By signing up, you agree to our")}{" "}
							<a href="#" style={{ color: "#8000ff" }}>
								{t("Terms of Use")}
							</a>{" "}
							{t("and")}{" "}
							<a href="#" style={{ color: "#8000ff" }}>
								{t("Privacy Policy")}
							</a>
							.
						</Typography>

						<Box
							sx={{
								p: 2,
								backgroundColor: grey[100],
								textAlign: "center",
								borderRadius: 1,
							}}>
							<Typography variant="body2">
								{t("Already have an account?")}{" "}
								<Link
									to="/Login"
									style={{ color: "#8000ff", fontWeight: "bold" }}>
									{t("Login")}
								</Link>
							</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}

export default Signup;
