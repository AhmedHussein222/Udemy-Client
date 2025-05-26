import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase.js";

export async function addOrder(userId, cartItems, total, details) {
  try {
    if (
      !userId ||
      !cartItems ||
      !Array.isArray(cartItems) ||
      !total ||
      !details
    ) {
      throw new Error("Invalid input parameters");
    }

    const orderData = {
      user_id: userId,
      items: cartItems.map((item) => ({
        course_id: item.course_id || item.id,
        title: item.title || "",
        price: Number(item.price) || 0,
        instructor_id: item.instructor_id || "",
        instructor_name: item.instructor_name || "",
        thumbnail: item.thumbnail || "",
      })),
      totalAmount: Number(total) || 0,
      paymentDetails: details || {},
      paymentId: details?.id || "",
      method: "PayPal",
      status: "Completed",
      timestamp: new Date(),
    };

    const orderRef = await addDoc(collection(db, "orders"), orderData);
    return orderRef.id;
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
}

export async function enrollCourse(userid, course) {
  const enrollmentRef = doc(db, "Enrollments", userid);
  const enrollmentSnap = await getDoc(enrollmentRef);

  let existingCourses = [];

  if (enrollmentSnap.exists()) {
    const data = enrollmentSnap.data();
    existingCourses = data.courses || [];
  }

  const alreadyEnrolled = existingCourses.some(
    (existing) => existing.id === course.id
  );

  if (!alreadyEnrolled) {
    const updatedCourses = [...existingCourses, course];

    await setDoc(enrollmentRef, {
      user_id: userid,
      courses: updatedCourses,
      timestamp: new Date(),
    });
  }
}
export async function emptyCart(userid) {
  setDoc(doc(db, "Carts", userid), { items: [] });
}