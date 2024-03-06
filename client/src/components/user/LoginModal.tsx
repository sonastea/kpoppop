import { faCheck, faEye, faEyeSlash, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DiscordLoginButton from 'components/button/DiscordLoginButton';
import { LoginFormData, User, useAuth } from 'contexts/AuthContext';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const LoginModal = () => {
  const [hidden, setHidden] = useState<string>('hidden');
  const [notified, setNotified] = useState<boolean>(() => {
    const notified = localStorage.getItem('notifiedUserToLogin') ?? 'false';
    return JSON.parse(notified);
  });
  const {
    formState: { errors },
    register,
    handleSubmit,
    setError,
  } = useForm<LoginFormData>();
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [redirecting, setRedirecting] = useState<boolean>(false);

  const { login, user, updateUser } = useAuth();

  useEffect(() => {
    if (!user) localStorage.removeItem('notifiedUserToLogin');

    setTimeout(() => {
      setHidden('');
    }, 60000);
  }, []);

  const toggleVisbility = () => {
    setNotified((notify) => !notify);
    localStorage.setItem('notifiedUserToLogin', 'true');
  };

  const loginHandler: SubmitHandler<LoginFormData> = async (data): Promise<User> => {
    if (!data.password || !data.username) return {};
    setLoginSuccess(false);
    try {
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
        .catch((_error) => {});
    } catch (err) {
      console.error(err);
    }
    return {};
  };

  if (notified) return null;

  if (!notified) {
    return (
      <div
        className={`z-50 fixed inset-0 flex justify-center items-center w-full min-h-screen backdrop-blur-sm ${hidden}`}
        onClick={toggleVisbility}
      >
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <FontAwesomeIcon
            className="absolute top-0 right-0 hover:bg-slate-200 hover:rounded-full m-2 px-[4px] py-[2.5px] cursor-pointer"
            icon={faXmark}
            onClick={toggleVisbility}
          />
          <form
            className="border p-6 shadow-md rounded-md space-y-6 bg-white"
            id="loginForm"
            onSubmit={handleSubmit(loginHandler)}
          >
            <h3 className="py-3 font-bold text-center text-gray-900">Login to kpoppop</h3>

            <DiscordLoginButton />

            <div className="relative border-2 label-outline focus-within:border-once z-10">
              <input
                required
                autoComplete="username"
                placeholder=" "
                className="z-10 block w-full p-3 text-lg bg-transparent appearance-none focus:outline-none"
                type="text"
                {...register('username')}
              />
              <label className="absolute top-0 p-3 text-lg bg-white origin-0 duration-300 -z-1">
                Username
              </label>
            </div>

            <div className="relative border-2 label-outline focus-within:border-once z-10">
              <input
                required
                autoComplete="current-password"
                placeholder=" "
                className="block w-full p-3 text-lg bg-transparent appearance-none focus:outline-none"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
              />
              <label className="absolute top-0 p-3 text-lg bg-white origin-0 duration-300 -z-1">
                Password
              </label>

              <i
                className="absolute top-0 right-0 p-3 text-lg"
                onClick={() => setShowPassword((toggle) => !toggle)}
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </i>
            </div>

            {errors.password?.message && (
              <span className="text-error">{errors.password.message}</span>
            )}
            <div className="text-center">
              New to kpoppop?{' '}
              <a className="hover:text-blue-500 font-semibold text-blue-700" href="/register">
                SIGNUP
              </a>
            </div>

            <div className="py-3">
              <button className="w-full p-2 overflow-hidden font-bold text-gray-900 border-once-400 rounded-md bg-once-400 hover:bg-once transition duration-400">
                {loginSuccess ? 'Login successful' : 'Login'}
                {loginSuccess && !redirecting && (
                  <FontAwesomeIcon className="px-2" icon={faCheck} />
                )}
                {redirecting && <FontAwesomeIcon className="px-2" icon={faSpinner} spin />}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default LoginModal;
