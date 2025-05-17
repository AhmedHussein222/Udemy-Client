import { addDoc, collection, doc, getDocs, updateDoc, writeBatch } from "firebase/firestore";
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
    return newCourseRef.id;
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
}
export async function addLessons(lessonsData , courseId) {
    const batch = writeBatch(db);
    const lessonsCollection = collection(db, "Lessons");
    
    const lessonIds = [];
    lessonsData.lessons.forEach((lessonData) => {
      const newLessonRef = doc(lessonsCollection);
      batch.set(newLessonRef, {...lessonData, course_id: courseId});
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

    let lessons =  []
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

    let courses =  []
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

    const coursesSnapshot = await getDocs(coursesCollection);
    const reviewsSnapshot = await getDocs(reviewsCollection);

    let courses = [];
    let reviews = [];

    coursesSnapshot.forEach((doc) => {
      if (doc.data().instructor_id === instructorId) {
        courses.push( doc.data().course_id);
      }
    });

    reviewsSnapshot.forEach((doc) => {
      if (courses.includes( doc.data().course_id) ) {
        reviews.push({ ...doc.data() });
      }
      
    });

    return {  reviews };
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
      const lessonRef = doc(lessonsCollection, lesson.id);
      const {...lessonData } = lesson; 
      batch.update(lessonRef, lessonData);
    }

    await batch.commit();
    return true;
  } catch (error) {
    return error.message
  }
}



