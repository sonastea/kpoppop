const UserCard = () => {
  return (
    <div className="cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md">
      <div className="flex">
        <div className="w-12 h-12 relative">
          <img
            className="w-12 h-12 rounded-full mx-auto"
            src="https://pbs.twimg.com/profile_images/1602537939153494016/7BJJ6zE0_400x400.jpg"
            alt={"username"}
          />
          {/* <span className="absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white"></span> */}
        </div>
      </div>
      <div className="flex-1 px-2">
        <div className="truncate w-32">
          <span className="text-gray-800">Ryann Remo</span>
        </div>
        <div>
          <small className="text-gray-600">Yea, Sure!</small>
        </div>
      </div>
      <div className="flex-2 text-right">
          <small className="text-gray-500">15 April</small>
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
