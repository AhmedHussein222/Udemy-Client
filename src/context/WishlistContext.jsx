/** @format */

import React, { useState, useContext, useEffect } from "react";
import { db } from "../Firebase/firebase";
import {
	doc,
	getDoc,
	setDoc,
	arrayUnion,
	arrayRemove,
} from "firebase/firestore";
import { UserContext } from "./UserContext";
import { WishlistContext } from "./wishlist-context";

export const WishlistProvider = ({ children }) => {
	const [wishlistItems, setWishlistItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const { user } = useContext(UserContext);

	// Fetch wishlist items from Firestore when user changes
	useEffect(() => {
		const fetchWishlistItems = async () => {
			if (!user) {
				setWishlistItems([]);
				return;
			}

			try {
				setLoading(true);
				const wishlistDoc = await getDoc(doc(db, "Wishlists", user.uid));
				if (wishlistDoc.exists()) {
					const wishlistData = wishlistDoc.data();
					setWishlistItems(wishlistData.items || []);
				} else {
					// Initialize empty wishlist for new users
					await setDoc(doc(db, "Wishlists", user.uid), { items: [] });
					setWishlistItems([]);
				}
			} catch (error) {
				console.error("Error fetching wishlist:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchWishlistItems();
	}, [user]);

	const addToWishlist = async (course) => {
		if (!user) {
			console.log("Please log in to add items to wishlist");
			return false;
		}

		try {
			setLoading(true);
			// Check if course is already in wishlist
			if (!wishlistItems.some((item) => item.id === course.id)) {
				const newItem = {
					id: course.id,
					title: course.title || "Untitled Course",
					price: Number(course.price || 0),
					thumbnail: course.thumbnail || "https://via.placeholder.com/300x200",
					instructor_name:
						course.instructor_name || course.instructor || "Unknown Instructor",
					description: course.description || "",
					rating: course.rating || { rate: 0, count: 0 },
					totalHours: Number(course.totalHours || 0),
					lectures: Number(course.lectures || 0),
					addedAt: new Date().toISOString(),
				};

				// Update Firestore
				await setDoc(
					doc(db, "Wishlists", user.uid),
					{
						items: arrayUnion(newItem),
					},
					{ merge: true }
				);

				// Update local state
				setWishlistItems((prev) => [...prev, newItem]);
				return true; // Successfully added
			}
			return false; // Item already in wishlist
		} catch (error) {
			console.error("Error adding to wishlist:", error);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const removeFromWishlist = async (courseId) => {
		if (!user) return;

		try {
			setLoading(true);
			const itemToRemove = wishlistItems.find((item) => item.id === courseId);
			if (itemToRemove) {
				// Update Firestore
				await setDoc(
					doc(db, "Wishlists", user.uid),
					{
						items: arrayRemove(itemToRemove),
					},
					{ merge: true }
				);

				// Update local state
				setWishlistItems((prev) => prev.filter((item) => item.id !== courseId));
			}
		} catch (error) {
			console.error("Error removing from wishlist:", error);
		} finally {
			setLoading(false);
		}
	};

	const clearWishlist = async () => {
		if (!user) return;

		try {
			setLoading(true);
			// Clear in Firestore
			await setDoc(doc(db, "Wishlists", user.uid), { items: [] });
			// Clear local state
			setWishlistItems([]);
		} catch (error) {
			console.error("Error clearing wishlist:", error);
		} finally {
			setLoading(false);
		}
	};

	const moveToCart = async (course) => {
		if (!user) return false;
		return course;
	};

	const saveForLater = async (course) => {
		if (!user) return false;
		const success = await addToWishlist(course);
		if (success) {
			// The calling component can handle cart removal if needed
			return true;
		}
		return false;
	};

	const value = {
		wishlistItems,
		loading,
		addToWishlist,
		removeFromWishlist,
		clearWishlist,
		moveToCart,
		saveForLater,
	};

	return (
		<WishlistContext.Provider value={value}>
			{children}
		</WishlistContext.Provider>
	);
};
