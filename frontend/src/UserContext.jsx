// src/UserContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user data

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Assuming the user ID is stored in localStorage

        // Fetch user data
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/user/profile/${userId}`);
                setUser(response.data);
                // const userData = response.data;
                // setUser(userData);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
