import { User } from '../../contexts/AuthContext';

export const getCurrentUser = async (): Promise<User> => {
  return await fetch('http://localhost:5000/auth/check-user', {
    method: 'GET',
    credentials: 'include',
  }).then(response => response.json());
};
