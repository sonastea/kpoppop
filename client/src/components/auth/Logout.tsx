import { ACCESS_TOKEN, API_URL } from '../../Global.d';


const Logout = async (): Promise<void> => {
  await fetch(`${API_URL}/user/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    }
  })
    .then((response) => response.json())
    .then((user) => {
      if (!user.isLoggedIn) {
        setTimeout(() => window.location.href = '/', 500);
      }
    });
};

export default Logout;
