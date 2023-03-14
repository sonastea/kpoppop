export const linkedDiscord = async () => {
  return await fetch(`/api/auth/discord/linked`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  }).then((response) => response.json());
};

export const linkDiscord = async (data: any) => {
  return await fetch(`/api/auth/discord/link`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then((response) => response.json());
};

export const createLocalLinkedUser = async (data: any) => {
  return await fetch(`/api/auth/discord/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  }).then((response) => response.json());
};
