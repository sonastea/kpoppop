import { MessageProps } from 'components/user/Messages';

const MessageWeekModal = ({ message, latest }: { message: MessageProps; latest: boolean }) => {
  const id = localStorage.getItem('userID');
  const userID = id && parseInt(id);
  const date = new Date().toLocaleTimeString([], {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
  const isAuthor = message.from === userID && !message.fromSelf;

  return (
    <li className={`mb-4 flex ${isAuthor ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`group max-w-[85%] ${isAuthor ? 'pr-2' : 'pl-2'}`}>
        <div
          className={`inline-block rounded-xl p-2 px-3 text-xs sm:text-xl ${
            isAuthor ? 'bg-once-400 rounded-br-sm' : 'bg-gray-200 rounded-bl-sm'
          }`}
        >
          <span>{message.content}</span>
        </div>
        <div
          className={`message-time-stamp text-xs sm:text-sm mx-1 group-hover:visible ${
            isAuthor ? 'text-end' : 'text-start'
          } ${latest ? 'visible' : 'hidden group-hover:block'}`}
        >
          <small className="text-gray-500">{date}</small>
        </div>
      </div>
    </li>
  );
};

export default MessageWeekModal;
