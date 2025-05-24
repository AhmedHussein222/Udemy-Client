import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";
export const getYouTubeEmbedUrl = (url) => {
  try {
    const urlObj = new URL(url);
    let videoId = urlObj.searchParams.get("v");
    if (!videoId && url.includes("youtu.be")) {
      videoId = url.split("/").pop().split("?")[0];
    }
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?controls=1`
      : null;
  } catch {
    return null;
  }
};

export async function becomeInstructor(email, password) {
  try {
    const usersRef = collection(db, "Users");
    const q = query(
      usersRef,
      where("email", "==", email),
      where("password", "==", password)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error("User not found in database");
    }
    const userDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, "Users", userDoc.id), {
      role: "instructor",
    });
    return true;
  } catch (error) {
    console.error("Error becoming instructor:", error);
    throw error;
  }
}
