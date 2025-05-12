import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Components/Home/Home';
import Cart from './Components/Cart/Cart';
import Signup from './Components/SignUpStudents/Signup';
import Login from './Components/LoginUsers/Login';
import InsSignup from './Components/InstructorSignup/InsSignup';
import Career from './HomeComponents/Career/Career'
// import Welcomehome from './Components/InstructorSignup/welcomehome';
import Sidebar from './Components/InstructorSignup/components/Drawer/sidebar';
import CreateCourse from './Components/InstructorSignup/components/CreateCourse/createcourse';
import Userprofile from './Components/Userprofile/userprofile';
import { UserProvider } from './context/UserContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase/firebase';


function App() {
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      console.log("User logged in", firebaseUser);
    } else {
      console.log("User not logged in");
    }
  });

  return () => unsubscribe();
}, []);

  return (
       <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route index element={<Welcomehome />} />  */}
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="instructor-signup" element={<InsSignup />} />
          <Route path="sidebar" element={<Sidebar />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="career-accelerators" element={<Career />} />
          <Route path="Userprofile" element={<Userprofile />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </UserProvider>
  );
}

export default App;