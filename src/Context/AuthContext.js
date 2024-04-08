import { createContext, useState } from "react";
import Pool from '../Utils/UserPool'
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'

const AuthContext = createContext();

const Auth = (props)=>{
    const [status,setStatus]=useState(false);
    const [idToken,setIdToken]=useState('');

    const getSession = async()=>{
        return await new Promise((resolve,reject)=>{
            const user = Pool.getCurrentUser();
            if(user){
                user.getSession((err,session)=>{
                    if(err){
                        reject();
                    }else{
                        resolve(session);
                        setIdToken(session.idToken.jwtToken);
                        setStatus(true);    
                    }
                });
            }else{
                reject();
            }
        });
    }


    const authenticate=async(Username,Password)=>{
       return await new Promise((resolve,reject)=>{
        console.log(Username,Password);
           const user = new CognitoUser({
               Username,
               Pool
           });
           const authDetails = new AuthenticationDetails({
               Username,
               Password
           });
           user.authenticateUser(authDetails,{
               onSuccess:data=>{
                   console.log('onSuccess:',data);
                   resolve(data);
               },
               onFailure:err=>{
                   reject(err);
               },
               newPasswordRequired:data=>{
                   console.log('newPasswordRequired:',data);
                   resolve(data);
               }
           });
       });
    }

    const logout=async()=>{
        const user = Pool.getCurrentUser();
        if(user){
            user.signOut();
        }
    }
    return(
        <AuthContext.Provider value={{authenticate,getSession,logout,status,setStatus,idToken,setIdToken}}>
        {props.children}
        </AuthContext.Provider>
    )
}
export {Auth,AuthContext}