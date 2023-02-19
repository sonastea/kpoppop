const UserCardSkeleton = () => {
  return (
    <li className="flex shadow-md shadow-gray-300 transform hover:scale-95 duration-300 transition-transform bg-white mb-4 rounded p-4 mx-2 md:mx-0 animate-pulse overflow-auto">
      <div className="flex">
        <div className="w-12 h-12 relative">
          <div className="w-12 h-12 rounded-full mx-auto bg-gray-300" />
        </div>
      </div>
      <div className="flex w-full">
        <div className="flex flex-col flex-auto w-full">
          <div className="shrink w-1/2 h-4 mx-2 bg-gray-300 rounded-md" />
          <div className="h-4 mx-2 mt-2 bg-gray-300 rounded-md" />
        </div>
        <div className="flex basis-1/6 flex-col flex-initial justify-between">
          <div className="h-4 bg-gray-300 rounded-md" />
          <div className="w-4 h-4 self-center bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </li>
  );
};

export default UserCardSkeleton;
