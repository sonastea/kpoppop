import { faCirclePlus, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MessageInputBox from 'components/messages/MessageInputBox';
import MessagesList from 'components/messages/MessagesList';
import NewConversation from 'components/messages/NewConversation';
import MessagesSocket from 'components/messages/socket';
import UserCard, { UserCardProps } from 'components/messages/UserCard';
import UserCardSkeletonLoader from 'components/messages/UserCardSkeletonLoader';
import { useAuth } from 'contexts/AuthContext';
import {
  ContentMarkAsRead,
  Conversation,
  EventMessage,
  EventType,
  Message,
} from 'proto/ipc/ts/messages';
import { BaseSyntheticEvent, useEffect, useReducer, useRef, useState } from 'react';

export interface MessageProps extends Message {
  fromPhoto: string;
  fromUser: string;
  type: MessageType;
  unread?: number;
}

enum MessageAction {
  SET_INITIAL_CONVERSATIONS = 'SET_INITIAL_CONVERSATIONS',
  SET_RECIPIENT = 'SET_RECIPIENT',
  FROM_SELF = 'FROM_SELF',
  FROM_USER = 'FROM_USER',
  MARK_READ_MESSAGES = 'MARK_READ_MESSAGES',
}

export enum MessageType {
  CONNECT = 'CONNECT',
  CONVERSATIONS = 'CONVERSATIONS',
  MARK_AS_READ = 'MARK_AS_READ',
}

// Try/catch needed to decode protobuf message, so this just swallows the error and does nothing.
export const noop = (_e: unknown) => {};
const decodeMessage = (decoder: any, data: Uint8Array) => {
  try {
    return decoder.decode(data);
  } catch (e) {
    noop(e);
    return null;
  }
};

const getMessageHeaderName = (recipient: UserCardProps) => {
  const displayName = recipient?.displayname;
  const username = recipient?.username;

  if (displayName) {
    return `${displayName} (${username})`;
  } else {
    return username;
  }
};

const sendEventMessage = (
  ws: WebSocket,
  event_type: EventType,
  content: ContentMarkAsRead | undefined
) => {
  let message: EventMessage | undefined;

  switch (event_type) {
    case EventType.CONNECT:
      message = EventMessage.create({ event: event_type });
      break;
    case EventType.CONVERSATIONS:
      message = EventMessage.create({ event: event_type });
      break;
    case EventType.MARK_AS_READ:
      message = EventMessage.create({ event: event_type, reqRead: content });
      break;
    case EventType.UNKNOWN_TYPE:
    case EventType.UNRECOGNIZED:
      console.warn('Unknown or unrecognized event type:', event_type);
      return;
    default:
      console.error('Unsupported event type:', event_type);
      return;
  }

  if (message) {
    const encoded = EventMessage.encode(message).finish();
    ws.send(encoded);
  }
};

const Messages = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  if (!user) window.location.href = '/login';

  const connectToMessages = MessagesSocket((socket) => socket.connect);
  const disconnectFromMessages = MessagesSocket((prev) => prev.close);
  const reconnectToMessages = MessagesSocket((socket) => socket.reconnect);
  const resetReconnectAttempts = MessagesSocket((socket) => socket.resetAttempts);
  const [m, setConversations] = useReducer(handleConversations, {
    recipient: null,
    conversations: [] as UserCardProps[],
  });

  const ws = MessagesSocket((socket) => socket.ws);
  const [draft, setDrafting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | undefined>('');
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

  const sortConversations = (conversations: UserCardProps[] | Conversation[]) => {
    if (!conversations) {
      setLoading(false);
      return;
    }

    conversations.sort((a, b) => {
      const lastMessageA = new Date(a.messages[a.messages.length - 1].createdAt!).getTime();
      const lastMessageB = new Date(b.messages[b.messages.length - 1].createdAt!).getTime();

      return lastMessageB - lastMessageA;
    });
    setLoading(false);
  };

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        resetReconnectAttempts();
        sendEventMessage(ws, EventType.CONNECT, undefined);
        sendEventMessage(ws, EventType.CONVERSATIONS, undefined);
      };

      ws.onmessage = (event) => {
        const binaryData = new Uint8Array(event.data);
        const msg = decodeMessage(EventMessage, binaryData);

        if (msg) {
          switch (msg?.event) {
            case EventType.CONNECT:
              break;

            case EventType.CONVERSATIONS: {
              if (msg.respConvos) {
                sortConversations(msg.respConvos.conversations);
                setConversations({
                  type: MessageAction.SET_INITIAL_CONVERSATIONS,
                  conversations: msg.respConvos.conversations as UserCardProps[],
                });
              }
              break;
            }

            case EventType.MARK_AS_READ: {
              if (msg.respRead) {
                setConversations({
                  type: MessageAction.MARK_READ_MESSAGES,
                  message: msg.respRead as MessageProps,
                });
              }
              break;
            }
          }
        } else {
          const m = decodeMessage(Message, binaryData);
          const actionType = m.fromSelf ? MessageAction.FROM_SELF : MessageAction.FROM_USER;

          setConversations({
            type: actionType,
            message: m as MessageProps,
            ...(actionType === MessageAction.FROM_USER && { ws }),
          });
        }

        ws.onclose = (event) => {
          if (event.code !== 1000) {
            setLoading(true);
            reconnectToMessages();
          }
        };

        ws.onerror = (event) => {
          console.error('WebSocket error: ', event);
          setLoading(true);
          reconnectToMessages();
        };

        if (scrollBottomRef.current) {
          scrollBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }
  }, [ws, reconnectToMessages, resetReconnectAttempts]);

  useEffect(() => {
    connectToMessages();

    return () => {
      disconnectFromMessages();
    };
  }, [connectToMessages, disconnectFromMessages]);

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
    return (
      <div className="h-screen-mobile sm:h-screen-larger">
        <div
          className="flex h-full animate-pulse flex-col overflow-hidden bg-gray-200/60
            transition-transform duration-300"
        >
          <div className="heading m-4 flex flex-wrap">
            <h1 className="mr-4 justify-center text-3xl text-gray-500">Messages</h1>
            <div className="justify-center transition-transform" aria-hidden="true">
              <FontAwesomeIcon className="cursor-pointer text-gray-500" icon={faCirclePlus} />
            </div>
          </div>
          <UserCardSkeletonLoader />
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-screen-mobile sm:h-screen-larger">
        <div className="flex h-full flex-col overflow-hidden bg-gray-200/60">
          <div className="heading m-4 flex flex-wrap">
            <h1 className="mr-4 justify-center text-3xl text-gray-700">Messages</h1>
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
          <div className="flex min-h-0 md:mx-2">
            <div
              // eslint-disable-next-line max-len
              className={`${m.recipient ? 'hidden w-1/3 md:flex' : 'flex w-full md:w-1/3'} flex-col`}
            >
              <ul className="conversations-scroll-bar min-h-0 w-full overflow-auto">
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
              <div className="message-container flex w-full flex-1 flex-col md:relative md:mx-2">
                <div
                  className="message-header z-10 flex flex-col items-center border-b
                    border-b-slate-300 backdrop-blur-sm"
                >
                  <div className="align-center mr-2 flex h-12 w-12">
                    <a href={`/user/${m.recipient.username}`}>
                      <picture>
                        <source
                          media="(max-width: 639px)"
                          srcSet={
                            m.recipient.photo
                              ? `${m.recipient.photo}?tr=w-72,h-72`
                              : '/images/default_photo_white_200x200.png'
                          }
                        />
                        <img
                          className="h-12 w-12 rounded-full"
                          src={
                            m.recipient?.photo
                              ? `${m.recipient?.photo}?tr=w-150,h-150`
                              : '/images/default_photo_white_200x200.png'
                          }
                          alt={`${m.recipient?.username} profile`}
                          onError={(e: BaseSyntheticEvent) => {
                            e.currentTarget.src = '/images/default_photo_white_200x200.png';
                          }}
                        />
                      </picture>
                    </a>
                  </div>
                  <a className="hover:underline" href={`/user/${m.recipient.username}`}>
                    <h2
                      className="py-1 text-xl font-bold"
                      title={getMessageHeaderName(m.recipient)}
                    >
                      {m.recipient.displayname ?? m.recipient.username}
                    </h2>
                  </a>
                </div>
                <ul
                  className="message-window messages-scroll-bar h-screen w-full overflow-auto
                    break-all border-x-slate-300 py-1 md:border-x"
                >
                  <MessagesList messages={sortMessages(m?.conversations as UserCardProps[])} />
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
  ws?: WebSocket;
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
      const existingConversation = m.conversations.find((conv) => conv.id === action.message?.to);

      if (existingConversation && action.message) {
        existingConversation.convid = action.message?.convid ?? existingConversation.convid;
        existingConversation.messages.push(action.message);
        existingConversation.unread = 0;

        const updatedConversations = m.conversations.filter(
          (conv) => conv.id !== action.message?.to
        );

        return {
          recipient: m.recipient,
          conversations: [existingConversation, ...updatedConversations],
        };
      }

      const newConversation: UserCardProps = {
        ...m.recipient,
        username: m.recipient?.username ?? '',
        displayname: m.recipient?.displayname ?? '',
        convid: action.message?.convid ?? '',
        id: action.message?.to ?? 0,
        messages: action.message ? [action.message] : [],
        status: 'ACTIVE',
        unread: 0,
      };

      return {
        recipient: m.recipient,
        conversations: [newConversation, ...m.conversations],
      };
    }

    case MessageAction.FROM_USER: {
      const existingConvIndex = m.conversations.findIndex(
        (conv) => conv.convid === action.message?.convid
      );

      if (existingConvIndex === -1 || !action.message) {
        const recipientConvidExists = m.recipient?.convid;
        const recipientMatchesMessage = action.message?.to === m.recipient?.id;
        const recipientExists = m.recipient && action.message && action.message.convid;

        if (!recipientConvidExists && recipientMatchesMessage && recipientExists) {
          m.recipient!.convid = action.message!.convid;
        }

        const newConversation: UserCardProps = {
          displayname: action.message?.fromUser ?? '',
          convid: action.message?.convid ?? '',
          id: action.message?.to ?? 0,
          messages: action.message ? [action.message] : [],
          photo: action.message?.fromPhoto,
          status: 'ACTIVE',
          username: action.message?.fromUser ?? '',
          unread: 1,
        };

        return {
          recipient: m.recipient,
          conversations: [newConversation, ...m.conversations],
        };
      }

      const conversation = m.conversations[existingConvIndex];
      const matchRecipient = conversation.id === (action.message?.from && m.recipient?.id);

      if (conversation.id === (action.message?.from && m.recipient?.id) && action.ws) {
        const messagePayload: ContentMarkAsRead = {
          convid: conversation.convid,
          to: conversation.id,
        };
        sendEventMessage(action.ws, EventType.MARK_AS_READ, messagePayload);
      }

      conversation.messages.push({
        ...action.message,
        unread: matchRecipient ? conversation.unread : ++conversation.unread,
      });

      const updatedConversations = m.conversations.filter((_, i) => i !== existingConvIndex);
      updatedConversations.unshift(conversation);

      return {
        recipient: m.recipient,
        conversations: updatedConversations,
      };
    }

    case MessageAction.MARK_READ_MESSAGES: {
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
