import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import the Sidebar component
import '../styles/ProfilePage.css';

function ProfilePage() {
    const [user, setUser] = useState(null); // Store user data
    const [sessions, setSessions] = useState([]); // Store user sessions
    const userId = localStorage.getItem('userId'); // Assuming the user ID is stored in localStorage
    const [selectedFile, setSelectedFile] = useState(null);
    const [joinedSessions, setJoinedSessions] = useState([]);

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
    useEffect(() => {
        // Fetch sessions the user has joined
        const fetchJoinedSessions = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/sessions/user/joined-sessions/${userId}`);
                setJoinedSessions(response.data.sessions); // Update with the actual session objects
            } catch (error) {
                console.error('Error fetching joined sessions:', error);
            }
        };

        fetchJoinedSessions();
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

                <h3>Sessions You've Joined</h3>
                    {joinedSessions.length > 0 ? (
                        joinedSessions.map((session, index) => (
                            <div key={index} className="session-card">
                                <h3>{session.class_name} - {session.purpose}</h3>
                                <p>{formatTime(session.from_time)} - {formatTime(session.to_time)}</p>
                                <p>Location: {session.location}</p>
                                <button className="join-button" disabled>Joined!</button>
                                <p>{session.participants} participants</p>
                            </div>
                        ))
                    ) : (
                        <p>No sessions joined yet.</p>
                    )}
            </div>
        </div>
    );
}

export default ProfilePage;