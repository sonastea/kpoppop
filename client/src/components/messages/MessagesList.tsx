import { MessageProps } from 'components/user/Messages';
import { MutableRefObject } from 'react';
import Message from './Message';

type MessageListProps = {
  [key: string]: MessageProps[];
};

export type MessageModalProps = {
  daysFromNow: number;
  message: MessageProps;
  mostRecent: boolean;
  showDate: boolean;
};

const DAY = 86400000;

const MessagesList = ({
  messages,
  bottomRef,
}: {
  messages: MessageListProps;
  bottomRef: MutableRefObject<HTMLLIElement | null>;
}) => {
  return (
    <>
      {Object.entries(messages).map(([date, msgs]) => {
        const daysFromNow =
          (Date.parse(new Date().toISOString().split('T')[0]) - Date.parse(date)) / DAY;

        return msgs.map((message, index) => {
          const mostRecent = index === msgs.length - 1;
          const showDate = mostRecent && daysFromNow === 0;

          return (
            <Message
              daysFromNow={daysFromNow}
              message={message}
              mostRecent={mostRecent}
              key={date + index}
              showDate={showDate}
              ref={bottomRef}
            />
          );
        });
      })}
    </>
  );
};

export default MessagesList;
