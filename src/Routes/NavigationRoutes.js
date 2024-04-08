import React, { useEffect,useContext } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../Pages/Login/LoginSignUp.js';
import OTPVerification from '../Pages/Login/otpVerification.js';
import Dashboard from '../Pages/Dashboard/Dashboard.js';
import ProtectedRoute from '../Middleware/Middleware.js';
import VideoUploadForm from '../Pages/Admin/VideoUploadForm.js';
import { AuthContext } from '../Context/AuthContext.js';  

const NavigationRoutes = () => {
  const { status,setStatus,getSession,idToken,setIdToken } = useContext(AuthContext); 

  useEffect(() => {
    getSession().then((session)=>{
      setStatus(true);
      setIdToken(session.idToken.jwtToken);
    }).catch((err)=>{
      console.log('Session Expired:',err);
      setStatus(false);
    });
  }, [])
  return (
    <Router>
          <Routes>
            <Route path="/" element={status?<Dashboard/>:<Login/>} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/dashboard" element={status?<Dashboard />:<Login/>} />
            <Route path="/upload" element={status?<VideoUploadForm />:<Login/>} />
          </Routes>
        </Router>
  )
}

export default NavigationRoutes
