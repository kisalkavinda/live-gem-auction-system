/**
 * authService.js
 * --------------
 * Authentication service handling API calls to Spring Boot backend.
 */

import apiClient from './apiClient';

export async function registerUser(formData) {
  try {
    // The backend expects: { fullName, email, password, role }
    // Ensure role is sent in uppercase as expected by the enum
    const payload = {
      ...formData,
      fullName: formData.name, // Map frontend 'name' to backend 'fullName'
      role: formData.role ? formData.role.toUpperCase() : 'BUYER'
    };
    
    const response = await apiClient.post('/auth/register', payload);
    return response.data; // { token, user: { name, email, role, ... } }
  } catch (error) {
    console.error("Registration error:", error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    // If it's a network error (CORS, server down), error.response is undefined
    if (error.message === 'Network Error') {
        throw new Error('Network Error: Unable to reach the backend server (Check if it is running and CORS is allowed).');
    }
    throw new Error(error.message || 'Registration failed. Please check your inputs and try again.');
  }
}

export async function loginUser(credentials) {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Invalid email or password.');
  }
}

export function isLoggedIn() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  return Boolean(token && user);
}

export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function resendVerificationEmail(email) {
  try {
    const response = await apiClient.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error) {
    throw new Error('Failed to resend verification email.');
  }
}

export async function verifyEmailToken(token) {
  try {
    const response = await apiClient.get(`/auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    throw new Error('Invalid or expired verification token.');
  }
}
