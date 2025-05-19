import { Box, CircularProgress, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { db, doc, getDoc } from "../Firebase/firebase";

const AuthGuard = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserDataLoading(true);
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
            console.log("Firestore userData:", docSnap.data());
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        } finally {
          setUserDataLoading(false);
        }
      };
      fetchUserData();
    } else {
      setUserData(null);
    }
  }, [user]);

  if (loading || (user && allowedRoles.length > 0 && userDataLoading)) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: "#8000ff",
            mb: 2,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: "#333",
            fontWeight: 500,
          }}
        >
          Loading.....
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // تحقق من الدور بدون حساسية لحالة الحروف
  if (
    allowedRoles.length > 0 &&
    userData?.role &&
    !allowedRoles
      .map((r) => r.toLowerCase())
      .includes(userData.role.toLowerCase())
  ) {
    console.warn(
      "Blocked by AuthGuard. userData.role:",
      userData.role,
      "allowedRoles:",
      allowedRoles
    );
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AuthGuard;
