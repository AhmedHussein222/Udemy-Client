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
import { CartContext } from "./cart-context";
import { warningModal } from "../services/swal";

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const { user } = useContext(UserContext);

	// Fetch cart items from Firestore when user changes
	useEffect(() => {
		const fetchCartItems = async () => {
			if (!user) {
				setCartItems([]);
				return;
			}

			try {
				setLoading(true);
				const cartDoc = await getDoc(doc(db, "Carts", user.uid));
				if (cartDoc.exists()) {
					const cartData = cartDoc.data();
					setCartItems(cartData.items || []);
				} else {
					// Initialize empty cart for new users
					await setDoc(doc(db, "Carts", user.uid), { items: [] });
					setCartItems([]);
				}
			} catch (error) {
				console.error("Error fetching cart:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCartItems();
	}, [user]);

	const addToCart = async (course) => {
		if (!user) {
			warningModal()
			return false;
		}

		try {
			setLoading(true);
			// Check if course is already in cart
			if (!cartItems.some((item) => item.id === course.id)) {
				const newItem = {
					id: course.id,
					title: course.title,
					price: course.price,
					thumbnail: course.thumbnail,
					instructor_name: course.instructor_name,
					description: course.description,
					rating: course.rating,
					totalHours: Number(course.totalHours || 0),
					lectures: Number(course.lectures || 0),
					addedAt: new Date().toISOString(),
				};

				// Update Firestore
				await setDoc(
					doc(db, "Carts", user.uid),
					{
						items: arrayUnion(newItem),
					},
					{ merge: true }
				);

				// Update local state
				setCartItems((prev) => [...prev, newItem]);
				return true; // Successfully added
			}
			return false; // Item already in cart
		} catch (error) {
			console.error("Error adding to cart:", error);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const removeFromCart = async (courseId) => {
		if (!user) return;

		try {
			setLoading(true);
			const itemToRemove = cartItems.find((item) => item.id === courseId);
			if (itemToRemove) {
				// Update Firestore
				await setDoc(
					doc(db, "Carts", user.uid),
					{
						items: arrayRemove(itemToRemove),
					},
					{ merge: true }
				);

				// Update local state
				setCartItems((prev) => prev.filter((item) => item.id !== courseId));
			}
		} catch (error) {
			console.error("Error removing from cart:", error);
		} finally {
			setLoading(false);
		}
	};

	const clearCart = async () => {
		if (!user) return;

		try {
			setLoading(true);
			// Clear in Firestore
			await setDoc(doc(db, "Carts", user.uid), { items: [] });
			// Clear local state
			setCartItems([]);
		} catch (error) {
			console.error("Error clearing cart:", error);
		} finally {
			setLoading(false);
		}
	};

	const getCartTotal = () => {
		return cartItems.reduce((total, item) => total + Number(item.price), 0);
	};

	const value = {
		cartItems,
		loading,
		addToCart,
		removeFromCart,
		clearCart,
		getCartTotal,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
