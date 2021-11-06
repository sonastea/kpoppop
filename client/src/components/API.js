export const fetchMemes = async (page) => {
  return await fetch("http://localhost:5000/api/images", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page }),
  }).then((response) => response.json());
};

export const fetchMeme = async (id) => {
  return await fetch(`http://localhost:5000/api/${id}`, {
    method: "GET",
  }).then((response) => response.json());
};

export const fetchMemeTotalLikes = async (id) => {
  return await fetch(`http://localhost:5000/api/likes/${id}`, {
    method: "GET",
  }).then((response) => response.json());
};

export const fetchMemeUserLike = async (id, userId) => {
  if (userId === 0) {
    return false;
  } else {
    return await fetch(`http://localhost:5000/api/like/${id}/${userId}`, {
      method: "GET",
    }).then((response) => response.json());
  }
};

export const likeMeme = async (id, userId) => {
  return await fetch(`http://localhost:5000/api/like-meme/${id}/${userId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: localStorage.getItem("current-user") }),
  }).then((response) => response.json());
};

export const unlikeMeme = async (id, userId) => {
  return await fetch(`http://localhost:5000/api/like-meme/${id}/${userId}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: localStorage.getItem("current-user") }),
  }).then((response) => response.json());
};

