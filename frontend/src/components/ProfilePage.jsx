import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import the Sidebar component
import '../styles/ProfilePage.css'

function ProfilePage() {
    const [user, setUser] = useState(null); // Store user data
    const userId = localStorage.getItem('userId'); // Assuming the user ID is stored in localStorage

    useEffect(() => {
        // Fetch user data
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/user/profile/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-page">
        <Sidebar username={user.username} />
        <div className="profile-content">
            <h1>{user.username}</h1>
            <p>{user.school} - {user.year}</p>
            <p>{user.classes.join(', ')}</p>
            <div>
                {user.classes.length > 0 ? (
                    user.classes.map((session, index) => (
                        <div key={index} className="session-card">
                            <p>{session}</p>
                        </div>
                    ))
                ) : (
                    <p>No Session History So Far</p>
                )}
            </div>
            <button className="upload-button">Upload Profile Picture</button>
        </div>
    </div>
    );
}

export default ProfilePage;
