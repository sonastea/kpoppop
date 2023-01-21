import { KeyboardEvent, useRef } from 'react';
import MessagesSocket from './socket';

type MessagePayload = {
  to: number;
  content: string | null;
};

const MessageInputBox = ({
  recipient,
  message,
  setMessage,
}: {
  recipient: number;
  message: string | null;
  setMessage: Function;
}) => {
  const chatInput = useRef<HTMLTextAreaElement | null>(null);
  const ws = MessagesSocket((socket) => socket.ws);

  const handleSendMessage = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === 'Enter' && !e.shiftKey) {
      const messagePayload: MessagePayload = {
        to: recipient,
        content: message,
      };
      ws?.emit('private message', messagePayload);
      setMessage('');
    }

    if (e.code === 'Enter' && !e.shiftKey) e.preventDefault();
  };

  return (
    <div className="pt-4 px-2 pb-10">
      <div className="bg-white shadow flex rounded-lg border border-slate-400">
        <div className="flex-1">
          <textarea
            className="w-full block outline-none py-4 px-4 bg-transparent whitespace-nowrap"
            ref={chatInput}
            placeholder="Start a new message"
            style={{ resize: 'none' }}
            rows={1}
            value={message || ''}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => handleSendMessage(e)}
          />
        </div>
        <div className="p-2 flex content-center items-center">
          <div className="flex-1">
            <button className="hover:bg-once-200/75 hover:rounded-full w-10 h-10 rounded-full inline-block">
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
