/** @format */

import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, { useState } from "react";

const ExploreMenu = ({
	categories,
	selectedCategory,
	setSelectedCategory,
	subCategories,
	selectedSubCategory,
	setSelectedSubCategory,
	courses,
	handleNavigate,
	closeAllMenus,
	t,
}) => {
	const [categoryAnchor, setCategoryAnchor] = useState(null);
	const [subCategoryAnchor, setSubCategoryAnchor] = useState(null);
	const [courseAnchor, setCourseAnchor] = useState(null);

	const handleExploreClick = (event) => {
		if (categoryAnchor) {
			handleClose();
		} else {
			setCategoryAnchor(event.currentTarget);
		}
	};

	const handleCategoryClick = (category, event) => {
		event.stopPropagation();
		setSelectedCategory(category);
		setSubCategoryAnchor(event.currentTarget);
		setCourseAnchor(null);
		setSelectedSubCategory(null);
	};

	const handleSubCategoryClick = (subCategory, event) => {
		event.stopPropagation();
		setSelectedSubCategory(subCategory);
		setCourseAnchor(event.currentTarget);
	};

	const handleClose = () => {
		setCategoryAnchor(null);
		setSubCategoryAnchor(null);
		setCourseAnchor(null);
		closeAllMenus();
	};

	const handleCourseClick = (courseId) => {
		handleNavigate("course", courseId);
		handleClose();
	};

	const handleViewAllCategory = () => {
		handleNavigate("category", selectedCategory?.id);
		setSubCategoryAnchor(null);
		setCourseAnchor(null);
	};

	const handleViewAllSubCategory = () => {
		handleNavigate("subcategory", selectedSubCategory?.id);
		setCourseAnchor(null);
	};

	return (
		<Box sx={{ position: "relative" }}>
			<Button
				onClick={handleExploreClick}
				sx={{
					color: "#1c1d1f",
					textTransform: "none",
					fontWeight: "bold",
					px: 2,
					py: 1,
					bgcolor: categoryAnchor ? "#f7f9fa" : "transparent",
					"&:hover": {
						backgroundColor: "#f7f9fa",
					},
				}}>
				{t("Explore")}
			</Button>

			{/* Categories Menu */}
			<Menu
				anchorEl={categoryAnchor}
				open={Boolean(categoryAnchor)}
				onClose={handleClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				transformOrigin={{ vertical: "top", horizontal: "left" }}
				PaperProps={menuPaperProps}>
				{categories.map((category) => (
					<MenuItem
						key={category.id}
						onClick={(e) => handleCategoryClick(category, e)}
						selected={selectedCategory?.id === category.id}
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							minWidth: 200,
						}}>
						<Typography variant="body1">{category.name}</Typography>
						<ChevronRightIcon sx={{ ml: 1, color: "#6a6f73" }} />
					</MenuItem>
				))}
			</Menu>

			{/* SubCategories Menu */}
			<Menu
				anchorEl={subCategoryAnchor}
				open={Boolean(subCategoryAnchor) && subCategories.length > 0}
				onClose={() => setSubCategoryAnchor(null)}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "left" }}
				PaperProps={menuPaperProps}>
				{/* View All Category Option */}
				<MenuItem
					onClick={handleViewAllCategory}
					sx={{
						borderBottom: "1px solid #e5e7eb",
						color: "#8000ff",
						fontWeight: "bold",
					}}>
					{t("View all")} {selectedCategory?.name}
				</MenuItem>

				{/* SubCategories List */}
				{subCategories.map((subCategory) => (
					<MenuItem
						key={subCategory.id}
						onClick={(e) => handleSubCategoryClick(subCategory, e)}
						selected={selectedSubCategory?.id === subCategory.id}
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							minWidth: 200,
						}}>
						<Typography variant="body1">{subCategory.name}</Typography>
						<ChevronRightIcon sx={{ ml: 1, color: "#6a6f73" }} />
					</MenuItem>
				))}
			</Menu>

			{/* Courses Menu */}
			<Menu
				anchorEl={courseAnchor}
				open={Boolean(courseAnchor)}
				onClose={() => setCourseAnchor(null)}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "left" }}
				PaperProps={courseMenuProps}>
				{/* View All SubCategory Option */}
				<MenuItem
					onClick={handleViewAllSubCategory}
					sx={{
						borderBottom: "1px solid #e5e7eb",
						color: "#8000ff",
						fontWeight: "bold",
					}}>
					{t("View all")} {selectedSubCategory?.name}
				</MenuItem>

				{/* Courses List */}
				{courses.map((course) => (
					<MenuItem
						key={course.id}
						onClick={() => handleCourseClick(course.id)}
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
							gap: 0.5,
							minWidth: 250,
						}}>
						<Typography variant="subtitle1" noWrap>
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
								{course.instructor}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								{course.price} {t("EGP")}
							</Typography>
						</Box>
					</MenuItem>
				))}
			</Menu>
		</Box>
	);
};

// Styles
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
			"&:hover": {
				backgroundColor: "#f7f9fa",
				"& .MuiTypography-root": {
					color: "#8000ff",
				},
				"& .MuiSvgIcon-root": {
					color: "#8000ff",
				},
			},
			"&.Mui-selected": {
				backgroundColor: "#f7f9fa",
				"& .MuiTypography-root": {
					color: "#8000ff",
				},
				"& .MuiSvgIcon-root": {
					color: "#8000ff",
				},
			},
		},
	},
};

const courseMenuProps = {
	...menuPaperProps,
	sx: {
		...menuPaperProps.sx,
		ml: 0.5,
		"& .MuiMenuItem-root": {
			...menuPaperProps.sx["& .MuiMenuItem-root"],
			"&:not(:first-child)": {
				flexDirection: "column",
				alignItems: "flex-start",
				gap: 0.5,
			},
		},
	},
};

export default ExploreMenu;
