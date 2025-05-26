/** @format */

import React, { useState, useEffect } from "react";
import {
	Typography,
	Box,
	CircularProgress,
	Menu,
	MenuItem,
} from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

const NavigationMenu = () => {
		const [categories, setCategories] = useState([]);
		const [selectedCategory, setSelectedCategory] = useState(null);
		const [selectedSubCategory, setSelectedSubCategory] = useState(null);
		const [subCategories, setSubCategories] = useState([]);
		const [courses, setCourses] = useState([]);
		const [loading, setLoading] = useState(true);
		const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
		const [subCategoryMenuAnchor, setSubCategoryMenuAnchor] = useState(null);
		const [courseMenuAnchor, setCourseMenuAnchor] = useState(null);
		const [isMenuHovered, setIsMenuHovered] = useState(false);

		const navigate = useNavigate();

		// Fetch categories when component mounts
		useEffect(() => {
			const fetchCategories = async () => {
				setLoading(true);
				try {
					const querySnapshot = await getDocs(collection(db, "Categories"));
					const categoriesData = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					setCategories(categoriesData);
				} catch (error) {
					console.error("Error fetching categories:", error);
				} finally {
					setLoading(false);
				}
			};
			fetchCategories();
		}, []);

		// Fetch subcategories when selected category changes
		useEffect(() => {
			const fetchSubCategories = async () => {
				if (!selectedCategory?.id) {
					setSubCategories([]);
					return;
				}
				try {
					const q = query(
						collection(db, "SubCategories"),
						where("category_id", "==", selectedCategory.id)
					);
					const snapshot = await getDocs(q);
					const data = snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					setSubCategories(data);
				} catch (error) {
					console.error("Error fetching subcategories:", error);
					setSubCategories([]);
				}
			};
			fetchSubCategories();
		}, [selectedCategory]);

		useEffect(() => {
			const fetchCourses = async () => {
				if (!selectedSubCategory?.id) {
					setCourses([]);
					return;
				}
				try {
					const q = query(
						collection(db, "Courses"),
						where("subcategory_id", "==", selectedSubCategory.id)
					);
					const snapshot = await getDocs(q);
					const data = snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					setCourses(data);
				} catch (error) {
					console.error("Error fetching courses:", error);
					setCourses([]);
				}
			};
			fetchCourses();
		}, [selectedSubCategory]);

		const handleCategoryClick = (event) => {
			event.preventDefault();
			setCategoryMenuAnchor(event.currentTarget);
			setIsMenuHovered(true);
		};

		const handleCategoryMouseEnter = (category, event) => {
			setSelectedCategory(category);
			setSubCategoryMenuAnchor(event.currentTarget);
			setCourseMenuAnchor(null);
			setSelectedSubCategory(null);
			setIsMenuHovered(true);
		};

		const handleSubCategoryMouseEnter = (subCategory, event) => {
			setSelectedSubCategory(subCategory);
			setCourseMenuAnchor(event.currentTarget);
			setIsMenuHovered(true);
		};

		const handleMenuMouseEnter = () => {
			setIsMenuHovered(true);
		};

		const handleMenuMouseLeave = () => {
			setIsMenuHovered(false);
			closeAllMenus();
		};

		const closeAllMenus = () => {
			setCategoryMenuAnchor(null);
			setSubCategoryMenuAnchor(null);
			setCourseMenuAnchor(null);
			setSelectedCategory(null);
			setSelectedSubCategory(null);
			setIsMenuHovered(false);
		};

		const handleNavigate = (pathOrType, id) => {
			if (id) {
				switch (pathOrType) {
					case "category":
						navigate(`/category/${id}`);
						break;
					case "subcategory":
						navigate(`/subcategory/${id}`);
						break;
					case "course":
						navigate(`/course/${id}`);
						break;
					default:
						break;
				}
			}
			closeAllMenus();
		};

		return (
			<Box
				sx={{ position: "relative" }}
				onMouseEnter={handleMenuMouseEnter}
				onMouseLeave={handleMenuMouseLeave}>
				<Typography
					sx={styles.mainLink}
					onClick={handleCategoryClick}>
					Categories
				</Typography>

				<Menu
					anchorEl={categoryMenuAnchor}
					open={Boolean(categoryMenuAnchor) && isMenuHovered}
					onClose={closeAllMenus}
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
					transformOrigin={{ vertical: "top", horizontal: "left" }}
					PaperProps={menuPaperProps}
					MenuListProps={{
						onMouseLeave: handleMenuMouseLeave,
						onMouseEnter: handleMenuMouseEnter,
						sx: { pointerEvents: "auto" },
					}}>
					{loading ? (
						<Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
							<CircularProgress size={24} />
						</Box>
					) : categories.map((category) => (
						<MenuItem
							key={category.id}
							onMouseEnter={(e) => handleCategoryMouseEnter(category, e)}
							onClick={() => handleNavigate("category", category.id)}
							selected={selectedCategory?.id === category.id}
							sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<Typography variant="body1">
								{category.name}
							</Typography>
							<ChevronRightIcon sx={{ ml: 1, color: "#6a6f73" }} />
						</MenuItem>
					))}
				</Menu>

				<Menu
					anchorEl={subCategoryMenuAnchor}
					open={Boolean(subCategoryMenuAnchor) && isMenuHovered}
					onClose={closeAllMenus}
					anchorOrigin={{ vertical: "top", horizontal: "right" }}
					transformOrigin={{ vertical: "top", horizontal: "left" }}
					PaperProps={nestedMenuProps}
					MenuListProps={{
						onMouseLeave: handleMenuMouseLeave,
						onMouseEnter: handleMenuMouseEnter,
						sx: { pointerEvents: "auto" },
					}}>
					{subCategories.map((subCategory) => (
						<MenuItem
							key={subCategory.id}
							onMouseEnter={(e) => handleSubCategoryMouseEnter(subCategory, e)}
							onClick={() => handleNavigate("subcategory", subCategory.id)}
							selected={selectedSubCategory?.id === subCategory.id}
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<Typography variant="body1">
								{subCategory.name}
							</Typography>
							<ChevronRightIcon sx={{ ml: 1, color: "#6a6f73" }} />
						</MenuItem>
					))}
				</Menu>

				<Menu
					anchorEl={courseMenuAnchor}
					open={Boolean(courseMenuAnchor) && isMenuHovered}
					onClose={closeAllMenus}
					anchorOrigin={{ vertical: "top", horizontal: "right" }}
					transformOrigin={{ vertical: "top", horizontal: "left" }}
					PaperProps={courseMenuProps}
					MenuListProps={{
						onMouseLeave: handleMenuMouseLeave,
						onMouseEnter: handleMenuMouseEnter,
						sx: { pointerEvents: "auto" },
					}}>
					{courses.map((course) => (
						<MenuItem
							key={course.id}
							onClick={() => handleNavigate("course", course.id)}
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "flex-start",
								gap: 0.5,
								minWidth: 250,
							}}>
							<Typography variant="subtitle1" noWrap sx={{ width: "100%" }}>
								{course.title}
							</Typography>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1,
									width: "100%",
								}}>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{ flex: 1 }}>
									{course.instructor_name}
								</Typography>
								<Typography variant="caption" color="text.secondary">
									{course.price} EGP
								</Typography>
							</Box>
						</MenuItem>
					))}
				</Menu>
			</Box>
		);
	};

