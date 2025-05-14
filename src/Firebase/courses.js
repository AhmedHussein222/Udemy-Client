import { collection, getDocs } from "firebase/firestore";
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

// Function to get subcategories for a specific category
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
