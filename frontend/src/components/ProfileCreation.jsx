import React, { useState } from 'react';
import axios from 'axios';  // Assuming you're using axios for HTTP requests


function ProfileCreation() {
    const [school, setSchool] = useState('');
    const [year, setYear] = useState('');
    const [numClasses, setNumClasses] = useState(0);
    const [classes, setClasses] = useState([]);
    const [message, setMessage] = useState('');
    const userId = location.state?.userId || sessionStorage.getItem('userId');
    


    const handleNumClassesChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setNumClasses(value);
        const newClasses = Array(value).fill('');
        setClasses(newClasses);
    };

    const handleClassChange = (index, value) => {
        const newClasses = [...classes];
        newClasses[index] = value;
        setClasses(newClasses);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Submit the data to your backend or handle it as necessary
        console.log({ school, year, classes });
        try {
            // Replace with your backend endpoint
            const response = await axios.post('http://localhost:5001/profile_creation', {
                school,
                year,
                classes
            }, { withCredentials: true }); // Include credentials to allow cookies 

            if (response.data.success) {
                setMessage('Profile information saved successfully!');
            } else {
                setMessage('Failed to save profile information.');
            }
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div>
            <h1>Profile Creation</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>What school are you attending?</label>
                    <input 
                        type="text" 
                        value={school} 
                        onChange={(e) => setSchool(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>What year are you?</label>
                    <input 
                        type="text" 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Number of classes you are taking?</label>
                    <input 
                        type="number" 
                        value={numClasses} 
                        onChange={handleNumClassesChange} 
                        required 
                    />
                </div>
                {classes.map((className, index) => (
                    <div key={index}>
                        <label>Class {index + 1} Name</label>
                        <input 
                            type="text" 
                            value={className} 
                            onChange={(e) => handleClassChange(index, e.target.value)} 
                            required 
                        />
                    </div>
                ))}
                <button type="submit">Create Profile</button>
            </form>
            {message && <p>{message}</p>}  {/* Display the success/failure message */}
        </div>
    );
}

export default ProfileCreation;
