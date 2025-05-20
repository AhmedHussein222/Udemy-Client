import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

export async function getCategories() {
  try {
    const categoriesCollection = collection(db, "Categories");
    const querySnapshot = await getDocs(categoriesCollection);
    const categories = [];
    querySnapshot.forEach((doc) => categories.push({ ...doc.data() }));
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
export async function getSubcategories(categoryId) {
  try {
    const subcategoriesCollection = collection(db, `SubCategories`);
    const querySnapshot = await getDocs(subcategoriesCollection);

    const subcategories = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.category_id === categoryId) {
        subcategories.push({ ...doc.data() });
      }
    });

    return subcategories;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
}
export async function addCourse(courseData) {
  try {
    let newCourseRef = await setDoc(
      doc(db, "Courses", courseData.course_id),
      courseData
    );
    return newCourseRef;
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
}
export async function addLessons(lessonsData, courseId) {
  const batch = writeBatch(db);
  const lessonsCollection = collection(db, "Lessons");

  const lessonIds = [];
  lessonsData.lessons.forEach((lessonData) => {
    const newLessonRef = doc(lessonsCollection);
    batch.set(newLessonRef, { ...lessonData, course_id: courseId });
    lessonIds.push(newLessonRef.id);
  });

  await batch.commit();
  return lessonIds;
}
export async function deleteLessons(lessonIds) {
  try {
    const batch = writeBatch(db);
    const lessonsCollection = collection(db, "Lessons");

    lessonIds.forEach((id) => {
      const lessonRef = doc(lessonsCollection, id);
      batch.delete(lessonRef);
    });

    await batch.commit();
    alert("Lessons deleted successfully!");
  } catch (error) {
    console.error("Error deleting lessons:", error);
    throw error;
  }
}
export async function deleteCourse(courseId) {
  try {
    const batch = writeBatch(db);
    const coursesCollection = collection(db, "Courses");
    const lessonsCollection = collection(db, "Lessons");

    // البحث عن الكورس باستخدام course_id
    const coursesSnapshot = await getDocs(coursesCollection);
    let courseDocId = null;

    coursesSnapshot.forEach((doc) => {
      if (doc.data().course_id === courseId) {
        courseDocId = doc.id;
      }
    });

    if (!courseDocId) {
      throw new Error("Course not found");
    }

    // حذف الكورس باستخدام معرف المستند
    const courseRef = doc(coursesCollection, courseDocId);
    batch.delete(courseRef);

    // حذف الدروس المرتبطة
    const lessonsSnapshot = await getDocs(lessonsCollection);
    lessonsSnapshot.forEach((doc) => {
      if (doc.data().course_id === courseId) {
        batch.delete(doc.ref);
      }
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
}
export async function geCourseLessons(courseId) {
  try {
    const allLessons = collection(db, "Lessons");

    let lessons = [];
    const snapshot = await getDocs(allLessons);
    snapshot.forEach((doc) => {
      if (doc.data().course_id === courseId) {
        lessons.push({ ...doc.data() });
      }
    });
    return lessons;
  } catch (error) {
    console.error("Error  :", error.message);
    throw error;
  }
}
export async function getInsCourses(instructor) {
  try {
    const allcourses = collection(db, "Courses");

    let courses = [];
    const snapshot = await getDocs(allcourses);
    snapshot.forEach((doc) => {
      if (doc.data().instructor_id === instructor) {
        courses.push({ ...doc.data() });
      }
    });
    return courses;
  } catch (error) {
    console.error("Error  :", error.message);
    throw error;
  }
}
export async function updateCourse(courseId, courseData) {
  try {
    const coursesCollection = collection(db, "Courses");
    const courseRef = doc(coursesCollection, courseId);
    await updateDoc(courseRef, courseData);
    alert("Course updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
}
export async function getInstructorReviews(instructorId) {
  try {
    const coursesCollection = collection(db, "Courses");
    const reviewsCollection = collection(db, "Reviews");
    const usersCollection = collection(db, "Users");

    const [coursesSnapshot, reviewsSnapshot, usersSnapshot] = await Promise.all(
      [
        getDocs(coursesCollection),
        getDocs(reviewsCollection),
        getDocs(usersCollection),
      ]
    );

    let courses = [];
    let reviews = [];

    coursesSnapshot.forEach((doc) => {
      if (doc.data().instructor_id === instructorId) {
        courses.push(doc.data().course_id);
      }
    });

    // Build a map of user_id to user full name
    const userMap = {};
    usersSnapshot.forEach((userDoc) => {
      const user = userDoc.data();
      if (user.user_id) {
        userMap[user.user_id] =
          (user.first_name || "") + " " + (user.last_name || "");
      }
    });

    reviewsSnapshot.forEach((doc) => {
      if (courses.includes(doc.data().course_id)) {
        const data = doc.data();
        reviews.push({
          ...data,
          userName: userMap[data.user_id] ,
        });
      }
    });

    return { reviews };
  } catch (error) {
    console.error("Error fetching instructor reviews:", error);
    throw error;
  }
}
export async function updateLessons(lessonsData) {
  try {
    const batch = writeBatch(db);
    const lessonsCollection = collection(db, "Lessons");

    for (const lesson of lessonsData) {
      const lessonRef = doc(lessonsCollection, lesson.lesson_id);
      const { ...lessonData } = lesson;
      const docSnap = await getDoc(lessonRef);
      if (docSnap.exists()) {
        batch.update(lessonRef, lessonData);
      } else {
        batch.set(lessonRef, lessonData);
      }
    }

    await batch.commit();
    return true;
  } catch (error) {
    return error.message;
  }
}
export async function getCourseById(courseId) {
  try {
    const coursesCollection = collection(db, "Courses");
    const snapshot = await getDocs(coursesCollection);
    let course = null;
    snapshot.forEach((doc) => {
      if (doc.data().course_id === courseId || doc.id === courseId) {
        course = { ...doc.data() };
      }
    });
    return course;
  } catch (error) {
    console.error("Error fetching course by id:", error);
    throw error;
  }
}
export async function getCourseReviews(courseId) {
  try {
    const reviewsCollection = collection(db, "Reviews");
    const usersCollection = collection(db, "Users");

    // Query reviews for this course only
    const reviewsQuery = query(
      reviewsCollection,
      where("course_id", "==", courseId)
    );
    const [reviewsSnapshot, usersSnapshot] = await Promise.all([
      getDocs(reviewsQuery),
      getDocs(usersCollection),
    ]);

    // Build a map of user_id to user full name
    const userMap = {};
    usersSnapshot.forEach((userDoc) => {
      const user = userDoc.data();
      if (user.user_id) {
        userMap[user.user_id] =
          (user.first_name || "") + " " + (user.last_name || "");
      }
    });
    console.log("User Map:", userMap);

    let reviews = [];
    reviewsSnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        ...data,
        userName: userMap[data.user_id] || "Anonymous",
      });
    });
    return reviews;
  } catch (error) {
    console.error("Error fetching course reviews:", error);
    throw error;
  }
}
export async function updateEnrollments(userid, cartItems) {
  const enrollmentRef = doc(db, "Enrollments", userid);
  const enrollmentSnap = await getDoc(enrollmentRef);

  let existingCourses = [];

  if (enrollmentSnap.exists()) {
    const data = enrollmentSnap.data();
    existingCourses = data.courses || [];
  }

  // حذف التكرارات عن طريق ID
  const newCourses = cartItems.filter(
    (item) => !existingCourses.some((existing) => existing.id === item.id)
  );

  const updatedCourses = [...existingCourses, ...newCourses];

  await setDoc(enrollmentRef, {
    user_id: userid,
    courses: updatedCourses,
    timestamp: new Date(),
  });
}
export async function addReview(userId, review) {
  try {
    const reviewsCollection = collection(db, "Reviews");
    const newReviewRef = await addDoc(reviewsCollection, {
      ...review,
      user_id: userId,
      timestamp: new Date(),
    });
    return newReviewRef.id;
  } catch (error) {
    console.error("Error adding review:", error);
  }
}
export async function getInstructorTransactions(instructorId) {
  // 1. Get all courses for this instructor
  const coursesSnapshot = await getDocs(collection(db, "Courses"));
  const instructorCourses = [];
  coursesSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.instructor_id === instructorId) {
      instructorCourses.push({ ...data, id: data.course_id || doc.id });
    }
  });
  const courseIds = instructorCourses.map((c) => c.id);

  // 2. Get all users (for username)
  const usersSnapshot = await getDocs(collection(db, "Users"));
  const userMap = {};
  usersSnapshot.forEach((doc) => {
    const data = doc.data();
    userMap[data.user_id] = (data.first_name || "") + " " + (data.last_name || "");
  });

  // 3. Get all orders
  const ordersSnapshot = await getDocs(collection(db, "orders"));
  const transactions = [];
  ordersSnapshot.forEach((doc) => {
    const order = doc.data();
    const userName = userMap[order.user_id] || "Unknown";
    const status = order.status || "Completed";
    const paymentMethod = order.method || "PayPal";
    const date = order.timestamp?.toDate ? order.timestamp.toDate() : order.timestamp;

    // لكل كورس في الأوردر، لو هو من كورسات الانستراكتور
    (order.items || []).forEach((item) => {
      if (courseIds.includes(item.course_id)) {
        transactions.push({
          date: date,
          amount: item.price,
          transactionId: doc.id,
          paymentMethod: paymentMethod,
          status: status,
          username: userName,
          courseTitle: item.title,
        });
      }
    });
  });

  // ترتيب حسب التاريخ تنازلي
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  return transactions;
}