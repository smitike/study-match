import Sidebar from './Sidebar';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';
import '../styles/StudySessionsPage.css';

function StudySessionsPage() {
    const [user, setUser] = useState(null); // Store user data
    const [userSessions, setUserSessions] = useState([]); // Store sessions created by the user
    const [availableSessions, setAvailableSessions] = useState([]); // Store sessions created by others
    const userId = localStorage.getItem('userId'); // Assuming the user ID is stored in localStorage
    const [joinedSessions, setJoinedSessions] = useState([]);

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

    useEffect(() => {
        // Fetch sessions created by the user
        const fetchUserSessions = async () => {
            try {
                const sessionResponse = await axios.get(`http://localhost:5001/sessions/user/sessions/${userId}`);
                setUserSessions(sessionResponse.data.sessions);
            } catch (error) {
                console.error('Error fetching user sessions:', error);
            }
        };

        fetchUserSessions();
    }, [userId]);

    useEffect(() => {
        // Fetch available sessions created by others
        const fetchAvailableSessions = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/sessions/available-sessions/${userId}`);
                setAvailableSessions(response.data.sessions);
            } catch (error) {
                console.error('Error fetching available sessions:', error);
            }
        };

        fetchAvailableSessions();
    }, [userId]);

    useEffect(() => {
        // Fetch sessions the user has joined
        const fetchJoinedSessions = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/sessions/user/joined-sessions/${userId}`);
                setJoinedSessions(response.data.sessions.map((session) => session.id)); // Store only the session IDs
            } catch (error) {
                console.error('Error fetching joined sessions:', error);
            }
        };

        fetchJoinedSessions();
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    const profileImageUrl = user.profile_pic_url ? `http://localhost:5001/${user.profile_pic_url}` : '/assets/profile.png';

    const handleJoinSession = async (sessionId) => {
        try {
            const response = await axios.post('http://localhost:5001/sessions/join-session', {
                userId,
                sessionId,
            });

            if (response.data.message === 'Successfully joined the session!') {
                setJoinedSessions([...joinedSessions, sessionId]);
                // Update the session state to show that the user has joined
                const updatedAvailableSessions = availableSessions.map((session) => {
                    if (session.id === sessionId) {
                        return { ...session, participants: session.participants + 1 };
                    }
                    return session;
                });
                setAvailableSessions(updatedAvailableSessions);

                // setSessions(updatedSessions);

                // Add session to the user's own sessions
                const joinedSession = sessions.find((session) => session.id === sessionId);
                setUserSessions([...userSessions, joinedSession]);

            }
        } catch (error) {
            console.error('Error joining session:', error);
        }
    };
    const handleLeaveSession = async (sessionId) => {
        try {
            const response = await axios.post('http://localhost:5001/sessions/leave-session', {
                userId,
                sessionId,
            });

            if (response.data.message === 'Successfully left the session!') {
                setJoinedSessions(joinedSessions.filter((id) => id !== sessionId));

                // Update the participant count immediately in the state
                const updatedAvailableSessions = availableSessions.map((session) => {
                    if (session.id === sessionId) {
                        return { ...session, participants: session.participants - 1 };
                    }
                    return session;
                });

                setAvailableSessions(updatedAvailableSessions);

            }
        } catch (error) {
            console.error('Error leaving session:', error);
        }
    };


    const hasJoinedSession = (sessionId) => joinedSessions.includes(sessionId);


    const formatTime = (timeString) => {
        const [hour, minute] = timeString.split(':');
        const hourInt = parseInt(hour, 10);
        const ampm = hourInt >= 12 ? 'PM' : 'AM';
        const formattedHour = hourInt % 12 || 12; // Convert to 12-hour format
        return `${formattedHour}:${minute} ${ampm}`;
    };

    return (
        <div className="study-sessions-page">
            <Sidebar username={user.username} profilePicUrl={profileImageUrl} />
            <div className="study-sessions-content">
                <h2>Welcome to the Study Sessions Page</h2>
                
                <h3>Your Sessions</h3>
                <div className="sessions-list">
                    {userSessions.length > 0 ? (
                        userSessions.map((session, index) => (
                            <div key={index} className="session-card">
                                <h3>{session.class_name} - {session.purpose}</h3>
                                <p>{formatTime(session.from_time)} - {formatTime(session.to_time)}</p>
                                <p>Location: {session.location}</p>
                                <p>{session.participants} participants</p>
                                <button className="join-button" disabled>Joined!</button>
                            </div>
                        ))
                    ) : (
                        <p>No sessions created yet.</p>
                    )}
                </div>

                <h3>Available Sessions</h3>
                <div className="sessions-list">
                    {availableSessions.length > 0 ? (
                        availableSessions.map((session, index) => (
                            <div key={index} className="session-card">
                                <h3>{session.class_name} - {session.purpose}</h3>
                                <p>{formatTime(session.from_time)} - {formatTime(session.to_time)}</p>
                                <p>Location: {session.location}</p>
                                <p>{session.participants} participants</p>
                                <button
                                    className={`join-button ${hasJoinedSession(session.id) ? 'leave-button' : ''}`}
                                    onClick={() =>
                                        hasJoinedSession(session.id)
                                            ? handleLeaveSession(session.id)
                                            : handleJoinSession(session.id)
                                    }
                                >
                                    {hasJoinedSession(session.id) ? 'Leave Group' : 'Join Group'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No sessions available yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudySessionsPage;
