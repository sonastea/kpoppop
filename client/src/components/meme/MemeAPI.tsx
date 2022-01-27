import { ACCESS_TOKEN, API_URL } from '../../Global.d';

export const submitMeme = async (data: FormData) => {
  return await fetch(`${API_URL}/meme/submit`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    body: data,
  }).then((response) => response.json());
};

export const fetchMemes = async (cursor: number | undefined) => {
  return await fetch(`${API_URL}/meme/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cursor }),
  }).then((response) => response.json()).catch((err) => console.log(err));
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
    headers: {
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    }
  }).then((response) => response.json());
};

export const likeMeme = async (id: number) => {
  return await fetch(`${API_URL}/meme/like/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    }
  }).then((response) => response.json());
};

export const unlikeMeme = async (id: number) => {
  return await fetch(`${API_URL}/meme/like/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    }
  }).then((response) => response.json());
};
