import { API_URL } from 'Global.d';

export const submitMeme = async (data: FormData) => {
  return await fetch(`${API_URL}/meme/submit`, {
    method: 'POST',
    credentials: 'include',
    body: data,
  });
};

export const fetchMemes = async (cursor: number | undefined) => {
  return await fetch(`${API_URL}/meme/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cursor }),
  }).then((response) => response.json());
};

export const fetchMeme = async (id: number) => {
  return await fetch(`${API_URL}/meme/${id}`, {
    method: 'GET',
  }).then((response) => response.json());
};

export const fetchMemeTotalLikes = async (id: number) => {
  return await fetch(`${API_URL}/meme/likes/${id}`, {
    method: 'GET',
  }).then((response) => response.json());
};

export const fetchMemeUserLike = async (id: number) => {
  return await fetch(`${API_URL}/meme/liked/${id}`, {
    method: 'GET',
    credentials: 'include',
  }).then((response) => response.json());
};

export const likeMeme = async (id: number) => {
  return await fetch(`${API_URL}/meme/like/${id}`, {
    method: 'PUT',
    credentials: 'include',
  }).then((response) => response.json());
};

export const unlikeMeme = async (id: number) => {
  return await fetch(`${API_URL}/meme/like/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  }).then((response) => response.json());
};
