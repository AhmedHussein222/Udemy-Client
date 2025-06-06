import { initializeApp } from "firebase/app";
import { getFirestore,collection, getDocs , doc, getDoc , setDoc,query, where  } from "firebase/firestore";
import { getAuth , GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyD3YgqrMLxwxt2T7DhsRSd_n3R5AMv1WzE",
  authDomain: "udemy-3d9ed.firebaseapp.com",
  projectId: "udemy-3d9ed",
  storageBucket: "udemy-3d9ed.firebasestorage.app",
  messagingSenderId: "1075601648196",
  appId: "1:1075601648196:web:233e2b1290323f9eb5aa11",
  measurementId: "G-KDQGT7SNCF"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
 const storage = getStorage(app);
export { db,auth,provider,storage, collection, getDocs , doc, getDoc , setDoc,query, where};
