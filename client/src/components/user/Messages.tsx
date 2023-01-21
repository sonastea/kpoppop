import { faCirclePlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MessageInputBox from 'components/messages/MessageInputBox';
import NewConversation from 'components/messages/NewConversation';
import MessagesSocket from 'components/messages/socket';
import UserCard, { UserCardProps } from 'components/messages/UserCard';
import { useAuth } from 'contexts/AuthContext';
import { lazy, useEffect, useState } from 'react';

const Messages = () => {
  const { user } = useAuth();
  if (!user) window.location.href = '/login';

  const connectToMessages = MessagesSocket((socket) => socket.connect);
  const ws = MessagesSocket((socket) => socket.ws);

  const [conversations, setConversationsUsers] = useState<UserCardProps[]>({} as any);
  const [draft, setDrafting] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<UserCardProps | null>(null);
  const [message, setMessage] = useState<string | null>('');

  useEffect(() => {
    connectToMessages(user?.id);
  }, []);

  useEffect(() => {
    if (ws) {
      ws.on('connect', () => {
        ws.emit('user connected', (response: string) => console.log('user connected', response));
      });

      ws.on('conversations', (conversations: UserCardProps[]) => {
        /* console.log(conversations); */
        setConversationsUsers(conversations);
        conversations.forEach((participant) => {
          participant.messages.forEach((message) => {
            /* console.log(typeof(message.to), typeof(message.from), typeof(user.userId)) */
            message.fromSelf = message.from === user?.id;
          });
        });
      });

      ws.on('private message', (response) => {
        console.log(response);
      });
    }
  }, [ws, conversations]);

  const goBackToConversations = () => {
    setDrafting((prev) => !prev);
    setRecipient(null);
  };

  const setActiveRecipient = (user: UserCardProps) => {
    setDrafting(false);
    setRecipient(user);
  };

  return (
    <div className="w-full h-screen">
      <div className="flex h-full">
        <div className="flex-1 bg-gray-100 w-full h-full">
          <div className="m-auto w-11/12 h-full flex flex-col flex-wrap-reverse">
            <div className="flex-1 flex flex-col">
              <div className={`flex heading my-4`}>
                <h1 className="flex justify-center items-center h-full text-3xl text-gray-700 mr-4">
                  Messages
                </h1>
                <div
                  className="flex justify-center items-center hover:text-once-500"
                  role="button"
                  onClick={() => (recipient ? setRecipient(null) : goBackToConversations())}
                >
                  {draft || recipient ? (
                    <FontAwesomeIcon className="cursor-pointer" icon={faRotateLeft} />
                  ) : (
                    <FontAwesomeIcon className="cursor-pointer" icon={faCirclePlus} />
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-wrap-reverse h-full pt-6 md:pt-0">
                {conversations.length > 0 && (
                  <div
                    className={`${
                      recipient ? 'hidden md:flex w-1/3' : 'w-full md:w-1/3'
                    } md:pr-6 flex-col`}
                  >
                    <ul className={`flex-auto h-full overflow-auto w-full`}>
                      {conversations.map((user: UserCardProps, index: number) => {
                        return (
                          <UserCard user={user} setRecipient={setActiveRecipient} key={index} />
                        );
                      })}
                    </ul>
                  </div>
                )}
                {draft && <NewConversation setDrafting={setDrafting} setRecipient={setRecipient} />}
                {recipient && (
                  <div className="flex-1 flex flex-col">
                    <div className="flex flex-shrink m-2">
                      <div className="w-12 h-12 mr-2">
                        <img
                          className="w-12 h-12 rounded-full"
                          src={recipient.photo}
                          alt="no photo"
                        />
                      </div>
                      <div className="flex items-center">
                        <h2 className="text-center text-xl py-1 font-bold inline-block">
                          {recipient.username}
                        </h2>
                      </div>
                    </div>
                    <div className="messages flex flex-col overflow-auto"></div>
                    <MessageInputBox
                      recipient={recipient.userID}
                      message={message}
                      setMessage={setMessage}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
