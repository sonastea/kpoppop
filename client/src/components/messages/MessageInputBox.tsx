import { KeyboardEvent, useRef } from 'react';
import MessagesSocket from './socket';
import { UserCardProps } from './UserCard';

export type MessagePayload = {
  convid: string | null;
  to: number;
  content: string | null;
  read: boolean;
};

const MessageInputBox = ({
  recipient,
  message,
  setMessage,
}: {
  recipient: UserCardProps;
  message: string | null;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const chatInput = useRef<HTMLTextAreaElement | null>(null);
  const ws = MessagesSocket((socket) => socket.ws);

  const handleSendMessage = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === 'Enter' && !e.shiftKey) {
      const messagePayload: MessagePayload = {
        convid: recipient.convid,
        to: recipient.id,
        content: message,
        read: false,
      };
      ws?.emit('private message', messagePayload);
      setMessage('');
    }

    if (e.code === 'Enter' && !e.shiftKey) e.preventDefault();
  };

  const handleClickSendMessage = () => {
    const messagePayload: MessagePayload = {
      convid: recipient.convid,
      to: recipient.id,
      content: message,
      read: false,
    };

    ws?.emit('private message', messagePayload);
    setMessage('');
  };

  return (
    <div className="z-10 border border-slate-300 p-4">
      <div className="flex rounded-lg bg-white shadow">
        <div className="flex-1">
          <textarea
            autoFocus={true}
            id="message-input"
            className="block w-full overflow-hidden whitespace-nowrap bg-transparent px-4 py-4
              outline-none"
            ref={chatInput}
            placeholder="Start a new message"
            style={{ resize: 'none' }}
            rows={1}
            value={message || ''}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => handleSendMessage(e)}
          />
        </div>
        <div className="flex content-center items-center p-2">
          <div className="flex-1">
            <button
              className={`inline-block h-10 w-10 rounded-full hover:rounded-full
                hover:bg-once-200/75`}
              onClick={handleClickSendMessage}
            >
              <span className="inline-block align-text-bottom">
                <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
                  <path
                    fill="#ff5fa2"
                    d="M3 20V4L22 12M5 17L16.85 12L5 7V10.5L11 12L5 13.5M5 17V7 13.5Z"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInputBox;
