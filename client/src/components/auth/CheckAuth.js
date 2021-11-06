async function CheckAuth(props) {
  try {
    await fetch("http://localhost:5000/session", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        props.isLoggedIn = data.isLoggedIn;
      });
  } catch (err) {
    console.log(err.message);
  }
}

export default CheckAuth;

