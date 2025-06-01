/** @format */

import {
	Box,
	CircularProgress,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, { useState, useRef, useEffect } from "react";

const ExploreMenu = ({
	categories,
	selectedCategory,
	setSelectedCategory,
	subCategories,
	selectedSubCategory,
	setSelectedSubCategory,
	courses,
	isLoading,
	isMenuHovered,
	setIsMenuHovered,
	handleNavigate,
	closeAllMenus,
	t,
}) => {
	const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
	const [subCategoryMenuAnchor, setSubCategoryMenuAnchor] = useState(null);
	const [courseMenuAnchor, setCourseMenuAnchor] = useState(null);
	const hoverTimeoutRef = useRef(null);

	// التأكد من تحديث subCategoryMenuAnchor بناءً على selectedCategory
	useEffect(() => {
		if (selectedCategory && categoryMenuAnchor && subCategories.length > 0) {
			setSubCategoryMenuAnchor(categoryMenuAnchor); // استخدام categoryMenuAnchor كـ anchor
		} else {
			setSubCategoryMenuAnchor(null);
		}
	}, [selectedCategory, subCategories, categoryMenuAnchor]);

	const handleCategoryClick = (event) => {
		event.preventDefault();
		setCategoryMenuAnchor(event.currentTarget);
		setIsMenuHovered(true);
	};

	const handleCategoryMouseEnter = (category) => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}

		hoverTimeoutRef.current = setTimeout(() => {
			setSelectedCategory(category);
			setCourseMenuAnchor(null);
			setSelectedSubCategory(null);
			setIsMenuHovered(true);
		}, 100);
	};

	const handleSubCategoryMouseEnter = (subCategory, event) => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}

		hoverTimeoutRef.current = setTimeout(() => {
			setSelectedSubCategory(subCategory);
			setCourseMenuAnchor(event.currentTarget);
			setIsMenuHovered(true);
		}, 100);
	};

	const handleMenuMouseEnter = () => {
		setIsMenuHovered(true);
	};

	const handleMenuMouseLeave = () => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
		}

		hoverTimeoutRef.current = setTimeout(() => {
			setIsMenuHovered(false);
			closeAllMenus();
			setCategoryMenuAnchor(null);
			setSubCategoryMenuAnchor(null);
			setCourseMenuAnchor(null);
		}, 200);
	};

	return (
		<Box
			sx={{ position: "relative" }}
			onMouseEnter={handleMenuMouseEnter}
			onMouseLeave={handleMenuMouseLeave}>
			<Typography onClick={handleCategoryClick} sx={linkStyle}>
				{t("Explore")}
			</Typography>
			<Box
				sx={{
					display: "flex",
					position: "absolute",
					top: "100%",
					left: 0,
					zIndex: 1300,
				}}>
				<Menu
					anchorEl={categoryMenuAnchor}
					open={Boolean(categoryMenuAnchor) && isMenuHovered}
					onClose={closeAllMenus}
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
					transformOrigin={{ vertical: "top", horizontal: "left" }}
					PaperProps={menuPaperProps}>
					{isLoading ? (
						<Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
							<CircularProgress size={24} />
						</Box>
					) : categories.length > 0 ? (
						categories.map((category) => (
							<MenuItem
								key={category.id}
								onMouseEnter={(e) => handleCategoryMouseEnter(category, e)}
								onClick={() => handleNavigate("category", category.id)}
								selected={selectedCategory?.id === category.id}
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}>
								<Typography variant="body1">{category.name}</Typography>
								<ChevronRightIcon sx={{ ml: 1, color: "#6a6f73" }} />
							</MenuItem>
						))
					) : (
						<MenuItem disabled>
							<Typography variant="body1">
								{t("No categories available")}
							</Typography>
						</MenuItem>
					)}
				</Menu>
				<Menu
					anchorEl={subCategoryMenuAnchor}
					open={
						Boolean(subCategoryMenuAnchor) &&
						isMenuHovered &&
						subCategories.length > 0
					}
					onClose={closeAllMenus}
					anchorOrigin={{ vertical: "top", horizontal: "right" }}
					transformOrigin={{ vertical: "top", horizontal: "left" }}
					PaperProps={nestedMenuProps}>
					{isLoading ? (
						<Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
							<CircularProgress size={24} />
						</Box>
					) : subCategories.length > 0 ? (
						subCategories.map((subCategory) => (
							<MenuItem
								key={subCategory.id}
								onMouseEnter={(e) =>
									handleSubCategoryMouseEnter(subCategory, e)
								}
								onClick={() => handleNavigate("subcategory", subCategory.id)}
								selected={selectedSubCategory?.id === subCategory.id}
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}>
								<Typography variant="body1">{subCategory.name}</Typography>
								<ChevronRightIcon sx={{ ml: 1, color: "#6a6f73" }} />
							</MenuItem>
						))
					) : (
						<MenuItem disabled>
							<Typography variant="body1">
								{t("No subcategories available")}
							</Typography>
						</MenuItem>
					)}
				</Menu>
				<Menu
					anchorEl={courseMenuAnchor}
					open={Boolean(courseMenuAnchor) && isMenuHovered}
					onClose={closeAllMenus}
					anchorOrigin={{ vertical: "top", horizontal: "right" }}
					transformOrigin={{ vertical: "top", horizontal: "left" }}
					PaperProps={courseMenuProps}>
					{isLoading ? (
						<Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
							<CircularProgress size={24} />
						</Box>
					) : courses.length > 0 ? (
						courses.map((course) => (
							<MenuItem
								key={course.id}
								onClick={() => handleNavigate("course", course.id)}
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "flex-start",
									gap: 0.5,
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
										{course.instructor_name}
									</Typography>
									<Typography variant="caption" color="text.secondary">
										{course.price} {t("EGP")}
									</Typography>
								</Box>
							</MenuItem>
						))
					) : (
						<MenuItem disabled>
							<Typography variant="body1">
								{t("No courses available")}
							</Typography>
						</MenuItem>
					)}
				</Menu>
			</Box>
		</Box>
	);
};

// Styles
const linkStyle = {
	cursor: "pointer",
	px: 1,
	py: 1,
	borderRadius: "4px",
	transition: "0.2s",
	color: "#1c1d1f",
	"&:hover": {
		color: "#8000ff",
		backgroundColor: "#e0ccff",
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

export default ExploreMenu;
