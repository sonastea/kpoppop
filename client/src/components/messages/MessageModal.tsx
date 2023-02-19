import { MessageProps } from 'components/user/Messages';

const MessageModal = ({ message }: { message: MessageProps }) => {
  const id = localStorage.getItem('userID');
  const userID = id && parseInt(id);
  const isAuthor = message.from === userID && !message.fromSelf;

  return (
    <li className={`mb-4 flex ${isAuthor ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`max-w-[85%] ${isAuthor ? 'pr-2' : 'pl-2'}`}>
        <div
          className={`inline-block rounded-xl p-2 px-3 text-xs sm:text-xl ${
            isAuthor ? 'bg-once-400 rounded-br-sm' : 'bg-gray-200 rounded-bl-sm'
          }`}
        >
          <span>{message.content}</span>
        </div>
        <div
          className={`message-time-stamp text-xs sm:text-sm mx-1 ${
            isAuthor ? 'text-end' : 'text-start'
          }`}
        >
          <small className={`text-gray-500`}>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </small>
        </div>
      </div>
    </li>
  );
};

export default MessageModal;
