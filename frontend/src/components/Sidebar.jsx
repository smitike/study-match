// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css'; // Add a CSS file for styling

function Sidebar({ username }) {
    return (
        <div className="sidebar">
            <div className="profile-pic"></div>
            <h2>{username}</h2>
            <nav>
                <ul>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/sessions">Study Sessions</Link></li>
                    <li><Link to="/create-session">Create your own session</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
