import { API_URL } from '../../Global.d';

const ValidateToken = async (): Promise<any> => {
  try {
    return await fetch(API_URL + 'auth/refresh-token', {
      method: 'GET',
      credentials: 'include',
    }).then((response) => response.json());
  } catch (err) {}
};

export default ValidateToken;
