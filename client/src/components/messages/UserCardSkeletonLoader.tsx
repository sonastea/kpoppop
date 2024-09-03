import UserCardSkeleton from './UserCardSkeleton';

const MaxUserCards = new Array(Math.floor(Math.random() * 9) + 1).fill(null);

const UserCardSkeletonLoader = () => {
  return (
    <div className="flex min-h-0 md:mx-2">
      <div className="w-full flex-col md:flex md:w-2/5">
        <ul className="no-scrollbar min-h-0 w-full basis-full overflow-auto">
          {MaxUserCards.map((_, index) => {
            return <UserCardSkeleton key={index} />;
          })}
        </ul>
      </div>
    </div>
  );
};

export default UserCardSkeletonLoader;
