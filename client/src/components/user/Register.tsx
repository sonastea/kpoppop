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
    <div className="mt-20 flex justify-center">
      <div
        className="m-1 w-[35rem] max-w-[calc(-1.5em+100vw)] rounded-md border border-gray-300
          bg-slate-100 bg-opacity-95 p-8 shadow-md sm:m-0"
      >
        <form className="space-y-4" id="signupForm" onSubmit={handleSubmit(submitHandler)}>
          <h3 className="py-3 text-center font-semibold">Join kpoppop</h3>
          <div>
            <label className="mb-2 block font-bold">Username</label>
            <input
              required
              className="w-full rounded border border-gray-300 p-1 focus:border-once
                focus:outline-none"
              type="text"
              autoComplete="username"
              {...register('username', { required: true })}
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">Email</label>
            <input
              required
              className="w-full rounded border border-gray-300 p-1 focus:border-once
                focus:outline-none"
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
            <label className="mb-2 block font-bold">Password</label>
            <input
              required
              className="w-full rounded border border-gray-300 p-1 focus:border-once
                focus:outline-none"
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
            <label className="mb-2 block font-bold focus:border-once focus:outline-none">
              Confirm password
            </label>
            <input
              required
              className="w-full rounded border border-gray-300 p-1 focus:border-once
                focus:outline-none"
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
                className="overflow-auto pt-3"
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
              className="duration-400 w-full overflow-hidden rounded-md border-once-400 bg-once-400
                px-2 py-2 font-semibold transition hover:bg-once"
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
