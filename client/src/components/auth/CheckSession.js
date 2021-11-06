const CheckSession = ({ user }) => {
  try {
    fetch("http://localhost:5000/session", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: localStorage.getItem("current-user") }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user-id", data["user-id"]);
        localStorage.setItem("current-user", data.username);
        localStorage.setItem("isLoggedIn", data.isLoggedIn);
      });
  } catch (err) {
    console.log(err.message);
  }
};

export default CheckSession;
