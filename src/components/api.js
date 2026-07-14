
const API_URL = 'https://qkart-backend.com/api';

export const registerUser = async (data) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
};