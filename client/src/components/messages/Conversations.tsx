import UserCard from './UserCard';

const Conversations = () => {
  return (
    <div className="hidden md:flex w-1/3 flex-col pr-6">
      <div className="flex-1 h-full overflow-auto">
        <UserCard />
      </div>
    </div>
  );
};

export default Conversations;
