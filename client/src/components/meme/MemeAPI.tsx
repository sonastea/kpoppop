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
