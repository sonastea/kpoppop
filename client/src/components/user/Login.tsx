import { faCheck, faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DiscordLoginButton from 'components/button/DiscordLoginButton';
import { LoginFormData, useAuth } from 'contexts/AuthContext';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const Login = () => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    setError,
  } = useForm<LoginFormData>();
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [redirecting, setRedirecting] = useState<boolean>(false);
  const { login, updateUser } = useAuth();

  const loginHandler: SubmitHandler<LoginFormData> = async (data): Promise<void> => {
    if (!data.password || !data.username) return;
    setLoginSuccess(false);
    await login(data)
      .then((response) => {
        if (response.status === 401) {
          setError('password', {
            type: 'manual',
            message: 'Incorrect username or password.',
          });
        }
        if (response.status === 201) {
          setLoginSuccess(true);
          setTimeout(() => {
            setRedirecting(true);
          }, 500);
          setTimeout(() => (window.location.href = '/'), 1000);
        }
        return response.json();
      })
      .then((user) => updateUser(user))
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="mt-20 flex justify-center">
      <form
        className="my-auto h-fit w-[25rem] max-w-[calc(-1.5em+100vw)] space-y-6 overflow-auto
          rounded-md border border-gray-300 bg-slate-100 p-6 shadow-md"
        id="loginForm"
        onSubmit={handleSubmit(loginHandler)}
      >
        <h3 className="py-3 text-center font-bold text-gray-900">Login to kpoppop</h3>

        <div>
          <DiscordLoginButton />
        </div>

        <div
          className="label-outline relative z-10 rounded-md border-2 border-gray-300 bg-white
            focus-within:border-once"
        >
          <input
            required
            autoComplete="username"
            placeholder=" "
            className="focus:outline-hidden block w-full appearance-none rounded-md bg-white p-3
              text-lg"
            type="text"
            id="username"
            {...register('username')}
          />
          <label
            className="pointer-events-none absolute top-0 origin-0 rounded-md p-3 text-lg
              text-zinc-500 duration-300"
            htmlFor="username"
          >
            Username
          </label>
        </div>

        <div
          className="label-outline relative z-10 rounded-md border-2 border-gray-300 bg-white
            focus-within:border-once"
        >
          <input
            required
            autoComplete="current-password"
            placeholder=" "
            className="focus:outline-hidden block w-full appearance-none rounded-md bg-white p-3
              text-lg"
            type={showPassword ? 'text' : 'password'}
            id="password"
            {...register('password')}
          />
          <label
            className="pointer-events-none absolute top-0 origin-0 rounded-md p-3 text-lg
              text-zinc-500 duration-300"
            htmlFor="password"
          >
            Password
          </label>

          <i
            className="absolute right-0 top-0 p-3 text-lg"
            onClick={() => setShowPassword((toggle) => !toggle)}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </i>
        </div>

        {errors.password?.message && <span className="text-error">{errors.password.message}</span>}
        <div className="text-center">
          New to kpoppop?{' '}
          <a className="font-semibold text-blue-700 hover:text-blue-500" href="/register">
            SIGNUP
          </a>
        </div>

        <div className="py-3">
          <button
            className="duration-400 w-full overflow-hidden rounded-md border-once-400 bg-once-400
              p-2 font-bold text-gray-900 transition hover:bg-once"
          >
            {loginSuccess ? 'Login successful' : 'Login'}
            {loginSuccess && !redirecting && (
              <FontAwesomeIcon className="px-2 text-green-800" icon={faCheck} />
            )}
            {redirecting && <FontAwesomeIcon className="px-2" icon={faSpinner} spin />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
