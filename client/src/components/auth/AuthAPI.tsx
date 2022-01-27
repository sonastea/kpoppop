import { User } from '../../contexts/AuthContext';
import { ACCESS_TOKEN, API_URL } from '../../Global.d';

export const getCurrentUser = async (): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/check-user`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + ACCESS_TOKEN,
    },
  });
  return await response.json();
};
