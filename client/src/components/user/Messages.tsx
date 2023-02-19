import { faCirclePlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MessageInputBox from 'components/messages/MessageInputBox';
import MessageModal from 'components/messages/MessageModal';
import NewConversation from 'components/messages/NewConversation';
import MessagesSocket from 'components/messages/socket';
import UserCard, { UserCardProps } from 'components/messages/UserCard';
import UserCardSkeletonLoader from 'components/messages/UserCardSkeletonLoader';
import { useAuth } from 'contexts/AuthContext';
import { useEffect, useReducer, useRef, useState } from 'react';

export type MessageProps = {
  convid?: string | null;
  to: number;
  createdAt: string;
  content: string;
  from: number;
  fromSelf?: boolean;
  read?: boolean;
  unread?: number;
  fromUser?: string;
};

enum MessageAction {
  SET_INITIAL_CONVERSATIONS = 'SET_INITIAL_CONVERSATIONS',
  SET_RECIPIENT = 'SET_RECIPIENT',
  FROM_SELF = 'FROM_SELF',
  FROM_USER = 'FROM_USER',
  UPDATE_READ_MESSAGES = 'UPDATE_READ_MESSAGES',
}

const Messages = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  if (!user) window.location.href = '/login';

  const connectToMessages = MessagesSocket((socket) => socket.connect);
  const disconnectFromMessages = MessagesSocket((prev) => prev.close);
  const [m, setConversations] = useReducer(handleConversations, {
    recipient: null,
    conversations: [] as UserCardProps[],
  });

  const ws = MessagesSocket((socket) => socket.ws);
  const [draft, setDrafting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>('');
  const scrollBottomRef = useRef<HTMLDivElement | null>(null);

  const goBackToConversations = () => {
    setDrafting((prev) => !prev);
  };

  const setRecipient = (u: UserCardProps | null) => {
    setDrafting(false);
    setConversations({
      type: MessageAction.SET_RECIPIENT,
      recipient: u,
    });
  };

  useEffect(() => {
    if (ws) {
      ws.on('connect', () => {
        ws.emit('user connected', (response: string) =>
          console.log('Connected to kpoppop messages websocket.', response)
        );
      });

      ws.on('connect_error', (err) => {
        console.warn(err.message);
      });

      ws.on('conversations', (conversations: UserCardProps[]) => {
        setConversations({
          type: MessageAction.SET_INITIAL_CONVERSATIONS,
          conversations: conversations,
        });
        setLoading(false);
      });

      ws.on('private message', (message: MessageProps) => {
        if (message.fromSelf) {
          setConversations({
            type: MessageAction.FROM_SELF,
            message: message,
          });
        } else {
          setConversations({
            type: MessageAction.FROM_USER,
            message: message,
          });
        }

        if (scrollBottomRef.current) {
          scrollBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      });

      ws.on('read message', (message: MessageProps) => {
        setConversations({
          type: MessageAction.UPDATE_READ_MESSAGES,
          message: message,
        });
      });
    }
  }, [ws]);

  useEffect(() => {
    connectToMessages(user?.id);
  }, [connectToMessages, user?.id]);

  useEffect(() => {
    return () => {
      disconnectFromMessages();
    };
  }, [disconnectFromMessages]);

  useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView();
    }
  }, [m.recipient]);

  useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [m.conversations]);

  if (loading) {
    return <UserCardSkeletonLoader />;
  } else {
    return (
      <div className="h-[calc(100vh-80px)] overflow-auto">
        <div className="flex flex-col h-full bg-gray-100">
          <div className="flex heading m-4">
            <h1 className="justify-center text-3xl text-gray-700 mr-4">Messages</h1>
            <div
              className="justify-center hover:text-once-500"
              role="button"
              onClick={() => (m.recipient ? setRecipient(null) : goBackToConversations())}
            >
              {draft || m.recipient ? (
                <FontAwesomeIcon className="cursor-pointer" icon={faRotateLeft} />
              ) : (
                <FontAwesomeIcon className="cursor-pointer" icon={faCirclePlus} />
              )}
            </div>
          </div>

          {draft && <NewConversation setDrafting={setDrafting} setRecipient={setRecipient} />}
          <div className="flex md:mx-2 min-h-0">
            <div className={`${m.recipient ? 'hidden md:flex w-1/3' : 'w-full md:w-1/3'} flex-col`}>
              <ul className="basis-full w-full min-h-0 overflow-auto no-scrollbar">
                {m.conversations.map((user: UserCardProps) => {
                  return (
                    <UserCard
                      convid={user.convid ?? ''}
                      user={user}
                      setRecipient={setRecipient}
                      key={user.convid}
                    />
                  );
                })}
              </ul>
            </div>
            {m.recipient && (
              <div className="message-container flex flex-1 flex-col w-full md:relative md:mx-2">
                <div className="message-header border-b border-b-slate-300 flex flex-col items-center z-10 backdrop-blur-sm">
                  <div className="w-12 h-12 mr-2 flex align-center">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={m.recipient?.photo || '/images/default_photo_white_200x200.png'}
                      alt={`${m.recipient.username} profile`}
                    />
                  </div>
                  <h2 className="text-xl py-1 font-bold">{m.recipient.username}</h2>
                </div>
                <ul className="message-window break-all overflow-auto w-full h-screen messages-scroll-bar md:border-x border-x-slate-300 py-1">
                  {m.conversations
                    .find((conv: UserCardProps) => conv.id === m.recipient?.id)
                    ?.messages.map((message: MessageProps, index: number) => {
                      return <MessageModal message={message} key={index} />;
                    })}

                  <div ref={scrollBottomRef}></div>
                </ul>
                <MessageInputBox
                  recipient={m.recipient}
                  message={message}
                  setMessage={setMessage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Messages;

type ConversationsActionType = {
  type: MessageAction;
  conversations?: UserCardProps[];
  message?: MessageProps;
  recipient?: UserCardProps | null;
};

type MessagesProps = {
  conversations: UserCardProps[];
  recipient: UserCardProps | null;
};

function handleConversations(
  m: { recipient: UserCardProps | null; conversations: UserCardProps[] },
  action: ConversationsActionType
): MessagesProps {
  switch (action.type) {
    case MessageAction.SET_INITIAL_CONVERSATIONS: {
      if (action.conversations) return { recipient: null, conversations: action.conversations };
      else return m;
    }

    case MessageAction.SET_RECIPIENT: {
      if (action.recipient !== undefined)
        return { recipient: action.recipient, conversations: m.conversations };
      return m;
    }

    case MessageAction.FROM_SELF: {
      return {
        recipient: m.recipient,
        conversations: m.conversations.some((conv) => conv.id === action.message?.to)
          ? m.conversations.map((conv) => {
              if (conv.id === action.message?.to && action.message.convid) {
                return {
                  ...conv,
                  convid: action.message.convid,
                  messages: [...conv.messages, action.message],
                  unread: 0,
                };
              }
              return { ...conv };
            })
          : [
              ...m.conversations,
              {
                convid: action.message?.convid ?? null,
                id: action.message?.to ?? 0,
                messages: Array(1).fill(action.message),
                unread: 0,
              },
            ],
      };
    }

    case MessageAction.FROM_USER: {
      let recipient: UserCardProps | null = m.recipient;
      if (m.recipient && action.message && action.message.convid) {
        recipient = {
          ...m.recipient,
          convid: action.message.convid ?? null,
        };
      }

      const conversationNotFound = !m.conversations.some(
        (conv) => conv.convid === action.message?.convid
      );
      if (conversationNotFound) {
        return {
          recipient: recipient,
          conversations: [
            {
              ...recipient,
              convid: action.message?.convid ?? null,
              id: action.message?.to ?? 0,
              messages: action.message ? [action.message] : [],
              username: action.message?.fromUser,
              unread: conversationNotFound ? 1 : 0,
            },
            ...m.conversations,
          ],
        };
      }

      const updatedConv = m.conversations.find((conv) => conv.convid === action.message?.convid);
      if (updatedConv === undefined || !action.message) return m;
      updatedConv.messages = [
        ...updatedConv.messages,
        {
          ...action.message,
          unread:
            updatedConv.id === action.message?.from ? ++updatedConv.unread : updatedConv.unread,
        },
      ];

      const conversations = m.conversations.filter((conv) => {
        if (conv.convid !== action.message?.convid) {
          return { ...conv };
        }
        return false;
      });
      conversations.unshift(updatedConv);

      return {
        recipient: recipient,
        conversations: conversations,
      };
    }

    case MessageAction.UPDATE_READ_MESSAGES: {
      return {
        ...m,
        conversations: m.conversations.map((conv) => {
          if (conv.convid === action.message?.convid) {
            return {
              ...conv,
              unread: action.message?.unread ?? conv.unread,
            };
          }
          return { ...conv };
        }),
      };
    }

    default:
      return m;
  }
}
