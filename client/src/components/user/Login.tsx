import { faCheck, faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from 'contexts/AuthContext';
import { API_URL } from 'Global.d';
import { useState } from 'react';
import DiscordLoginButton from 'components/button/DiscordLoginButton';

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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [redirecting, setRedirecting] = useState<boolean>(false);
  const { updateUser } = useAuth();

  const loginHandler: SubmitHandler<LoginFormData> = async (data): Promise<any> => {
    if (!data.password || !data.username) return;
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
          setLoginSuccess(true);
          setTimeout(() => {
            setRedirecting(true);
          }, 500);
          setTimeout(() => (window.location.href = '/'), 1000);
        }
        return response.json();
      })
      .then((user) => updateUser(user))
      .catch((_error) => {});
  };

  return (
    <div className="flex mt-20 justify-center">
      <form
        className="h-fit border p-6 my-auto shadow-md rounded-md space-y-6"
        id="loginForm"
        onSubmit={handleSubmit(loginHandler)}
      >
        <h3 className="py-3 font-bold text-center text-gray-900">Login to kpoppop</h3>

        <DiscordLoginButton />

        <div className="relative border-2 label-outline focus-within:border-once">
          <input
            required
            placeholder=" "
            className="block w-full p-3 text-lg bg-transparent appearance-none focus:outline-none"
            type="text"
            {...register('username')}
          />
          <label className="absolute top-0 p-3 text-lg bg-white origin-0 -z-1 duration-300">Username</label>
        </div>

        <div className="relative border-2 label-outline focus-within:border-once">
          <input
            required
            placeholder=" "
            className="block w-full p-3 text-lg bg-transparent appearance-none focus:outline-none"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
          />
          <label className="absolute top-0 p-3 text-lg bg-white origin-0 -z-1 duration-300">Password</label>

          <i className="absolute top-0 right-0 p-3 text-lg" onClick={() => setShowPassword((toggle) => !toggle)}>
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </i>
        </div>

        {errors.password?.message && <span className="text-error">{errors.password.message}</span>}
        <div className="text-center">New to KPOPPOP? <a className="hover:text-blue-500 font-semibold text-blue-700" href="/register">SIGNUP</a></div>

        <div className="py-3">
          <button className="w-full p-2 overflow-hidden font-bold text-gray-900 border-once-400 rounded-md bg-once-400 hover:bg-once transition duration-400">
            {loginSuccess ? 'Login successful' : 'Login'}
            {loginSuccess && !redirecting && <FontAwesomeIcon className="px-2" icon={faCheck} />}
            {redirecting && <FontAwesomeIcon className="px-2" icon={faSpinner} spin />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
