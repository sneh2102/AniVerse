import { useState,useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const useAuth = () => {
    const { idToken } = useContext(AuthContext);
    
    const fetchUserDetails = async (details) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_GATEWAY}/user/details`, details, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
            });
            console.log('Response:',response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to add user details:', error);
        }
    };

    const addUserDetails = async(details) => {
        try {
            console.log('Details:',details);    
            const response = await axios.post(`${process.env.REACT_APP_API_GATEWAY}/user`, details, 
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to add user details:', error);
        }
    }

    return { addUserDetails, fetchUserDetails };
};

export default useAuth;