const styles = {
	mainLink: {
		cursor: "pointer",
		px: 1,
		py: 1,
		borderRadius: "4px",
		transition: "0.2s",
		color: "#001a33",
		"&:hover": {
			color: "#8000ff",
			backgroundColor: "#e0ccff",
		},
	},
};

const menuPaperProps = {
	elevation: 3,
	sx: {
		mt: 1,
		backgroundColor: "#fff",
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		"& .MuiList-root": {
			py: 0,
		},
		"& .MuiMenuItem-root": {
			py: 1.5,
			px: 2,
			color: "#1c1d1f",
			transition: "background-color 0.2s ease",
			"&:hover, &.Mui-selected, &.Mui-selected:hover": {
				backgroundColor: "#ede5f9",
				color: "#6e29d2",
				"& .MuiTypography-root": {
					color: "#6e29d2",
				},
				"& .MuiSvgIcon-root": {
					color: "#6e29d2",
				},
			},
			"&.active": {
				backgroundColor: "#ede5f9",
				color: "#6e29d2",
			},
		},
	},
};

const nestedMenuProps = {
	...menuPaperProps,
	sx: {
		...menuPaperProps.sx,
		ml: 0.5,
		"& .MuiMenuItem-root": {
			...menuPaperProps.sx["& .MuiMenuItem-root"],
			minWidth: 200,
		},
	},
};

const courseMenuProps = {
	...menuPaperProps,
	sx: {
		...menuPaperProps.sx,
		ml: 0.5,
		width: 300,
		maxHeight: 400,
		overflow: "auto",
		"& .MuiMenuItem-root": {
			...menuPaperProps.sx["& .MuiMenuItem-root"],
			flexDirection: "column",
			alignItems: "flex-start",
			gap: 0.5,
		},
	},
};

export default NavigationMenu;
