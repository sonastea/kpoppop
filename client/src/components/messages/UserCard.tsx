import { MessageProps } from 'components/user/Messages';
import { useEffect, useReducer } from 'react';
import { MessagePayload } from './MessageInputBox';
import MessagesSocket from './socket';

export type UserCardProps = {
  convid: string | null;
  displayname?: string | null;
  id: number;
  messages: MessageProps[];
  photo?: string;
  status?: string;
  username?: string;
  unread: number;
};

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
  setRecipient: Function;
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
    const messagePayload: MessagePayload = {
      convid: convid,
      to: user.id,
      content: null,
      read: true,
    };
    if (user) {
      setRecipient(user);
    }
    ws?.emit('read message', messagePayload);
  };

  return (
    <li
      className="flex cursor-pointer transform hover:scale-95 duration-300 transition-transform bg-white mb-4 rounded p-4 shadow-sm mx-2 md:mx-0"
      onClick={updateReadStatus}
    >
      <div className="shrink-0">
        <div className="w-12 h-12 relative">
          <img
            className="w-12 h-12 rounded-full mx-auto"
            src={state.user.photo || '/images/default_photo_white_200x200.png'}
            alt={`${user.username || user.displayname}`}
          />
          {/*Online status indicator*/}
          {/* <span className="absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white"></span> */}
        </div>
      </div>
      <div className="flex flex-col min-w-0 w-full">
        <div className="flex mx-2 w-full">
          <div className="flex-auto truncate">
            <span className="text-gray-800">{state.user?.displayname || state.user?.username}</span>
          </div>
          <small className="flex h-6 text-gray-600">
            {state.latestDate === 'Invalid Date' ? '' : state.latestDate}
          </small>
        </div>
        <div className="flex mx-2 min-w-0 w-full">
          <div className="flex flex-auto h-6 min-w-0">
            <span className="h-6 text-gray-500 truncate">
              {user?.messages?.slice(-1)[0]?.content || ''}
            </span>
          </div>
          {user.unread > 0 && (
            <small className="self-center text-xs bg-once-600 text-white rounded-full h-4 w-4 leading-4 text-center inline-block shrink-0 mx-2">
              {user.unread}
            </small>
          )}
        </div>
      </div>
    </li>
  );
};

export default UserCard;
