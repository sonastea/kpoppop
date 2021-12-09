const Logout = async (): Promise<void> => {
  await fetch('http://localhost:5000/user/logout', {
    method: 'POST',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.path) {
        setTimeout(() => {
          window.location.href = data.path;
        }, 200);
      } else {
        window.location.reload();
      }
    });
};

export default Logout;
