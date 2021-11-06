import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5000/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          setErrors(data);
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("current-user", data["current-user"]);
          localStorage.setItem("user-id", data["user-id"]);
          localStorage.setItem("role", data["role"]);
          setTimeout(() => {
            window.location.pathname = data["redirect_path"];
          }, 1250);
        });
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <Container>
        <h3 className="mt-3 mb-4">Log in to kpopop</h3>
        <Form onSubmit={loginHandler}>
          <Form.Group className="mb-3 col-md-3">
            <Form.Control
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className="text-danger">{errors.username}</p>
            )}
          </Form.Group>

          <Form.Group className="mb-3 col-md-3">
            <Form.Control
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-danger">{errors.password}</p>
            )}
          </Form.Group>

          <Form.Group className="mb-3 col-md-3">
            <Form.Check type="checkbox" label="Remember Me" />
          </Form.Group>

          <Button
            className="text-center text-center"
            variant="primary"
            type="submit"
            label="Login"
          >
            Login
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Login;

