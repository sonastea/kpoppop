import { API_URL } from '../../Global.d';

const Logout = async (): Promise<void> => {
  await fetch(API_URL + 'user/logout', {
    method: 'POST',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.path) {
        setTimeout(() => {
          window.location.href = data.path;
        }, 500);
      } else {
        window.location.reload();
      }
    });
};

export default Logout;
