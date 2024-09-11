// src/components/Login.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProvider } from '../UserContext';
import Login from './Login';

test('renders Login component and allows user to input email and password', () => {
  render(
    <UserProvider>
      <Login />
    </UserProvider>
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const loginButton = screen.getByText(/login/i);

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  expect(emailInput.value).toBe('test@example.com');
  expect(passwordInput.value).toBe('password123');

  fireEvent.click(loginButton);
});
