import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // تأكد من مسار الاستيراد الصحيح

export async function addOrder(user, cartItems, total, details) {
  addDoc(collection(db, "orders"), {
    user_id: user.uid,
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
