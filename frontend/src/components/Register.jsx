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


    const registerUser = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5001/register', {
                name,
                email,
                password,
                passwordConfirm
            });
            if (response.data.message === 'User registered') {
                navigate('/profile_creation'); // Redirect to profile creation page
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
                    <label>Name</label>
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
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Register;