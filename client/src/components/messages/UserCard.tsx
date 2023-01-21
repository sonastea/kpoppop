import { fetchUserById } from 'components/user/UserAPI';
import { useEffect, useState } from 'react';

export type UserCardProps = {
  userID: number;
  username?: string;
  displayname?: string;
  photo?: string;
  status?: string;
  messages: { to: number; createdAt: string; content: string; from: number; fromSelf?: boolean }[];
};

const UserCard = ({ user, setRecipient }: { user: UserCardProps; setRecipient: Function }) => {
  const [u, setUser] = useState<UserCardProps>(user);
  /* const [u, setUser] = useReducer<any, any>(reducer, user); */

  useEffect(() => {
    const getUpdatedUser = async () => {
      const updatedUser = await fetchUserById(user.userID);
      setUser(updatedUser);
    };
    getUpdatedUser();
  }, [user.userID]);

  useEffect(() => {}, [u]);

  return (
    <div
      className="cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md"
      key={user.userID}
      onClick={() => setRecipient(u)}
    >
      <div className="flex">
        <div className="w-12 h-12 relative">
          <img className="w-12 h-12 rounded-full mx-auto" src={u.photo} alt={'username'} />
          {/*Online status indicator*/}
          {/* <span className="absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white"></span> */}
        </div>
      </div>
      <div className="flex-1 px-2">
        <div className="truncate w-32">
          <span className="text-gray-800">{}</span>
        </div>
        <div>
          <small className="text-gray-600">
            {new Date(user.messages.at(0)!.createdAt).toLocaleDateString()}
          </small>
        </div>
      </div>
      <div className="flex-2 flex-col text-right">
        <small className="text-gray-500 whitespace-nowrap">
          {user.messages.at(0)?.content || 0}
        </small>
        {/*Unread message badge*/}
        {/* <div>
          <small className="text-xs bg-red-500 text-white rounded-full h-6 w-6 leading-6 text-center inline-block">
            {Math.floor(Math.random() * 10)}
          </small>
        </div> */}
      </div>
    </div>
  );
};

export default UserCard;
