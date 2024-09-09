import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Make sure this import is present

<h1>Register</h1>
function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();  // Initialize the navigate function
    const [school, setSchool] = useState('');
    const [year, setYear] = useState('');
    const [numClasses, setNumClasses] = useState(0);
    const [classes, setClasses] = useState([]);

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


    const registerUser = async (e) => {
        e.preventDefault();
        console.log('Register button clicked');

        try {
            const response = await axios.post('http://localhost:5001/register', {
                name,
                email,
                password,
                passwordConfirm,
                school,
                year,
                classes
            });
            if (response.data.message === 'User registered') {
                const userId = response.data.userId;  // Get the user ID from response
                localStorage.setItem('userId', userId); // Store user ID in local storage
                navigate('/profile'); // Redirect to profile page
                // navigate('/home_page', { state: { userId } }); // Pass the userId to ProfileCreation
                // navigate('/profile_creation'); // Redirect to profile creation page
            } else {
                setMessage(response.data.message);
            }

            // setMessage(response.data.message);
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data.message || error.response.data}`);
            } else {
                setMessage(`An error occurred. Please try again. Error: ${error.message}`);
            }
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={registerUser}>
                <div>
                    <label>Full Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input 
                        type="password" 
                        value={passwordConfirm} 
                        onChange={(e) => setPasswordConfirm(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>School</label>
                    <input 
                        type="text" 
                        value={school} 
                        onChange={(e) => setSchool(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Year</label>
                    <input 
                        type="text" 
                        value={year} 
                        onChange={(e) => setYear(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Number of Classes</label>
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
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;