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
        className={`backdrop-blur-xs fixed inset-0 z-50 flex min-h-screen w-full items-center
          justify-center bg-black/10 ${hidden}`}
        onClick={toggleVisbility}
      >
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <FontAwesomeIcon
            className="absolute right-0 top-0 m-2 cursor-pointer px-[4px] py-[2.5px]
              hover:rounded-full hover:bg-slate-200"
            icon={faXmark}
            onClick={toggleVisbility}
          />
          <form
            className="space-y-6 rounded-md border bg-slate-100 p-6 shadow-md"
            id="loginForm"
            onSubmit={handleSubmit(loginHandler)}
          >
            <h3 className="py-3 text-center font-bold text-gray-900">Login to kpoppop</h3>

            <DiscordLoginButton />

            <div
              className="label-outline relative z-10 rounded-md border-2 bg-white
                focus-within:border-once"
            >
              <input
                required
                autoComplete="username"
                placeholder=" "
                className="focus:outline-hidden z-10 block w-full appearance-none rounded-md
                  bg-transparent p-3 text-lg"
                type="text"
                id="username"
                {...register('username')}
              />
              <label
                className="absolute top-0 -z-1 origin-0 rounded-md bg-white p-3 text-lg
                  text-zinc-500 duration-300"
                htmlFor="username"
              >
                Username
              </label>
            </div>

            <div
              className="label-outline relative z-10 rounded-md border-2 bg-white
                focus-within:border-once"
            >
              <input
                required
                autoComplete="current-password"
                placeholder=" "
                className="focus:outline-hidden block w-full appearance-none rounded-md
                  bg-transparent p-3 text-lg"
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password')}
              />
              <label
                className="absolute top-0 -z-1 origin-0 rounded-md bg-white p-3 text-lg
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

            {errors.password?.message && (
              <span className="text-error">{errors.password.message}</span>
            )}
            <div className="text-center">
              New to kpoppop?{' '}
              <a className="font-semibold text-blue-700 hover:text-blue-500" href="/register">
                SIGNUP
              </a>
            </div>

            <div className="py-3">
              <button
                className="duration-400 w-full overflow-hidden rounded-md border-once-400
                  bg-once-400 p-2 font-bold text-gray-900 transition hover:bg-once"
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
      </div>
    );
  }
};

export default LoginModal;
