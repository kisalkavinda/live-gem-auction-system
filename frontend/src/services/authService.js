/**
 * authService.js
 * --------------
 * Mock authentication service to simulate backend API calls.
 * Replace the setTimeout logic with real fetch/axios calls when integrating with Spring Boot.
 */

export async function registerUser(formData) {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 800));

  console.log('Mock register request:', formData);

  // Basic mock logic: reject if email already exists
  if (formData.email === 'test@example.com') {
    throw new Error('Email is already registered.');
  }

  // Return a mock success response
  return {
    success: true,
    message: 'Registration successful',
    user: {
      email: formData.email,
      role: formData.role
    }
  };
}

export async function loginUser(credentials) {
  await new Promise(r => setTimeout(r, 700));

  console.log('Mock login request:', credentials);

  // Mock validation
  if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
    return {
      success: true,
      token: 'mock-jwt-token-xyz',
      user: {
        email: credentials.email,
        name: 'Test User'
      }
    };
  }

  // Reject on invalid credentials
  throw new Error('Invalid email or password.');
}

export async function resendVerificationEmail(email) {
  await new Promise(r => setTimeout(r, 600));
  console.log('Mock resend verification to:', email);
  return { success: true };
}

export async function verifyEmailToken(token) {
  await new Promise(r => setTimeout(r, 1200)); // slightly longer to show off the spinner
  console.log('Mock verifying token:', token);
  
  if (token === 'invalid-token') {
    throw new Error('Invalid or expired verification token.');
  }

  return { success: true };
}
