import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import '../styles/CreateSessionPage.css';
import { useNavigate } from 'react-router-dom';

function CreateSessionPage() {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [purpose, setPurpose] = useState('');
    const [location, setLocation] = useState('');
    const [message, setMessage] = useState('');
    const userId = localStorage.getItem('userId');
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const navigate = useNavigate();
    const [date, setDate] = useState('');
    const [sessionDate, setSessionDate] = useState('');

    useEffect(() => {
        const fetchUserClasses = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/user/profile/${userId}`);
                setClasses(response.data.classes);
            } catch (error) {
                console.error('Error fetching user classes:', error);
            }
        };

        fetchUserClasses();
    }, [userId]);

    const handleCreateSession = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5001/sessions/create-session', {
                userId,
                className: selectedClass,
                purpose,
                fromTime,
                toTime,
                sessionDate,
                location
            });
            
            setMessage(response.data.message);
            if (response.data.message === 'Successfully created your session!') {
                navigate('/profile');
                // window.location.href = '/profile'; // Redirect to Profile page after session creation
            }
        } catch (error) {
            console.error('Error creating session:', error);
            setMessage('Error creating session', error);
        }
    };

    return (
        <div className="create-session-page">
            <Sidebar />
            <div className="create-session-content">
                <h2>Create Your Own Session</h2>
                <form onSubmit={handleCreateSession}>
                    <div className="form-group">
                        <label>What class is it for?</label>
                        <select 
                            value={selectedClass} 
                            onChange={(e) => setSelectedClass(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a class</option>
                            {classes.map((className, index) => (
                                <option key={index} value={className}>{className}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>What is the purpose of this session?</label>
                        <input 
                            type="text" 
                            value={purpose} 
                            onChange={(e) => setPurpose(e.target.value)} 
                            placeholder="Study for quiz, finish hw..." 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Choose date</label>
                        <input 
                            type="date" 
                            value={sessionDate} // Use sessionDate instead of date
                            onChange={(e) => setSessionDate(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Choose time</label>
                        <div className="time-inputs">
                            <input 
                                type="time" 
                                value={fromTime} 
                                onChange={(e) => setFromTime(e.target.value)} 
                                required 
                                placeholder="From"
                            />
                            <input 
                                type="time" 
                                value={toTime} 
                                onChange={(e) => setToTime(e.target.value)} 
                                required 
                                placeholder="To"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Where would it be?</label>
                        <input 
                            type="text" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="create-session-button">Create this session</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default CreateSessionPage;
