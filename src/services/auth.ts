import type { User } from '../types';

// Simuler une base de données d'utilisateurs
const users: User[] = [];

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  gender: string;
  profilePicture?: File;
  username: string;
}

export async function login(email: string, password: string): Promise<User> {
  // Simuler une latence réseau
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('Identifiants invalides');
  }

  return user;
}

export async function signup(data: SignupData): Promise<void> {
  try {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('dateOfBirth', data.dateOfBirth);
    formData.append('phone', data.phone);
    formData.append('gender', data.gender);
    formData.append('username', data.username);
    if (data.profilePicture) {
      formData.append('profilePicture', data.profilePicture);
    }

    const response = await fetch('/api/signup', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  // Simuler une latence réseau
  await new Promise(resolve => setTimeout(resolve, 500));
}