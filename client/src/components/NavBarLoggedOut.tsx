const NavBarLoggedOut = () => {
  return (
    <div className="items-center hidden md:flex space-x-2">
      <a href="/login" className="p-2 font-semibold border-b-2 border-transparent hover:border-once">
        Login
      </a>
      <a href="/register" className="p-2 font-semibold border-b-2 border-transparent text-once hover:border-once">
        Register
      </a>
    </div>
  );
};

export default NavBarLoggedOut;
