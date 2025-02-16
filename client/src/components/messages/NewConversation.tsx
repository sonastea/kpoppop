import { faCircleRight } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce as throttle } from 'lodash';
import { useEffect, useState } from 'react';
import { findUserIfExists } from './MessagesAPI';
import { UserCardProps } from './UserCard';

const NewConversation = ({
  setDrafting,
  setRecipient,
}: {
  setDrafting: React.Dispatch<React.SetStateAction<boolean>>;
  setRecipient: (u: UserCardProps | null) => void;
}) => {
  const [newMessage, setNewMessage] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [username, setUsername] = useState<string>('');

  const findUser = throttle(() => {
    if (username.length < 1) {
      setError('Please enter a valid username.');
    } else {
      findUserIfExists(username).then((user) => {
        if (user.errors?.User) setError('Username does not exist.');

        if (user.id) {
          setDrafting(false);
          setNewMessage(false);
          setRecipient(user);
        }
      });
    }
  }, 1000);

  useEffect(() => {}, [newMessage]);

  return (
    <div className="mx-2 flex flex-col p-2 md:mx-0">
      <div className="flex w-full md:w-1/3">
        <div className="flex w-full">
          <div className="relative w-full">
            <input
              className="focus-visible:outline-hidden block w-full border border-slate-400 py-1
                text-center text-xl font-bold focus-visible:border-once-400"
              placeholder="Send to username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') findUser();
              }}
            />
            <button
              type="button"
              className="group absolute right-0 top-1.5 h-6 w-6 hover:rounded-full
                hover:bg-once-500/10"
              onClick={() => {
                findUser();
              }}
            >
              <FontAwesomeIcon
                className="group-hover:text-once-600"
                icon={faCircleRight}
                role="button"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-1 text-center">{error && <span className="text-error">{error}</span>}</div>
    </div>
  );
};

export default NewConversation;
