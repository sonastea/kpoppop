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
          if (data.id) {
            window.location.href = '/';
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
    <div className="flex items-center justify-center h-full md:min-h-screen">
      <div className="w-2/3 p-8 bg-gray-700 border rounded shadow-md bg-opacity-95 md:max-w-lg border-once-200">
        <form className="space-y-4" id="signupForm" onSubmit={handleSubmit(submitHandler)}>
          <h3 className="py-3 font-semibold text-center text-white">Join kpoppop</h3>
          <div>
            <label className="block mb-2 font-bold text-gray-100">Username</label>
            <input
              className="w-full p-1 text-white bg-gray-700 border border-gray-800 rounded focus:outline-none focus:border-once"
              required
              type="text"
              {...register('username')}
            />
          </div>

          <div>
            <label className="block mb-2 font-bold text-gray-100">Email</label>
            <input
              className="w-full p-1 text-white bg-gray-700 border border-gray-800 rounded focus:outline-none focus:border-once"
              required
              type="email"
              {...register('email')}
            />
            <div className="mt-1 text-center">
              {errors.username?.message && <span className="text-red-500">{errors.username.message}</span>}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-bold text-gray-100">Password</label>
            <input
              className="w-full p-1 text-white bg-gray-700 border border-gray-800 rounded focus:outline-none focus:border-once"
              required
              type="password"
              {...register('password')}
            />
            <div className="mt-1 text-center">
              {errors.password?.message && <span className="text-red-500">{errors.password.message}</span>}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-bold text-gray-100 focus:outline-none focus:border-once">
              Confirm password
            </label>
            <input
              className="w-full p-1 text-white bg-gray-700 border border-gray-800 rounded focus:outline-none focus:border-once"
              required
              type="password"
              {...register('password2', {
                validate: (value) => value === watch('password') || 'Passwords do not match',
              })}
            />
            <div className="mt-1 text-center">
              {errors.password2?.message && <span className="text-red-500">{errors.password2.message}</span>}
            </div>
          </div>

          <Controller
            control={control}
            name="recaptcha"
            render={() => (
              <ReCAPTCHA className="pt-3 overflow-auto" id="recaptcha" sitekey={SITE_KEY} onChange={onVerify} />
            )}
            rules={{ required: true }}
          />
          {errors.recaptcha?.message && <span className="text-red-500">{errors.recaptcha.message}</span>}

          <div className="py-3">
            <button
              className="w-full px-2 py-2 overflow-hidden font-semibold border-once-400 rounded-md bg-once-400 hover:bg-once transition duration-400"
              type="submit"
              disabled={isSubmitting || !verified}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
