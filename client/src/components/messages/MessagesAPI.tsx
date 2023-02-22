import { API_URL } from 'Global.d';

export const findUserIfExists = async (user: string) => {
  return await fetch(`${API_URL}/user/exists-${user}`, {
    method: 'GET',
  }).then((response) => response.json());
};
