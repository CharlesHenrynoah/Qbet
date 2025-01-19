import type { User } from '../types';

// Simuler une base de données d'utilisateurs
const users: User[] = [];

export async function login(email: string, password: string): Promise<User> {
  // Simuler une latence réseau
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('Identifiants invalides');
  }

  return user;
}

export async function signup(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  company: string,
  phone: string,
  plan: string
): Promise<User> {
  // Simuler une latence réseau
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Vérifier si l'utilisateur existe déjà
  if (users.find(u => u.email === email)) {
    throw new Error('Cet email est déjà utilisé');
  }

  // Créer un nouvel utilisateur
  const newUser: User = {
    id: Math.random().toString(36).substring(7),
    email,
    firstName,
    lastName,
    company,
    phone,
    plan: plan as 'Basic' | 'Pro' | 'Enterprise',
    createdAt: new Date()
  };

  users.push(newUser);
  return newUser;
}

export async function logout(): Promise<void> {
  // Simuler une latence réseau
  await new Promise(resolve => setTimeout(resolve, 500));
}