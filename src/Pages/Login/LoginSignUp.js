import React, { useEffect, useState, useContext }  from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import UserPool from '../../Utils/UserPool'
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'
import './css/login.css'
import toast from 'react-hot-toast'
import { AuthContext } from '../../Context/AuthContext'
import useAuth from '../../Hooks/useAuth'


const LoginSignUp = () => {
  const { authenticate,setStatus } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [Login, setLogin] = useState(true)
  const {addUserDetails} = useAuth()
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const [signUpData, setSignUpData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })



  const handleLoginData = async (e) => {
    e.preventDefault();
  
    try {
      const data = await authenticate(loginData.email, loginData.password);
      console.log(data);
  
      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve('Login Success');
            navigate('/dashboard');
          }, 3000);
        }),
        {
          loading: 'Authenticating...',
          success: 'Login Success',
          error: 'Login Failed',
        },
        {

          style: {
            borderRadius: '10px',
            background: '#333',
            backdropFilter: 'blur(10px)',
            color: '#fff',
          }
        },
      );
      await navigate('/');
      await window.localStorage.setItem('email',loginData.email);
      await setStatus(true);
    } catch (err) {
      toast.error(err.message, {
        style: {
          borderRadius: '10px',
          background: '#33333379',
          backdropFilter: 'blur(10px)',
          color: '#fff',
        },
      });
    }
  };

  const handleSignUpData = (e) => {
    setSignUpData({...signUpData, [e.target.name]: e.target.value})
    console.log(signUpData);
    if(signUpData.displayName === '' || signUpData.email === '' || signUpData.password === '' || signUpData.confirmPassword === '') {
      toast.error('All fields are required', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      })
      return
    }
    if(signUpData.password !== signUpData.confirmPassword) {
      toast.error('Passwords do not match', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      })
      return
    }

    UserPool.signUp(signUpData.email, signUpData.password, [], null, (err, data) => {
      if(err) toast.error(err.message,{
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      })
      else {

        toast.success('User Created Successfully', {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          }
        })
        // addUserDetails({email: signUpData.email, name: signUpData.displayName})
        navigate('/otp-verification',
        { state: { email: signUpData.email, name: signUpData.displayName } }
        )
      }
    })      
  }


  return (
    <div className="container">
      {Login ? <>
        <form className='login-card'>
        <p>Welcome to <br/> <span className='flicker'>Aniverse</span></p>
        
        <input type="email" placeholder="Email" onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} value={loginData.email}/><br/>
        <input type="password" placeholder="Password" onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} value={loginData.password}/><br/>
        <input type="button" value="Sign in" onClick={handleLoginData}/><br/>
        <a href="#">Forgot Password?</a> <br/>
        <a href='#' onClick={()=>setLogin(false)} >Create an Account</a> 
        </form>
      </>
      :
<>
    <form className='signin-Card'>
    <p>Welcome to <br/> <span className='flicker'>Aniverse</span></p>
    <input type="text" placeholder="Display Name" onChange={(e) => setSignUpData({ ...signUpData, displayName: e.target.value })} value={signUpData.displayName}/><br/>
    <input type="email" placeholder="Email" onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })} value={signUpData.email}/><br/>
    <input type="password" placeholder="Password" onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })} value={signUpData.password}/><br/>
    <input type="password" placeholder="Confirm Password" onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })} value={signUpData.confirmPassword}/><br/>
    <input type="button" value="Sign Up" onClick={handleSignUpData}/><br/>
    <a href="#" onClick={()=>{setLogin(true)}}>Already have an account. Login</a>
    </form>
</>
}
    <div className="drops">
    <div className="drop drop-1"></div>
    <div className="drop drop-2"></div>
    <div className="drop drop-3"></div>
    <div className="drop drop-4"></div>
    <div className="drop drop-5"></div>
    
  </div>
    </div>
  )
}

export default LoginSignUp
