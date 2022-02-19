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
    <div className="d-grid justify-content-center">
      <form id="loginForm" onSubmit={handleSubmit(loginHandler)}>
        <h3 className="mt-3 mb-3">Log in to kpoppop</h3>

        <p className="text-danger">{errors.password?.message}</p>

        <div className="text-center">
          <input className="btn-block text-center mb-3" type="submit">
            Log In
            {loginSuccess && <FontAwesomeIcon icon={faCheck} />}
            {redirecting && <FontAwesomeIcon icon={faSpinner} spin />}
          </input>
        </div>
      </form>
    </div>
  );
};

export default Login;
