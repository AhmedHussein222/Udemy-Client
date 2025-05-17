import { collection, db, getDocs } from "./firebase";

export async function getUserByEmail(user_email) {
  try {
    const usersCollection = collection(db, "Users");
    const querySnapshot = await getDocs(usersCollection);
    let userData = null;

    querySnapshot.forEach((doc) => {
      if (doc.data().email === user_email) {
        userData = { ...doc.data()};
      }
    });

    return userData;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
}