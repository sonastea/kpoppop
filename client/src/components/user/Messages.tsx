import { faCirclePlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MessageInputBox, { MessagePayload } from 'components/messages/MessageInputBox';
import MessagesList from 'components/messages/MessagesList';
import NewConversation from 'components/messages/NewConversation';
import MessagesSocket from 'components/messages/socket';
import UserCard, { UserCardProps } from 'components/messages/UserCard';
import UserCardSkeletonLoader from 'components/messages/UserCardSkeletonLoader';
import { useAuth } from 'contexts/AuthContext';
import { useEffect, useReducer, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

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

  const hasRecipient = draft || m.recipient;

  const goBackToConversations = () => {
    setDrafting((prev) => !prev);
  };

  const sortMessages = (conversations: UserCardProps[]) => {
    let gm: { [index: string]: MessageProps[] } | undefined = conversations
      .find((conv) => conv.convid === m.recipient?.convid)
      ?.messages.reduce(
        (msgs, msg) => {
          const date = msg.createdAt.split('T')[0];
          if (!msgs[date]) {
            msgs[date] = [];
          }
          msgs[date].push(msg);

          return msgs;
        },
        {} as { [index: string]: MessageProps[] }
      );

    if (gm === undefined) {
      gm = conversations
        .find((conv) => conv.username === m.recipient?.username)
        ?.messages.reduce(
          (msgs, msg) => {
            const date = msg.createdAt.split('T')[0];
            if (!msgs[date]) {
              msgs[date] = [];
            }
            msgs[date].push(msg);

            return msgs;
          },
          {} as { [index: string]: MessageProps[] }
        );
    }

    if (gm === undefined) return {};
    return gm;
  };

  const setRecipient = (u: UserCardProps | null) => {
    setDrafting(false);
    setConversations({
      type: MessageAction.SET_RECIPIENT,
      recipient: u,
    });
  };

  const sortConversations = (conversations: UserCardProps[]) => {
    conversations.sort((a, b) => {
      if (
        a.messages[a.messages.length - 1].createdAt > b.messages[b.messages.length - 1].createdAt
      ) {
        return -1;
      }
      if (
        a.messages[a.messages.length - 1].createdAt < b.messages[b.messages.length - 1].createdAt
      ) {
        return 1;
      }
      return 0;
    });
    setLoading(false);
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
        setLoading(false);
      });

      ws.on('conversations', (conversations: UserCardProps[]) => {
        sortConversations(conversations);
        setConversations({
          type: MessageAction.SET_INITIAL_CONVERSATIONS,
          conversations: conversations,
        });
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
            ws: ws,
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
      <div className="h-[calc(100vh-80px)]">
        <div className="flex flex-col h-full bg-gray-200/60 overflow-hidden">
          <div className="flex heading m-4 flex-wrap">
            <h1 className="justify-center text-3xl text-gray-700 mr-4">Messages</h1>
            <div
              className="justify-center hover:text-once-500"
              role="button"
              onClick={() => (m.recipient ? setRecipient(null) : goBackToConversations())}
              aria-label={hasRecipient ? 'Back to conversations' : 'New conversation'}
            >
              {hasRecipient ? (
                <FontAwesomeIcon className="cursor-pointer" icon={faRotateLeft} />
              ) : (
                <FontAwesomeIcon className="cursor-pointer" icon={faCirclePlus} />
              )}
            </div>
          </div>

          {draft && <NewConversation setDrafting={setDrafting} setRecipient={setRecipient} />}
          <div className="flex md:mx-2 min-h-0">
            <div
              className={`${
                m.recipient ? 'hidden md:flex w-1/3' : 'flex w-full md:w-1/3'
              } flex-col`}
            >
              <ul className="w-full min-h-0 overflow-auto conversations-scroll-bar">
                {m.conversations.map((user: UserCardProps) => {
                  return (
                    <UserCard
                      convid={user.convid ?? ''}
                      user={user}
                      setRecipient={setRecipient}
                      key={user.id}
                    />
                  );
                })}
              </ul>
            </div>
            {m.recipient && (
              <div className="message-container flex flex-1 flex-col w-full md:relative md:mx-2">
                <div className="message-header border-b border-b-slate-300 flex flex-col items-center z-10 backdrop-blur-sm">
                  <div className="w-12 h-12 mr-2 flex align-center">
                    <a href={`/user/${m.recipient.username}`}>
                      <img
                        className="w-12 h-12 rounded-full"
                        src={m.recipient?.photo || '/images/default_photo_white_200x200.png'}
                        alt={`${m.recipient.username} profile`}
                      />
                    </a>
                  </div>
                  <a className="hover:underline" href={`/user/${m.recipient.username}`}>
                    <h2 className="text-xl py-1 font-bold">{m.recipient.username}</h2>
                  </a>
                </div>
                <ul className="message-window break-all overflow-auto w-full h-screen messages-scroll-bar md:border-x border-x-slate-300 py-1">
                  <MessagesList messages={sortMessages(m?.conversations)} />
                  <div ref={scrollBottomRef} />
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
  ws?: Socket;
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
                username: m.recipient?.displayname || m.recipient?.username,
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
      const fromSelfToUser = conversationNotFound && m.recipient?.id === action.message?.to;
      if (conversationNotFound) {
        return {
          recipient: recipient,
          conversations: [
            {
              ...(fromSelfToUser ? m.recipient : recipient),
              convid: action.message?.convid ?? null,
              id: action.message?.to ?? 0,
              messages: action.message ? [action.message] : [],
              username: fromSelfToUser ? m.recipient?.username : action.message?.fromUser,
              unread: fromSelfToUser ? 0 : 1,
            },
            ...m.conversations,
          ],
        };
      }

      const updatedConv = m.conversations.find((conv) => conv.convid === action.message?.convid);
      if (updatedConv === undefined || !action.message) return m;

      const matchRecipient = updatedConv.id === (action.message?.from && m.recipient?.id);
      if (matchRecipient) {
        const messagePayload: MessagePayload = {
          convid: updatedConv.convid,
          to: updatedConv.id,
          content: null,
          read: true,
        };
        action.ws?.emit('read message', messagePayload);
      }

      updatedConv.messages = [
        ...updatedConv.messages,
        {
          ...action.message,
          unread: matchRecipient ? updatedConv.unread : ++updatedConv.unread,
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
