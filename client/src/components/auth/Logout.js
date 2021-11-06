import { useEffect } from "react";

const Logout = (e) => {
  useEffect(() => {
    try {
      fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localStorage }),
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("isLoggedIn", data["isLoggedIn"]);
          localStorage.setItem("current-user", data["current-user"]);
          localStorage.setItem("user-id", data["user-id"]);
          localStorage.setItem("role", data["role"]);
          setTimeout(() => {
            window.location.pathname = data["redirect_path"];
          }, 1000);
        });
    } catch (err) {
      console.log(err.message);
    }
  });

  return <div>logout</div>;
};

export default Logout;

