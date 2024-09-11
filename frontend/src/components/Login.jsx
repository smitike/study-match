import React, { useState, useContext } from 'react';
import axios from 'axios';
import styles from '../styles/Login.module.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/login', {
        email,
        password,
      });

      if (response.data.message === 'Successfully logged in') {
        const userId = response.data.userId;
        const userData = response.data.user;
        setUser(userData);

        localStorage.setItem('userId', userId); // Store user ID in local storage
        navigate('/profile'); // Redirect to profile page
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
          src="/assets/bg2.png" /* Replace with your actual image file name */
          alt="Background"
          className={styles.backgroundImage}
        />
      </div>

      {/* Right side with login form */}
      <div className={styles.rightSide}>
        <h1>Login Page</h1>
        <div className={styles.formContainer}>
          <form onSubmit={loginUser}>
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
            <button type="submit" className={styles.button}>Login</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Login;
