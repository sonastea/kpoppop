import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Container, Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { API_URL } from '../../Global.d';
import { useState } from 'react';
import useAuth from '../../contexts/AuthContext';

type LoginFormData = {
  username: string;
  password: string;
};

const Login = () => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    setError,
  } = useForm<LoginFormData>();
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const { updateUser } = useAuth();

  const loginHandler: SubmitHandler<LoginFormData> = async (data): Promise<any> => {
    setLoginSuccess(false);
    await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 401) {
          setError('password', {
            type: 'manual',
            message: 'Incorrect username or password.',
          });
        }
        if (response.status === 201) {
          const el = document.getElementById('loginForm')?.children[4].children[0] as HTMLElement;
          el.innerText = 'Log In Successful ';
          setTimeout(() => {
            setLoginSuccess(true);
            setTimeout(() => el.innerText = 'Redirecting ', 500);
            setTimeout(() => window.location.reload(), 1000);
          }, 100);
        }
        return response.json();
      })
      .then((user) => updateUser(user))
      .catch((_error) => {})
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

        <p className="text-danger">{errors.password?.message}</p>

        <Form.Group className="text-center">
          <Button className="btn-block text-center mb-3" variant="primary" size="lg" type="submit">
            Log In
            {loginSuccess && <FontAwesomeIcon icon={faCheck} />}
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Login;
