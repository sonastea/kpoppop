import { API_URL } from 'Global.d';

export const fetchUser = async (user: string) => {
  return await fetch(`${API_URL}/user/${user}`, {
    method: 'GET',
  }).then((response) => response.json());
};

export const fetchUserSettings = async () => {
  return await fetch(`${API_URL}/user/profile/settings`, {
    method: 'GET',
    credentials: 'include',
  }).then((response) => response.json());
};

export const updateProfile = async (data: any) => {
  return await fetch(`${API_URL}/user/update_profile`, {
    method: 'POST',
    body: data,
    credentials: 'include',
  }).then((response) => response.json());
};

export const addSocialMediaLink = async (data: any) => {
  return await fetch(`${API_URL}/user/add_social`, {
    method: 'PUT',
    body: data,
    credentials: 'include',
  }).then((response) => response.json());
};

export const deleteSocialMediaLink = async (uuid: string) => {
  return await fetch(`${API_URL}/user/delete_social`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uuid }),
    credentials: 'include',
  }).then((response) => response.json());
};

export const reportUser = async (user: { id: number; username: string }, description: string) => {
  return await fetch(`${API_URL}/user/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, description }),
    credentials: 'include',
  }).then((response) => response.json());
};

export const banUser = async (name?: string, userId?: number) => {
  return await fetch(`${API_URL}/user/ban_user`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: name, userId }),
    credentials: 'include',
  }).then((response) => response.json());
};

export const unbanUser = async (name?: string, userId?: number) => {
  return await fetch(`${API_URL}/user/unban_user`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: name, userId: userId }),
    credentials: 'include',
  }).then((response) => response.json());
};

export const modUser = async (name?: string, userId?: number) => {
  return await fetch(`${API_URL}/user/mod_user`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: name, userId: userId }),
    credentials: 'include',
  }).then((response) => response.json());
};

export const unmodUser = async (name?: string, userId?: number) => {
  return await fetch(`${API_URL}/user/unmod_user`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: name, userId: userId }),
    credentials: 'include',
  }).then((response) => response.json());
};
