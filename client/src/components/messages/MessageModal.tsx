import { MessageProps } from 'components/user/Messages';

const MessageModal = ({ message, latest }: { message: MessageProps; latest: boolean }) => {
  const id = localStorage.getItem('userID');
  const userID = id && parseInt(id);
  const date = new Date(message.createdAt).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });

  const isAuthor = message.from === userID && !message.fromSelf;

  return (
    <li
      className={`${latest ? 'pb-3' : 'pb-1.5'} flex whitespace-pre break-normal ${
        isAuthor ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <div className={`group flex max-w-[85%] flex-col text-right ${isAuthor ? 'pr-2' : 'pl-2'}`}>
        <div
          className={`inline-block self-start rounded-xl p-2 px-3 text-left text-xs sm:text-xl ${
            isAuthor ? 'self-end rounded-br-sm bg-once-400' : 'rounded-bl-sm bg-gray-300/80'
          }`}
        >
          <span>{message.content}</span>
        </div>
        <div
          className={`message-time-stamp mx-1 text-xs sm:text-sm ${
            isAuthor ? 'text-end' : 'text-start'
          } ${
            latest
              ? 'visible'
              : `invisible opacity-0 transition-all duration-300 group-hover:visible
                group-hover:hover:opacity-100`
          }`}
        >
          <small className="text-gray-500">{date}</small>
        </div>
      </div>
    </li>
  );
};

export default MessageModal;
