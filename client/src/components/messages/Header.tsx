const Header = () => {
  return (
    <div className="flex flex-shrink m-2">
      <div className="w-12 h-12 mr-2">
        <img
          className="w-12 h-12 rounded-full"
          src="https://pbs.twimg.com/profile_images/1602537939153494016/7BJJ6zE0_400x400.jpg"
          alt="chat-user"
        />
      </div>
      <div className="flex items-center">
        <h2 className="text-center text-xl py-1 font-bold inline-block">Placeholder</h2>
      </div>
    </div>
  );
};

export default Header;
