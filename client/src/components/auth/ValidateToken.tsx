const ValidateToken = async (): Promise<any> => {
  try {
    return await fetch('http://localhost:5000/auth/refresh-token', {
      method: 'GET',
      credentials: 'include',
    }).then(response => response.json());
  } catch (err) {}
};

export default ValidateToken;
