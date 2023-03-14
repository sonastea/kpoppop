export const findUserIfExists = async (user: string) => {
  return await fetch(`/api/user/exists-${user}`, {
    method: 'GET',
  }).then((response) => response.json());
};
