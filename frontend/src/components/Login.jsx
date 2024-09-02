import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/login', {
        email,
        password,
      });

      // Assuming the backend sends a success message on successful login
      if (response.data.success) {
        setMessage('Successfully logged in');
        const userId = response.data.userId;  // Get the user ID from response
        navigate('/home_page', { state: { userId } }); 
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
      <h1>Login Page</h1>
      <form onSubmit={loginUser}>
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
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
