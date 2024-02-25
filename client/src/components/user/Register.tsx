import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
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
  const [accountCreated, setAccountCreated] = useState<boolean>(false);
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
          if (data.id) {
            setAccountCreated(true);
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          }
          if (data.errors) {
            setError('username', {
              type: 'manual',
              message: data.errors.User,
            });
          }
        });
    }
    setVerified(false);
    setIsSubmitting(false);
    grecaptcha.reset();
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="m-1 sm:m-0 w-[35rem] p-8 bg-slate-100 border border-gray-300 rounded-md shadow-md bg-opacity-95 max-w-[calc(-1.5em+100vw)]">
        <form className="space-y-4" id="signupForm" onSubmit={handleSubmit(submitHandler)}>
          <h3 className="py-3 font-semibold text-center">Join kpoppop</h3>
          <div>
            <label className="block mb-2 font-bold">Username</label>
            <input
              required
              className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-once"
              type="text"
              autoComplete="username"
              {...register('username', { required: true })}
            />
          </div>

          <div>
            <label className="block mb-2 font-bold">Email</label>
            <input
              required
              className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-once"
              type="email"
              autoComplete="email"
              {...register('email', { required: true })}
            />
            <div className="mt-1 text-center">
              {errors.username?.message && (
                <span className="text-error">{errors.username.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-bold">Password</label>
            <input
              required
              className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-once"
              type="password"
              autoComplete="new-password"
              {...register('password', {
                required: true,
                minLength: {
                  value: 8,
                  message: 'Password must have at least 8 characters.',
                },
              })}
            />
            <div className="mt-1 text-center">
              {errors.password?.message && (
                <span className="text-error">{errors.password.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-bold focus:outline-none focus:border-once">
              Confirm password
            </label>
            <input
              required
              className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:border-once"
              type="password"
              autoComplete="new-password2"
              {...register('password2', {
                required: true,
                validate: (value) => value === watch('password') || 'Passwords do not match',
              })}
            />
            <div className="mt-1 text-center">
              {errors.password2?.message && (
                <span className="text-error">{errors.password2.message}</span>
              )}
            </div>
          </div>

          <Controller
            control={control}
            name="recaptcha"
            render={() => (
              <ReCAPTCHA
                className="pt-3 overflow-auto"
                id="recaptcha"
                sitekey={SITE_KEY}
                onChange={onVerify}
              />
            )}
            rules={{ required: true }}
          />
          {errors.recaptcha?.message && (
            <span className="text-error">{errors.recaptcha.message}</span>
          )}

          <div className="py-3">
            <button
              className="w-full px-2 py-2 overflow-hidden font-semibold border-once-400 rounded-md bg-once-400 hover:bg-once transition duration-400"
              type="submit"
              disabled={isSubmitting || !verified}
            >
              Sign Up
            </button>
          </div>
          {accountCreated && (
            <div className="text-center">
              Account created successfully.
              <br />
              <FontAwesomeIcon className="mr-2" icon={faSpinner} spin />
              Redirecting to login...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
