import { addDoc, collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "./firebase";

export async function getCategories() {
  try {
    const categoriesCollection = collection(db, "Categories");
    const querySnapshot = await getDocs(categoriesCollection);
    const categories = [];
    querySnapshot.forEach((doc) =>
      categories.push({  ...doc.data() })
    );
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
        subcategories.push({...doc.data()});
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
    const coursesCollection = collection(db, "Courses");
    const newCourseRef = await addDoc(coursesCollection, courseData);
    alert("Course added successfully!");
    return newCourseRef.id;
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
}
export async function addLessons(lessonsData) {
  try {
    const batch = writeBatch(db);
    const lessonsCollection = collection(db, "Lessons");
    
    const lessonIds = [];
    lessonsData.lessons.forEach((lessonData) => {
      const newLessonRef = doc(lessonsCollection);
      batch.set(newLessonRef, lessonData);
      lessonIds.push(newLessonRef.id);
    });

    await batch.commit();
    alert("Lessons added successfully!");
    return lessonIds;
  } catch (error) {
    console.error("Error adding lessons:", error);
    throw error;
  }
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

    const courseRef = doc(coursesCollection, courseId);
    batch.delete(courseRef);

    const lessonsSnapshot = await getDocs(lessonsCollection);
    lessonsSnapshot.forEach((doc) => {
      if (doc.data().course_id === courseId) {
        batch.delete(doc.ref);
      }
    });

    await batch.commit();
    alert("Course and associated lessons deleted successfully!");
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
}
export async function deleteCoursed(courseId) {
  try {
    const batch = writeBatch(db);
    const coursesCollection = collection(db, "Courses");
    const lessonsCollection = collection(db, "Lessons");

    const courseRef = doc(coursesCollection, courseId);
    batch.delete(courseRef);

    const lessonsSnapshot = await getDocs(lessonsCollection);
    lessonsSnapshot.forEach((doc) => {
      if (doc.data().course_id === courseId) {
        batch.delete(doc.ref);
      }
    });

    await batch.commit();
    alert("Course and associated lessons deleted successfully!");
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
}