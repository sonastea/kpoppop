export const submitMeme = async (data: FormData) => {
  return await fetch(`/api/meme/submit`, {
    method: 'POST',
    credentials: 'include',
    body: data,
  });
};

export const fetchMemes = async (cursor: number | undefined) => {
  return await fetch(`/api/meme/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cursor }),
  }).then((response) => response.json());
};

export const fetchMeme = async (id: number) => {
  return await fetch(`/api/meme/${id}`, {
    method: 'GET',
  }).then((response) => response.json());
};

export const fetchMemeTotalLikes = async (id: number) => {
  return await fetch(`/api/meme/likes/${id}`, {
    method: 'GET',
  }).then((response) => response.json());
};

export const fetchMemeUserLike = async (id: number) => {
  return await fetch(`/api/meme/liked/${id}`, {
    method: 'GET',
    credentials: 'include',
  }).then((response) => response.json());
};

export const likeMeme = async (id: number) => {
  return await fetch(`/api/meme/like/${id}`, {
    method: 'PUT',
    credentials: 'include',
  }).then((response) => response.json());
};

export const unlikeMeme = async (id: number) => {
  return await fetch(`/api/meme/like/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  }).then((response) => response.json());
};

export const fetchMemeTotalComments = async (id: number) => {
  return await fetch(`/api/meme/comments/${id}`, {
    method: 'GET',
  }).then((response) => response.json());
};

export const fetchMemeComments = async (id: number) => {
  return await fetch(`/api/meme/comment/${id}`, {
    method: 'GET',
  }).then((response) => response.json());
};

export const toggleMemeComment = async (id: number) => {
  return await fetch(`/api/meme/delete/${id}`, {
    method: 'PUT',
    credentials: 'include',
  }).then((response) => response.json());
};

export const deleteComment = async (id: number) => {
  return await fetch(`/api/meme/delete/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  }).then((response) => response.json());
};

export const editComment = async (comment: string, id: number) => {
  return await fetch(`/api/meme/edit/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ comment }),
  }).then((response) => response.json());
};

export const reportMeme = async (id: number, description: string) => {
  return await fetch(`/api/meme/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, description }),
    credentials: 'include',
  }).then((response) => response.json());
};

export const toggleMeme = async (id: number) => {
  return await fetch(`/api/meme/toggle/${id}`, {
    method: 'PUT',
    credentials: 'include',
  }).then((response) => response.json());
};
