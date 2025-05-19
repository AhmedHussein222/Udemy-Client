import { doc, getDoc, db } from "./firebase";

export async function getUserById(userId) {
  try {
    const userDoc = doc(db, "Users", userId);
    const docSnap = await getDoc(userDoc);

      return { ...docSnap.data() };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}
