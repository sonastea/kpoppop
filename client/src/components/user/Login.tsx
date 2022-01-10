import { Button, Container, Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { API_URL } from '../../Global.d';

type LoginFormData = {
  username: string;
  password: string;
};

const Login = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();

  const loginHandler: SubmitHandler<LoginFormData> = async (data) => {
    await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        setTimeout(() => (window.location.href = data.path), 500);
      });
  };

  return (
    <Container className="d-grid justify-content-center">
      <Form id="loginForm" onSubmit={handleSubmit(loginHandler)}>
        <h3 className="mt-3 mb-3">Log in to kpoppop</h3>

        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control required type="text" {...register('username')} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control required type="password" {...register('password')} />
        </Form.Group>

        <Form.Group className="text-center">
          <Button className="btn-block text-center mb-3" variant="primary" size="lg" type="submit">
            Log In
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Login;
