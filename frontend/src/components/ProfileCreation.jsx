import React, { useState } from 'react';

function ProfileCreation() {
    const [school, setSchool] = useState('');
    const [year, setYear] = useState('');
    const [numClasses, setNumClasses] = useState(0);
    const [classes, setClasses] = useState([]);
    const [message, setMessage] = useState('');

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit the data to your backend or handle it as necessary
        console.log({ school, year, classes });
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
