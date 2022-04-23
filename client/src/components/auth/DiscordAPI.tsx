import { API_URL } from 'Global.d';

export const linkDiscord = async () => {
  return await fetch('https://192.168.0.2:5000/api/auth/discord/link', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  }).then((response) => response.json());
};

export const createLocalLinkedUser = async (data: any) => {
  return await fetch(`${API_URL}/auth/discord/register`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  }).then((response) => response.json());
};
