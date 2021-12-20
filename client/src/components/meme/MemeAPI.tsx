export const fetchMemes = async (cursor: number | undefined) => {
  return await fetch('http://localhost:5000/meme/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cursor }),
  }).then((response) => response.json());
};

export const fetchMeme = async (id: number) => {
  return await fetch(`http://localhost:5000/meme/${id}`, {
    method: "GET",
  }).then((response) => response.json());
};

export const fetchMemeTotalLikes = async (id: number) => {
  return await fetch(`http://localhost:5000/meme/likes/${id}`, {
    method: "GET",
  }).then((response) => response.json());
};

export const fetchMemeUserLike = async (id: number) => {
  return await fetch(`http://localhost:5000/meme/liked/${id}`, {
    method: "GET",
    credentials: "include",
  }).then((response) => response.json());
};

export const likeMeme = async (id: number) => {
  return await fetch(`http://localhost:5000/meme/like/${id}`, {
    method: "PUT",
    credentials: "include",
  }).then((response) => response.json());
}

export const unlikeMeme = async (id: number) => {
  return await fetch(`http://localhost:5000/meme/like/${id}`, {
    method: "DELETE",
    credentials: "include",
  }).then((response) => response.json());
}
