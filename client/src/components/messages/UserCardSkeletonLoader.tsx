import UserCardSkeleton from './UserCardSkeleton';

const MaxUserCards = new Array(Math.floor(Math.random() * 9) + 1).fill(null);

const UserCardSkeletonLoader = () => {
  return (
    <div className="flex md:mx-2 min-h-0">
      <div className="md:flex flex-col w-full md:w-2/5">
        <ul className="basis-full w-full min-h-0 overflow-auto no-scrollbar p-4">
          {MaxUserCards.map((_, index) => {
            return <UserCardSkeleton key={index} />;
          })}
        </ul>
      </div>
    </div>
  );
};

export default UserCardSkeletonLoader;
