const UserCardSkeleton = () => {
  return (
    <li
      className="mx-2 mb-4 flex transform animate-pulse overflow-auto rounded bg-white p-4 shadow-md
        shadow-gray-300 transition-transform duration-300 hover:scale-95"
    >
      <div className="flex">
        <div className="relative h-12 w-12">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-300" />
        </div>
      </div>
      <div className="flex w-full">
        <div className="flex w-full flex-auto flex-col">
          <div className="mx-2 h-4 w-1/2 shrink rounded-md bg-gray-300" />
          <div className="mx-2 mt-2 h-4 rounded-md bg-gray-300" />
        </div>
        <div className="flex flex-initial basis-1/6 flex-col justify-between">
          <div className="h-4 rounded-md bg-gray-300" />
          <div className="h-4 w-4 self-center rounded-full bg-gray-300"></div>
        </div>
      </div>
    </li>
  );
};

export default UserCardSkeleton;
