// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// import { getFirestore,collection, getDocs , doc, getDoc } from "firebase/firestore";
// const firebaseConfig = {
//   apiKey: "AIzaSyD3YgqrMLxwxt2T7DhsRSd_n3R5AMv1WzE",
//   authDomain: "udemy-3d9ed.firebaseapp.com",
//   projectId: "udemy-3d9ed",
//   storageBucket: "udemy-3d9ed.firebasestorage.app",
//   messagingSenderId: "1075601648196",
//   appId: "1:1075601648196:web:233e2b1290323f9eb5aa11",
//   measurementId: "G-KDQGT7SNCF"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// // const analytics = getAnalytics(app);
// export { db, collection, getDocs , doc, getDoc };

// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import auth

const firebaseConfig = {
  apiKey: "AIzaSyD3YgqrMLxwxt2T7DhsRSd_n3R5AMv1WzE",
  authDomain: "udemy-3d9ed.firebaseapp.com",
  projectId: "udemy-3d9ed",
  storageBucket: "udemy-3d9ed.firebasestorage.app",
  messagingSenderId: "1075601648196",
  appId: "1:1075601648196:web:233e2b1290323f9eb5aa11",
  measurementId: "G-KDQGT7SNCF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize auth

export { db, auth, collection, getDocs, doc, getDoc };
