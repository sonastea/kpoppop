import { Button, Container, FloatingLabel, Form } from 'react-bootstrap';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { API_URL, SITE_KEY } from '../../Global.d';
import ReCAPTCHA from 'react-google-recaptcha';
import { useState } from 'react';

type FormData = {
  username: string;
  email: string;
  password: string;
  password2: string;
  recaptcha: string | null;
};

declare const grecaptcha: ReCAPTCHA;

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  const {
    formState: { errors },
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    control,
    clearErrors,
  } = useForm<FormData>();

  const onVerify = (recaptcha: string | null) => {
    if (recaptcha === null) {
      setVerified(false);
    } else {
      clearErrors('recaptcha');
      setValue('recaptcha', recaptcha);
      setVerified(true);
    }
  };

  const submitHandler: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    if (!data.recaptcha) {
      onVerify(data.recaptcha);
      grecaptcha.reset();
    } else {
      await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.email,
          recaptcha: data.recaptcha,
        }),
      })
        .then((response) => {
          if (response.status === parseInt('422')) {
            setError('recaptcha', {
              type: 'manual',
              message: 'Verify the recaptcha again.',
            });
          }
          return response.json();
        })
        .then((data) => {
          if (data.path) {
            window.location.href = data.path;
          }
          if (data.errors) {
            setError('username', {
              type: 'manual',
              message: data.errors.UserOrEmail,
            });
          }
        });
    }
    setVerified(false);
    setIsSubmitting(false);
    grecaptcha.reset();
  };

  return (
    <>
      <Container fluid>
        <Form id="signupForm" onSubmit={handleSubmit(submitHandler)}>
          <h3 className="mt-3 mb-3">Join kpoppop!</h3>
          <Form.Group className="w-50 form-floating mb-3" controlId="formUsername">
            <FloatingLabel label="Username" className="mb-3">
              <Form.Control required type="text" placeholder="username" {...register('username')} />
            </FloatingLabel>
          </Form.Group>

          <p className="text-danger">{errors.username?.message}</p>

          <Form.Group className="w-50 form-floating mb-3" controlId="formEmail">
            <FloatingLabel label="Email address" className="mb-3">
              <Form.Control required type="email" placeholder="Email address" {...register('email')} />
            </FloatingLabel>
          </Form.Group>

          <Form.Group className="w-50 form-floating mb-3" controlId="formPassword">
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
            </FloatingLabel>
          </Form.Group>
          <p className="text-danger">{errors.password?.message}</p>

          <Form.Group className="w-50 form-floating mb-3" controlId="formPassword2">
            <FloatingLabel label="Confirm Password" className="mb-3">
              <Form.Control
                required
                type="password"
                placeholder="Confirm Password"
                {...register('password2', {
                  validate: (value) => value === watch('password') || 'Passwords do not match',
                })}
              />
            </FloatingLabel>
          </Form.Group>
          <p className="text-danger">{errors.password2?.message}</p>

          <Form.Group className="mb-3">
            <Controller
              control={control}
              name="recaptcha"
              render={() => <ReCAPTCHA sitekey={SITE_KEY} onChange={onVerify} />}
              rules={{ required: true }}
            />
          </Form.Group>
          <p className="text-danger">{errors.recaptcha?.message}</p>

          <Button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting || !verified}>
            Sign Up
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default Register;
