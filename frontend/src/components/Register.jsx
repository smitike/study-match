import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Register.module.css';  // Ensure correct path to your CSS file

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
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
                const userId = response.data.userId;
                localStorage.setItem('userId', userId);
                navigate('/profile');
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                setMessage(`Error: ${error.response.data.message || error.response.data}`);
            } else {
                setMessage(`An error occurred. Please try again. Error: ${error.message}`);
            }
        }
    };

    return (
        <div className={styles.container}>
            {/* Left side with background image */}
            <div className={styles.leftSide}>
                <img
                    src="/assets/bg2.png"  /* Replace with your actual image file name */
                    alt="Background"
                    className={styles.backgroundImage}
                />
            </div>

            {/* Right side with register form */}
            <div className={styles.rightSide}>
                <h1>Register</h1>
                <div className={styles.formContainer}>
                    <form onSubmit={registerUser}>
                        <div className={styles.formGroup}>
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Password</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Confirm Password</label>
                            <input 
                                type="password" 
                                value={passwordConfirm} 
                                onChange={(e) => setPasswordConfirm(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>School</label>
                            <input 
                                type="text" 
                                value={school} 
                                onChange={(e) => setSchool(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Year</label>
                            <input 
                                type="text" 
                                value={year} 
                                onChange={(e) => setYear(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Number of Classes</label>
                            <input 
                                type="number" 
                                value={numClasses} 
                                onChange={handleNumClassesChange} 
                                required 
                            />
                        </div>
                        {classes.map((className, index) => (
                            <div className={styles.formGroup} key={index}>
                                <label>Class {index + 1} Name</label>
                                <input 
                                    type="text" 
                                    value={className} 
                                    onChange={(e) => handleClassChange(index, e.target.value)} 
                                    required 
                                />
                            </div>
                        ))}
                        <button type="submit" className={styles.button}>Register</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </div>
        </div>
    );
}

export default Register;
