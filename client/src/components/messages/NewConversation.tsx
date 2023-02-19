import { faCircleRight } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce as throttle } from 'lodash';
import { useEffect, useState } from 'react';
import { findUserIfExists } from './MessagesAPI';

const NewConversation = ({
  setDrafting,
  setRecipient,
}: {
  setDrafting: Function;
  setRecipient: Function;
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
    <div className="flex flex-col p-2 mx-2 md:mx-0">
      <div className="flex w-full md:w-1/3">
        <div className="flex w-full">
          <div className="relative w-full">
            <input
              className="block w-full text-center text-xl py-1 font-bold border border-slate-400 focus-visible:outline-none focus-visible:border-once-400"
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
              className="absolute top-1.5 right-0 group hover:bg-once-500/10 hover:rounded-full w-6 h-6"
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
