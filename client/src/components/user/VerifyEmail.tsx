import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faSpinner, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_URL } from 'Global.d';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

type EmailVerificationData = {
  email: string;
};

const VerifyEmail = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [queryParams, setQueryParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [verified, setVerified] = useState<boolean>();
  const [isResend, setResend] = useState<boolean>();
  const [isFailResend, setIsFail] = useState<boolean>();
  const [verifyError, setVerifyError] = useState<string>(
    'Email verification link expired or invalid'
  );
  const {
    formState: { errors },
    register,
    handleSubmit,
    setError,
  } = useForm<EmailVerificationData>();

  const resendHandler: SubmitHandler<EmailVerificationData> = async (data): Promise<any> => {
    setResend(true);
    await fetch(`${API_URL}/email/resend-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 201) {
          setIsFail(false);
          setVerifyError(`Verification email sent to\n${data.email}`);
        }
        if (response.status === 400) {
          setIsFail(true);
          setTimeout(() => setResend(false), 30000);
          return response.json();
        }
      })
      .then((data) => {
        data?.message && setVerifyError(data.message);
      });
  };

  useEffect(() => {
    if (!queryParams.get('token')) window.location.href = '/';
    const verifyEmail = async () => {
      await fetch(`${API_URL}/email/verify?token=${queryParams.get('token')}`, {
        method: 'GET',
      })
        .then((response) => {
          if (response.status === 401) setVerified(false);
          if (response.status === 200) setVerified(true);
        })
        .finally(() => setLoading(false));
    };
    verifyEmail();
  }, [queryParams, setError]);

  const resendVerify = () => {
    return (
      <>
        <div className="mt-20 flex justify-center">
          <form
            className="my-auto h-full space-y-6 rounded-md border p-6 shadow-md"
            id="email-verify-form"
            onSubmit={handleSubmit(resendHandler)}
          >
            <div className="flex h-auto w-full justify-center">
              <FontAwesomeIcon className="h-12 md:h-24" icon={faEnvelope} />
            </div>
            <h3
              className={`text-md whitespace-pre-line text-center font-bold text-gray-900
                md:text-2xl`}
            >
              {verifyError}
            </h3>

            <div className="label-outline relative grid border-2 focus-within:border-once">
              <input
                required
                placeholder=" "
                className="focus:outline-hidden block w-full appearance-none place-self-center
                  bg-transparent p-3 text-lg"
                type="email"
                {...register('email', {
                  pattern: {
                    value:
                      // eslint-disable-next-line no-control-regex
                      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                    message: 'Please enter a valid email',
                  },
                })}
              />
              <label
                className="absolute top-0 -z-1 origin-0 bg-white p-3 text-lg text-black/50
                  duration-300"
              >
                Email
              </label>
            </div>

            {errors.email?.message && <span className="text-error">{errors.email.message}</span>}

            <div className="grid py-3">
              <button
                className={`${isResend && 'cursor-not-allowed'} duration-400 place-self-center
                  overflow-hidden rounded-md border-once-400 bg-once-400 p-2 font-bold text-gray-900
                  transition hover:bg-once disabled:hover:bg-once-400`}
                disabled={isResend && true}
              >
                Resend verification link
                {isFailResend === true && (
                  <FontAwesomeIcon className="pl-2 text-red-600" icon={faX} />
                )}
                {isFailResend === false && (
                  <FontAwesomeIcon className="pl-2 text-green-600" icon={faCheck} />
                )}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  };

  const successfulVerify = () => {
    return (
      <div
        className="mx-auto mt-20 flex w-fit flex-col justify-center space-y-6 rounded-md border p-6
          shadow-md"
      >
        <div>
          <h3 className="py-3 text-center text-lg font-bold text-gray-900 md:text-3xl">
            <FontAwesomeIcon className="pr-2 text-green-600" icon={faCheck} />
            Congratulations. Your email is now verified!
          </h3>
        </div>

        <a href="/login" className="place-self-center">
          <button
            className="duration-400 place-self-center overflow-hidden rounded-md border-once-400
              bg-once-400 p-2 font-bold text-gray-900 transition hover:bg-once"
          >
            Return to login
          </button>
        </a>
      </div>
    );
  };

  return (
    <>
      {loading && (
        <div className="flex h-96 items-end justify-center">
          <FontAwesomeIcon className="text-6xl" icon={faSpinner} spin />
        </div>
      )}
      {!verified && resendVerify()}
      {verified && successfulVerify()}
    </>
  );
};
export default VerifyEmail;
