import { User } from '../../contexts/AuthContext';
import { API_URL } from '../../Global.d';

export const getCurrentUser = async (): Promise<User> => {
  return await fetch(API_URL + 'auth/check-user', {
    method: 'GET',
    credentials: 'include',
  }).then((response) => response.json());
};
