import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Welcome.module.css';

function Welcome() {
  return (
    <div className={styles.container}>
      {/* Left side with background image */}
      <div className={styles.leftSide}>
        <img
          src="/assets/bg2.png" // Replace 'bg1.png' with the actual file name
          alt="Background"
          className={styles.backgroundImage}
        />
      </div>

      {/* Right side with form and links */}
      <div className={styles.rightSide}>
        <h1>Welcome to Study Group Match</h1>
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
    </div>
  );
}

export default Welcome;
