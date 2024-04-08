import { AuthContext } from "../Context/AuthContext";
import { useContext, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import LoginSignUp from "../Pages/Login/LoginSignUp";

const ProtectedRoute = () => {
  const { status, setStatus, getSession } = useContext(AuthContext);
  console.log(status);

  return status ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;