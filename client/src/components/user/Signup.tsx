import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, Container, FloatingLabel, Form } from 'react-bootstrap';

type FormData = {
  username: string;
  email: string;
  password: string;
  password2: string;
};

const Signup = () => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    setError,
    watch,
  } = useForm<FormData>();

  const submitHandler: SubmitHandler<FormData> = async (data) => {

    await fetch('http://localhost:5000/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        email: data.email,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.errors) {
          setError('username', {
            type: 'manual',
            message: res.errors.UserOrEmail,
          });
        } else {
          console.log(res);
        }
      });
  };

  return (
    <>
      <Container>
        <Form id="signupForm" onSubmit={handleSubmit(submitHandler)}>
          <h3 className="mt3 mb-4">Join kpopop!</h3>
          <Form.Group
            className="w-25 form-floating mb-3"
            controlId="formUsername"
          >
            <FloatingLabel label="Username" className="mb-3">
              <Form.Control
                required
                type="text"
                placeholder="username"
                {...register('username')}
              />
            </FloatingLabel>
          </Form.Group>

          <p className="text-danger">
            {errors.username && errors.username.message}
          </p>

          <Form.Group className="w-25 form-floating mb-3" controlId="formEmail">
            <FloatingLabel label="Email address" className="mb-3">
              <Form.Control
                required
                type="email"
                placeholder="Email address"
                {...register('email')}
              />
            </FloatingLabel>
          </Form.Group>

          <Form.Group
            className="w-25 form-floating mb-3"
            controlId="formPassword"
          >
            <FloatingLabel label="Password" className="mb-3">
              <Form.Control
                required
                type="password"
                placeholder="Password"
                {...register('password', {
                  minLength: {
                    value: 8,
                    message: 'Password must have at least 8 characters',
                  },
                })}
              />
              <p className="text-danger">
                {errors.password && errors.password.message}
              </p>
            </FloatingLabel>
          </Form.Group>

          <Form.Group
            className="w-25 form-floating mb-3"
            controlId="formPassword2"
          >
            <FloatingLabel label="Confirm Password" className="mb-3">
              <Form.Control
                required
                type="password"
                placeholder="Confirm Password"
                {...register('password2', {
                  validate: (value) =>
                    value === watch('password') || 'Passwords do not match',
                })}
              />
              <p className="text-danger">
                {errors.password2 && errors.password2.message}
              </p>
            </FloatingLabel>
          </Form.Group>

          <Button type="submit" className="w-25 btn btn-primary btn-block">
            Sign Up
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Signup;
