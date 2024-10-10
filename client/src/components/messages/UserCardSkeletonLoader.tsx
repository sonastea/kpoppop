import UserCardSkeleton from './UserCardSkeleton';

const MaxUserCards = new Array(Math.floor(Math.random() * 9) + 1).fill(null);

const UserCardSkeletonLoader = () => {
  return (
    <div className="flex min-h-0 md:mx-2">
      <div className="flex w-full flex-col md:w-1/3">
        <ul className="conversations-scroll-bar min-h-0 w-full overflow-auto">
          {MaxUserCards.map((_, index) => {
            return <UserCardSkeleton key={index} />;
          })}
        </ul>
      </div>
    </div>
  );
};

export default UserCardSkeletonLoader;
