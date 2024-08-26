import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';

function Home() {
  return (
    <div className={styles.container}>
      <h1>Welcome to Our App</h1>
      <div className={styles.formContainer}>
        <div className={styles.option}>
          <p>Don't have an account?</p>
          <Link to="/register">
            <button className={styles.button}>Register</button>
          </Link>
        </div>
        <div className={styles.option}>
          <p>Already have an account?</p>
          <Link to="/login">
            <button className={styles.button}>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
