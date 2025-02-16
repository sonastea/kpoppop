import { KeyboardEvent, useRef } from 'react';
import MessagesSocket from './socket';
import { UserCardProps } from './UserCard';
import { Message } from 'proto/ipc/ts/messages';
import { useAuth } from 'contexts/AuthContext';
import { noop } from 'lodash';

const MessageInputBox = ({
  recipient,
  message,
  setMessage,
}: {
  recipient: UserCardProps;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const chatInput = useRef<HTMLTextAreaElement | null>(null);
  const { user } = useAuth();
  const ws = MessagesSocket((socket) => socket.ws);

  const encodedMessage = (userId: number): Uint8Array => {
    try {
      const m = Message.encode({
        convid: recipient.convid,
        to: recipient.id,
        from: userId,
        content: message,
        read: false,
        fromSelf: recipient.id === user?.id,
        createdAt: new Date().toISOString(),
      }).finish();
      return m;
    } catch (e) {
      noop(e);
      return new Uint8Array(0);
    }
  };

  const sendMessage = () => {
    if (message === '') return;
    if (ws && user && user.id) {
      const payload = encodedMessage(user.id);

      if (payload) {
        ws.send(payload);
      }
    }
  };

  const handleSendMessage = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="z-10 border border-slate-300 p-4">
      <div className="flex rounded-lg bg-white shadow-sm">
        <div className="flex-1">
          <textarea
            autoFocus={true}
            id="message-input"
            className="outline-hidden block w-full overflow-hidden whitespace-nowrap bg-transparent
              px-4 py-4"
            ref={chatInput}
            placeholder="Start a new message"
            style={{ resize: 'none' }}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleSendMessage}
          />
        </div>
        <div className="flex content-center items-center p-2">
          <div className="flex-1">
            <button
              className={`inline-block h-10 w-10 rounded-full hover:rounded-full
                hover:bg-once-200/75`}
              onClick={sendMessage}
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
