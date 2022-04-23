import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createLocalLinkedUser, linkDiscord } from 'components/auth/DiscordAPI';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

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

  const {
    formState: { errors },
    register,
    handleSubmit,
    setError,
  } = useForm<FormData>();

  useEffect(() => {
    const link = async () => {
      await linkDiscord()
        .then((data) => {
          if (data.statusCode === 403) window.location.href = '/';
          if (data.linked) window.location.href = '/';
          setData(data);
        })
        .finally(() => setLoading(false));
    };
    link();
  }, []);

  const submitHandler: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);

    await createLocalLinkedUser(data).then((data) => {
      if (data.userId) {
        setAccountCreated(true);
        setTimeout(() => {
          window.location.href = '/';
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

  const InitialPrompt = () => {
    if (linkExisting === undefined) {
      return (
        <div className="flex items-center justify-center mt-20">
          <div className="p-8 border rounded shadow-md bg-opacity-95 md:max-w-lg border-once-200">
            <form className="space-y-4" id="signupForm" onSubmit={handleSubmit(submitHandler)}>
              {data?.existing && (
                <h3 className="py-3 font-bold text-center">
                  {`Found existing account with email ${data.email}`}
                </h3>
              )}

              <div className="space-y-3">
                {linkExisting && (
                  <>
                    <button
                      className="w-full px-2 py-2 overflow-hidden font-bold border-once-400 rounded-md bg-once-400 hover:bg-once transition duration-400"
                      type="button"
                      onClick={() => setLinkExisting(true)}
                    >
                      Link <span className="underline">{data?.existing}</span>{' '}
                      {` to ${data?.SocialType}`}
                    </button>
                    <h3 className="font-bold text-center">or</h3>
                  </>
                )}
                <button
                  className="w-full px-2 py-2 overflow-hidden font-bold border-once-400 rounded-md bg-once-400 hover:bg-once transition duration-400"
                  type="button"
                  onClick={() => setLinkExisting(false)}
                >
                  Link and create a new account.
                </button>
              </div>
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
        <div className="flex items-center justify-center mt-20">
          <div className="p-8 border rounded shadow-md bg-opacity-95 md:max-w-lg border-once-200">
            <form className="space-y-4" id="signupForm">
              <h3 className="py-3 font-bold text-center whitespace-nowrap">
                {`Link account to ${data?.SocialType}?`}
              </h3>
              <div>
                <label className="block mb-2 font-bold ">Username</label>
                <input
                  required
                  disabled
                  className="cursor-not-allowed w-full p-1 border border-gray-800 rounded focus:outline-none focus:border-once"
                  type="text"
                  placeholder={data?.existing}
                />
              </div>

              <div>
                <label className="block mb-2 font-bold ">Email</label>
                <input
                  required
                  disabled
                  className="cursor-not-allowed w-full p-1 border border-gray-800 rounded focus:outline-none focus:border-once"
                  type="email"
                  {...register('email', { required: true })}
                  placeholder={data?.email}
                />
              </div>

              <div className="flex py-3 space-x-3">
                <button
                  className="w-1/2 px-2 py-2 overflow-hidden font-bold border-once-400 rounded-md bg-once-400 hover:bg-once transition duration-400"
                  type="button"
                  disabled={isSubmitting}
                >
                  Yes
                </button>
                <button
                  className="w-1/2 px-2 py-2 overflow-hidden font-bold border-once-400 rounded-md bg-once-400 hover:bg-once transition duration-400"
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
        <div className="flex items-center justify-center mt-20">
          <div className="p-8 border rounded shadow-md md:max-w-lg">
            <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
              <h3 className="py-3 font-semibold text-center">Create new kpoppop account</h3>
              <div>
                <label className="block mb-2 font-bold ">Username</label>
                <input
                  required
                  className="w-full p-1 border border-gray-800 rounded focus:outline-none focus:border-once"
                  type="text"
                  {...register('username', { required: true })}
                />
              </div>

              <div>
                <label className="block mb-2 font-bold ">Email</label>
                <input
                  required
                  className="w-full p-1 border border-gray-800 rounded focus:outline-none focus:border-once"
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
                  className="cursor-pointer w-full px-2 py-2 overflow-hidden font-semibold border-once-400 rounded-md bg-once-400 hover:bg-once transition duration-400"
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
