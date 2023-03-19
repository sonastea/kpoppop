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

export const fetchMemeTotalComments = async (id: number) => {
  return await fetch(`${API_URL}/meme/comments/${id}`, {
    method: 'GET',
  }).then((response) => response.json());
};

export const fetchMemeComments = async (id: number) => {
  return await fetch(`${API_URL}/meme/comment/${id}`, {
    method: 'GET',
  }).then((response) => response.json());
};

export const toggleMemeComment = async (id: number) => {
  return await fetch(`${API_URL}/meme/delete/${id}`, {
    method: 'PUT',
    credentials: 'include',
  }).then((response) => response.json());
};

export const deleteComment = async (id: number) => {
  return await fetch(`${API_URL}/meme/delete/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  }).then((response) => response.json());
};

export const editComment = async (comment: string, id: number) => {
  return await fetch(`${API_URL}/meme/edit/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ comment }),
  }).then((response) => response.json());
};

export const removeMeme = async (id: number) => {
  return await fetch(`${API_URL}/meme/remove/${id}`, {
    method: 'PUT',
    credentials: 'include',
  }).then((response) => response.json());
};

export const reportMeme = async (id: number, description: string) => {
  return await fetch(`${API_URL}/meme/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, description }),
    credentials: 'include',
  }).then((response) => response.json());
};

export const toggleMeme = async (id: number) => {
  return await fetch(`${API_URL}/meme/toggle/${id}`, {
    method: 'PUT',
    credentials: 'include',
  }).then((response) => response.json());
};
