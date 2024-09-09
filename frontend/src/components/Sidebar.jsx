// Sidebar.jsx
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css'; // Import your CSS file
import { UserContext } from '../UserContext'; // Import UserContext

function Sidebar() {
    const location = useLocation();
    const { user } = useContext(UserContext); // Use user data from context

    // Function to check if a link is active
    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar">
            {/* Profile Circle with Image */}
            <div className="profile-circle">
                <img src={user?.profile_pic_url} alt="Profile" className="profile-image" />
            </div>
            <h3>{user?.username}</h3>
            <ul>
                <li className={isActive('/profile') ? 'active-link' : ''}>
                    <Link to="/profile">Profile</Link>
                </li>
                <li className={isActive('/study-sessions') ? 'active-link' : ''}>
                    <Link to="/study-sessions">Study Sessions</Link>
                </li>
                <li className={isActive('/create-session') ? 'active-link' : ''}>
                    <Link to="/create-session">Create your own session</Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
