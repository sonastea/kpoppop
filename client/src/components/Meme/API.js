export const hideMeme = async (id, userId) => {
  return await fetch(`http://localhost:5000/api/hide-meme/${id}/${userId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: localStorage.getItem("current-user") }),
  }).then((response) => response.json());
};

export const unhideMeme = async (id, userId) => {
  return await fetch(`http://localhost:5000/api/unhide-meme/${id}/${userId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: localStorage.getItem("current-user") }),
  }).then((response) => response.json());
};

