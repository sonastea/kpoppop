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
      className={`${latest ? 'pb-3' : 'pb-1.5'} flex break-normal ${
        isAuthor ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <div className={`flex flex-col group max-w-[85%] text-right ${isAuthor ? 'pr-2' : 'pl-2'}`}>
        <div
          className={`inline-block rounded-xl p-2 px-3 self-start text-xs sm:text-xl text-left ${
            isAuthor ? 'bg-once-400 rounded-br-sm self-end' : 'bg-gray-300/80 rounded-bl-sm'
          }`}
        >
          <span>{message.content}</span>
        </div>
        <div
          className={`message-time-stamp text-xs sm:text-sm mx-1 ${
            isAuthor ? 'text-end' : 'text-start'
          } ${
            latest
              ? 'visible'
              : 'invisible opacity-0 group-hover:visible group-hover:hover:opacity-100 transition-all duration-300'
          }`}
        >
          <small className="text-gray-500">{date}</small>
        </div>
      </div>
    </li>
  );
};

export default MessageModal;
