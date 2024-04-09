import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../../Utils/UserPool';
import './css/otpVerification.css';
import useAuth from '../../Hooks/useAuth';
import toast from 'react-hot-toast';

const OTPVerification = () => {
  const [otp, setOTP] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const email = location.state.email;
  const displayName = location.state.displayName;
  const { addUserDetails } = useAuth();

  const handleVerifyOTP = () => {
    console.log("email ", email, " otp", otp);
    const user = new CognitoUser({ Username: email, Pool: UserPool });
    user.confirmRegistration(otp, true, (err, data) => {
      if (err) {
        console.error(err);
        toast.error(err.message, {
          style: {
            borderRadius: '10px',
            background: '#33333379',
            color: '#fff',
          },
        });
      } else {
        toast.success('OTP Verified Successfully', {
          style: {
            borderRadius: '10px',
            background: '#33333379',
            backdropFilter: 'blur(100px)',
            color: '#fff',
          },
        });
        addUserDetails({email:email, name:displayName});
        navigate('/')
      }
    });
  };

  const handleOTPChange = (e, index) => {
    const newOTP = otp.split('');
    newOTP[index] = e.target.value;
    setOTP(newOTP.join(''));

    if (e.target.value && index < 5) {
      document.getElementById(`otp${index + 2}`).focus();
    }
  };

  return (
    <div className="otpcontainer">
      <div className="box">
        <h2 className="h2text">Verify OTP</h2>
        {error && <p className="error">{error}</p>}
        <div className="inBox">
          <label htmlFor="otp" className="lable">
            Enter OTP
          </label>
          <div className="otpinput">
            <input
              type="text"
              value={otp[0] || ''}
              onChange={(e) => handleOTPChange(e, 0)}
              className="optinput"
              maxLength={1}
              id="otp1"
            />
            <input
              type="text"
              value={otp[1] || ''}
              onChange={(e) => handleOTPChange(e, 1)}
              className="optinput"
              maxLength={1}
              id="otp2"
            />
            <input
              type="text"
              value={otp[2] || ''}
              onChange={(e) => handleOTPChange(e, 2)}
              className="optinput"
              maxLength={1}
              id="otp3"
            />
            <input
              type="text"
              value={otp[3] || ''}
              onChange={(e) => handleOTPChange(e, 3)}
              className="optinput"
              maxLength={1}
              id="otp4"
            />
            <input
              type="text"
              value={otp[4] || ''}
              onChange={(e) => handleOTPChange(e, 4)}
              className="optinput"
              maxLength={1}
              id="otp5"
            />
            <input
              type="text"
              value={otp[5] || ''}
              onChange={(e) => handleOTPChange(e, 5)}
              className="optinput"
              maxLength={1}
              id="otp6"
            />
          </div>
        </div>
        <button onClick={handleVerifyOTP} className="button">
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;