import { MessageProps } from 'components/user/Messages';
import { BaseSyntheticEvent, useEffect, useReducer } from 'react';
import MessagesSocket from './socket';
import { Conversation, EventMessage, EventType } from 'proto/ipc/ts/messages';

export interface UserCardProps extends Conversation {
  messages: MessageProps[];
}

type UserCardState = {
  user: UserCardProps;
  latestDate: string | undefined;
  unread: number;
};

type UserCardAction = {
  type: string;
  user: UserCardProps;
};

function UserCardReducer(state: UserCardState, action: UserCardAction) {
  if (action.type === 'update') {
    if (state?.user) {
      return {
        ...state,
        user: action.user,
      };
    }
    return state;
  }
  return state;
}

const UserCard = ({
  convid,
  user,
  setRecipient,
}: {
  convid: string;
  user: UserCardProps;
  setRecipient: (u: UserCardProps | null) => void;
}) => {
  const [state, dispatch] = useReducer(UserCardReducer, {
    user: user,
    latestDate: new Date(user?.messages?.at(-1)?.createdAt ?? NaN).toLocaleDateString(),
    unread: user.unread,
  });
  const ws = MessagesSocket((socket) => socket.ws);

  useEffect(() => {
    dispatch({
      type: 'update',
      user: user,
    });
  }, [user]);

  const updateReadStatus = () => {
    if (user) {
      setRecipient(user);
    }
    const message = EventMessage.create({
      event: EventType.MARK_AS_READ,
      reqRead: {
        convid: convid,
        to: parseInt(localStorage.getItem('userID')!),
        from: user.id,
      },
    });
    const encoded = EventMessage.encode(message).finish();
    ws?.send(encoded);
  };

  return (
    <li
      className="mx-2 mb-4 flex transform cursor-pointer overflow-x-auto rounded border bg-white p-4
        shadow-sm transition-transform duration-300 hover:scale-95 md:mx-0"
      onClick={updateReadStatus}
    >
      <div className="shrink-0">
        <div className="relative h-12 w-12">
          <picture>
            <source
              media="(max-width: 639px)"
              srcSet={
                state.user.photo
                  ? `${state.user.photo}?tr=w-72,h-72`
                  : '/images/default_photo_white_200x200.png'
              }
            />
            <img
              className="mx-auto h-12 w-12 rounded-full"
              src={
                state.user.photo
                  ? `${state.user.photo}?tr=w-150,h-150`
                  : '/images/default_photo_white_200x200.png'
              }
              alt="profile"
              onError={(e: BaseSyntheticEvent) => {
                e.currentTarget.src = '/images/default_photo_white_200x200.png';
              }}
            />
          </picture>

          {/*Online status indicator*/}
          {/* <span className="absolute w-4 h-4 bg-green-400 rounded-full
          right-0 bottom-0 border-2 border-white"></span> */}
        </div>
      </div>
      <div className="flex w-full min-w-0 flex-col">
        <div className="mx-2 flex w-full">
          <div className="flex-auto truncate">
            <span className="text-gray-800">{state.user?.displayname || state.user?.username}</span>
          </div>
          <small className="flex h-6 text-gray-600">
            {state.latestDate === 'Invalid Date' ? '' : state.latestDate}
          </small>
        </div>
        <div className="mx-2 flex w-full min-w-0">
          <div className="flex h-6 min-w-0 flex-auto">
            <span className="h-6 truncate whitespace-pre text-gray-500">
              {user?.messages?.slice(-1)[0]?.content || ''}
            </span>
          </div>
          {user.unread > 0 && (
            <small
              className="mx-2 inline-block h-4 w-4 shrink-0 self-center rounded-full bg-once-600
                text-center text-xs leading-4 text-white"
            >
              {user.unread}
            </small>
          )}
        </div>
      </div>
    </li>
  );
};

export default UserCard;
