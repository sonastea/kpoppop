const ValidateToken = async (): Promise<any> => {
  try {
    return fetch('http://localhost:5000/auth/refresh-token', {
      method: 'GET',
      credentials: 'include',
    });
  } catch (err) {}
};

export default ValidateToken;
