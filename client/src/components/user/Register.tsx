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
      <div>
        <form id="signupForm" onSubmit={handleSubmit(submitHandler)}>
          <h3 className="mt-3 mb-3">Join kpoppop!</h3>

          <p className="text-danger">{errors.username?.message}</p>


          <p className="text-danger">{errors.password?.message}</p>

          <p className="text-danger">{errors.password2?.message}</p>

          <p className="text-danger">{errors.recaptcha?.message}</p>

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting || !verified}>
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
