import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import the Sidebar component
import '../styles/ProfilePage.css';

function ProfilePage() {
    const [user, setUser] = useState(null); // Store user data
    const [sessions, setSessions] = useState([]); // Store user sessions
    const userId = localStorage.getItem('userId'); // Assuming the user ID is stored in localStorage
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        // Fetch user data and sessions
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/user/profile/${userId}`);
                setUser(response.data);

                // Fetch the user's sessions
                const sessionResponse = await axios.get(`http://localhost:5001/sessions/user/sessions/${userId}`);
                setSessions(sessionResponse.data.sessions);
            } catch (error) {
                console.error('Error fetching user profile or sessions:', error);
            }
        };

        fetchUserProfile();
    }, [userId]);

    const formatTime = (timeString) => {
        const [hour, minute] = timeString.split(':');
        const hourInt = parseInt(hour, 10);
        const ampm = hourInt >= 12 ? 'PM' : 'AM';
        const formattedHour = hourInt % 12 || 12; // Convert to 12-hour format
        return `${formattedHour}:${minute} ${ampm}`;
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('profilePic', selectedFile);
        formData.append('userId', userId);

        try {
            const response = await axios.post('http://localhost:5001/upload-profile-pic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUser({ ...user, profile_pic_url: response.data.profilePicUrl });
            alert(response.data.message);
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    };

    // Use the uploaded profile picture or default image
    const profileImageUrl = user.profile_pic_url ? `http://localhost:5001/${user.profile_pic_url}` : '/assets/profile.png';

    return (
        <div className="profile-page">
            <Sidebar username={user.username} profilePicUrl={profileImageUrl} />
            <div className="profile-content">
                <h1>{user.username}</h1>
                <p>{user.school} - {user.year}</p>
                <p>{user.classes.join(', ')}</p>
                <div className="session-history">
                    {sessions.length > 0 ? (
                        sessions.map((session, index) => (
                            <div key={index} className="session-card">
                                <h3>{session.class_name} - {session.purpose}</h3>
                                <p>{formatTime(session.from_time)} - {formatTime(session.to_time)}</p>
                                <p>Location: {session.location}</p>
                                <button className="join-button">
                                    {session.isCreator ? 'Joined!' : 'Join Group'}
                                </button>
                                <p>{session.participants} participants</p>
                            </div>
                        ))
                    ) : (
                        <p>No Session History So Far</p>
                    )}
                </div>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleFileUpload} className="upload-button">Upload Profile Picture</button>
            </div>
        </div>
    );
}

export default ProfilePage;
