import { useState,useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';

const useVideo = () => {
    const { idToken } = useContext(AuthContext);
    
    const fetchVideos = async () => {
        try {
            console.log('ID Token:',idToken);
            const response = await axios.post(`${process.env.REACT_APP_API_GATEWAY}/videos`,{},{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
            }
        });
            return response.data.body.result.Items;
        } catch (error) {
            console.error('Failed to fetch user details:', error);
        }
    };

    const addVideo = async(details) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_GATEWAY}/videos/upload`, details, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to add user details:', error);
        }
    }

    const searchVideo = async(details) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_GATEWAY}/videos/search`, details, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to add user details:', error);
        }
    }

    return { addVideo, fetchVideos,searchVideo};
};

export default useVideo;