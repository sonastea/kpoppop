import { useEffect, useState } from 'react';
import { MessageModalProps } from './MessagesList';

const Message = ({ daysFromNow, message, latest, showDate }: MessageModalProps) => {
  const id = localStorage.getItem('userID');
  const userID = id && parseInt(id);
  const [date, setDate] = useState<string>();
  const [latestDate, setLatestDate] = useState<string>();

  useEffect(() => {
    if (daysFromNow === 0) {
      setDate(
        new Date(message.createdAt).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        })
      );
    } else if (daysFromNow < 7) {
      setDate(
        new Date(message.createdAt).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        })
      );
      setLatestDate(
        new Date(message.createdAt).toLocaleTimeString([], {
          weekday: 'short',
          hour: 'numeric',
          minute: '2-digit',
        })
      );
    } else {
      setDate(
        new Date(message.createdAt).toLocaleTimeString([], {
          month: 'short',
          day: 'numeric',
          weekday: 'short',
          hour: 'numeric',
          minute: '2-digit',
        })
      );
      setLatestDate(date);
    }
  }, [daysFromNow, message.createdAt]);

  const isAuthor = message.from === userID && !message.fromSelf;

  return (
    <li
      className={`${latest ? 'pb-2' : 'pb-1'} group flex whitespace-break-spaces ${
        isAuthor ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <div className={`flex max-w-[85%] flex-col text-right ${isAuthor ? 'pr-2' : 'pl-2'}`}>
        <div
          className={`inline-block self-start rounded-xl p-2 px-3 text-left text-xs sm:text-xl ${
            isAuthor ? 'self-end rounded-br-sm bg-once-400' : 'rounded-bl-sm bg-gray-300/80'
          }`}
        >
          <p>{message.content}</p>
        </div>
        {latest && (
          <div
            className={`message-time-stamp mx-1 flex-1 content-center text-xs sm:text-sm ${
              isAuthor ? 'text-end' : 'text-start'
            }`}
          >
            <small className="text-gray-500">{latest ? latestDate : latestDate}</small>
          </div>
        )}
      </div>
      {!showDate && !latest && (
        <div
          className={`message-time-stamp mx-3 flex-1 content-center text-xs sm:text-sm ${
            isAuthor ? 'text-start' : 'text-end'
          }
          ${'opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100'}`}
        >
          <small className="text-gray-500">{date}</small>
        </div>
      )}
    </li>
  );
};

export default Message;
