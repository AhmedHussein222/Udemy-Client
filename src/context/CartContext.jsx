/** @format */

import {
	arrayRemove,
	arrayUnion,
	doc,
	getDoc,
	setDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../Firebase/firebase";
import { warningModal } from "../services/swal";
import { UserContext } from "./UserContext";
import { CartContext } from "./cart-context";
import { enrollCourse } from "../services/enrollments";

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
			warningModal(
				"Warning",
				"You need to be logged in to add courses to cart"
			);
			return false;
		}

		try {
			setLoading(true);
			// For free courses, enroll directly
			if (course.price === 0) {
				await enrollCourse(user.uid, {
					...course,
					enrolled_at: new Date(),
					progress: 0,
					completed_lessons: [],
					last_accessed: new Date(),
				});
				return true;
			}

			// For paid courses, add to cart if not already there
			if (!cartItems.some((item) => item.id === course.id)) {
				const newItem = {
					id: course.id,
					title: course.title,
					price: Number(course.price) || 0,
					thumbnail: course.thumbnail,
					instructor_name: course.instructor_name || "Unknown Instructor",
					description: course.description || "",
					rating: course.rating || { rate: 0, count: 0 },
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
			await setDoc(doc(db, "Carts", user.uid), { items: [] });
			setCartItems([]);
			return true;
		} catch (error) {
			console.error("Error clearing cart:", error);
			throw error;
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
