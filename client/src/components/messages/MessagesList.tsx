import { MessageProps } from 'components/user/Messages';
import MessageDayModal from './MessageDayModal';
import MessageModal from './MessageModal';
import MessageWeekModal from './MessageWeekModal';

type MessageListProps = {
  [key: string]: MessageProps[];
};

const DAY = 86400000;

const MessagesList = ({ messages }: { messages: MessageListProps }): any => {
  return (
    <>
      {Object.entries(messages).map(([date, msgs]) => {
        const daysFromNow =
          (Date.parse(new Date().toISOString().split('T')[0]) - Date.parse(date)) / DAY;

        return msgs.map((message, index) => {
          const latest = index === 0 || messages[date].length === index + 1;
          if (daysFromNow === 0) {
            return <MessageModal message={message} latest={latest} key={date + index} />;
          } else if (daysFromNow < 7) {
            return <MessageDayModal message={message} latest={latest} key={date + index} />;
          } else {
            return <MessageWeekModal message={message} latest={latest} key={date + index} />;
          }
        });
      })}
    </>
  );
};

export default MessagesList;
