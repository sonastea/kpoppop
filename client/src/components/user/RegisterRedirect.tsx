import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createLocalLinkedUser, linkDiscord, linkedDiscord } from 'components/auth/DiscordAPI';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type FormData = {
  username: string;
  email: string;
};

type DiscordUserData = {
  SocialType: string;
  existing?: string;
  id: string;
  username: string;
  discriminator: string;
  email: string;
  verified: boolean;
};

const RegisterRedirect = () => {
  const [data, setData] = useState<DiscordUserData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [accountCreated, setAccountCreated] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [linkExisting, setLinkExisting] = useState<boolean>();
  const [linked, setLinked] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setError,
  } = useForm<FormData>();

  useEffect(() => {
    const linked = async () => {
      await linkedDiscord()
        .then((data) => {
          if (data.statusCode === 403) navigate('/');
          if (data.linked) {
            setLinked(true);
            setTimeout(() => {
              navigate('/');
            }, 1000);
          }
          setData(data);
        })
        .finally(() => setLoading(false));
    };
    linked();
  }, []);

  const submitHandler: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);

    await createLocalLinkedUser(data).then((data) => {
      if (data.userId) {
        setAccountCreated(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
      if (data.errors) {
        setError('username', {
          type: 'manual',
          message: data.errors.User,
        });
      }
    });
    setIsSubmitting(false);
  };

  const linkAccountToDiscord = async () => {
    setIsSubmitting(true);

    const payload = { username: data?.existing, email: data?.email };
    await linkDiscord(payload).then((data) => {
      if (data.linked) setAccountCreated(true);
      else toast.error('Failed to link accounts. Please try again later.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    });
  };

  const InitialPrompt = () => {
    if (linkExisting === undefined && !linked) {
      return (
        <div className="mt-20 flex items-center justify-center">
          <div className="rounded-sm border border-once-200 bg-opacity-95 p-8 shadow-md md:max-w-lg">
            <form className="space-y-4" id="signupForm" onSubmit={handleSubmit(submitHandler)}>
              {data?.existing && (
                <>
                  <h3 className="py-3 text-center font-bold">
                    {`Found existing account with email ${data.email}`}
                  </h3>
                  <div className="space-y-3">
                    <button
                      className="duration-400 w-full overflow-hidden rounded-md border-once-400
                        bg-once-400 px-2 py-2 font-bold transition hover:bg-once"
                      type="button"
                      onClick={() => setLinkExisting(true)}
                    >
                      Link account <span className="underline">{data?.existing}</span>{' '}
                      {` to ${data?.SocialType}`}
                    </button>
                    <h3 className="text-center font-bold">or</h3>
                  </div>
                </>
              )}

              <button
                className="duration-400 w-full overflow-hidden rounded-md border-once-400
                  bg-once-400 px-2 py-2 font-bold transition hover:bg-once"
                type="button"
                onClick={() => setLinkExisting(false)}
              >
                Link and create a new account.
              </button>
            </form>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const LinkAccount = () => {
    if (linkExisting) {
      return (
        <div className="mt-20 flex items-center justify-center">
          <div className="rounded-sm border border-once-200 bg-opacity-95 p-8 shadow-md md:max-w-lg">
            <form className="space-y-4" id="signupForm">
              <h3 className="whitespace-nowrap py-3 text-center font-bold">
                {`Link account to ${data?.SocialType}?`}
              </h3>
              <div>
                <label className="mb-2 block font-bold">Username</label>
                <input
                  required
                  disabled
                  className="focus:outline-hidden w-full cursor-not-allowed rounded border
                    border-gray-800 p-1 focus:border-once"
                  type="text"
                  placeholder={data?.existing}
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">Email</label>
                <input
                  required
                  disabled
                  className="focus:outline-hidden w-full cursor-not-allowed rounded border
                    border-gray-800 p-1 focus:border-once"
                  type="email"
                  {...register('email', { required: true })}
                  placeholder={data?.email}
                />
              </div>

              <div className="flex space-x-3 py-3">
                <button
                  className="duration-400 w-1/2 overflow-hidden rounded-md border-once-400
                    bg-once-400 px-2 py-2 font-bold transition hover:bg-once"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => linkAccountToDiscord()}
                >
                  Yes
                </button>
                <button
                  className="duration-400 w-1/2 overflow-hidden rounded-md border-once-400
                    bg-once-400 px-2 py-2 font-bold transition hover:bg-once"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => window.location.reload()}
                >
                  No
                </button>
              </div>
              {accountCreated && (
                <div className="text-center">
                  Account linked successfully.
                  <br />
                  <FontAwesomeIcon className="mr-2" icon={faSpinner} spin />
                  Redirecting...
                </div>
              )}
            </form>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const CreateAccount = () => {
    if (!linkExisting && linkExisting !== undefined) {
      return (
        <div className="mt-20 flex items-center justify-center">
          <div className="rounded-sm border p-8 shadow-md md:max-w-lg">
            <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
              <h3 className="py-3 text-center font-semibold">Create new kpoppop account</h3>
              <div>
                <label className="mb-2 block font-bold">Username</label>
                <input
                  required
                  className="focus:outline-hidden w-full rounded border border-gray-800 p-1
                    focus:border-once"
                  type="text"
                  {...register('username', { required: true })}
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">Email</label>
                <input
                  required
                  className="focus:outline-hidden w-full rounded border border-gray-800 p-1
                    focus:border-once"
                  type="email"
                  {...register('email', { required: true })}
                />
              </div>
              <div className="text-center">
                {errors.username?.message && (
                  <span className="text-error">{errors.username.message}</span>
                )}
              </div>
              <div className="flex justify-center py-3">
                <button
                  className="duration-400 w-full cursor-pointer overflow-hidden rounded-md
                    border-once-400 bg-once-400 px-2 py-2 font-semibold transition hover:bg-once"
                  type="submit"
                >
                  Link to discord
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
    } else {
      return null;
    }
  };

  if (!loading) {
    return (
      <>
        {linked && (
          <div className="mt-20 text-center text-xl font-bold text-once">
            Found linked account, redirecting...
            <FontAwesomeIcon className="ml-2" icon={faSpinner} spin />
          </div>
        )}
        <InitialPrompt />
        <LinkAccount />
        <CreateAccount />
      </>
    );
  } else {
    return null;
  }
};

export default RegisterRedirect;
