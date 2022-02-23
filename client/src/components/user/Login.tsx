import { faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../Global.d';
import { useState } from 'react';

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
          const el = document.getElementById('loginForm')?.children[4].children[0] as HTMLElement;
          el.innerText = 'Log In Successful ';
          setTimeout(() => {
            setLoginSuccess(true);
            setTimeout(() => {
              el.innerText = 'Redirecting ';
              setRedirecting(true);
            }, 500);
            setTimeout(() => (window.location.href = '/'), 1000);
          }, 100);
        }
        return response.json();
      })
      .then((user) => updateUser(user))
      .catch((_error) => {});
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        className="max-w-sm p-6 mx-auto overflow-hidden shadow-xl rounded-md space-y-6"
        id="loginForm"
        onSubmit={handleSubmit(loginHandler)}
      >
        <h3 className="py-3 font-semibold text-center text-gray-900">Log in to kpoppop</h3>

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
            type="password"
            {...register('password')}
          />
          <label className="absolute top-0 p-3 text-lg bg-white origin-0 -z-1 duration-300">Password</label>
        </div>

        {errors.password?.message && (
          <span className="text-error">{errors.password.message}</span>
        )}

        <div className="py-3">
          <button
            className="w-full p-2 overflow-hidden font-semibold border-once-400 rounded-md bg-once-400 hover:bg-once transition duration-400"
            type="submit"
          >
            Login
            {loginSuccess && <FontAwesomeIcon icon={faCheck} />}
            {redirecting && <FontAwesomeIcon icon={faSpinner} spin />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
