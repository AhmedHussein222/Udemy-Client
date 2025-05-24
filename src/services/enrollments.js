import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase.js";

export async function addOrder(userId, cartItems, total, details) {
  addDoc(collection(db, "orders"), {
    user_id: userId,
    items: cartItems.map((item) => ({
      course_id: item.id,
      title: item.title,
      price: item.price,
    })),
    totalAmount: total,
    paymentDetails: details,
    paymentId: details.id,
    method: "PayPal",
    timestamp: new Date(),
  });
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

export const getEnrolledCourses = async (userId) => {
  try {
    const enrolledRef = doc(db, "Enrollments", userId);
    const enrolledDoc = await getDoc(enrolledRef);

    if (!enrolledDoc.exists()) {
      return [];
    }

    const enrolledData = enrolledDoc.data();
    const courses = enrolledData.courses || [];

    // استخراج معرفات الكورسات فقط
    const courseIds = courses
      .filter((course) => course && course.course_id)
      .map((course) => course.course_id);

    return courseIds;
  } catch (error) {
    console.error("Error in getEnrolledCourses:", error);
    throw error;
  }
};
