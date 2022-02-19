import { useAuth } from '../contexts/AuthContext';

const MobileNav = () => {
  const { user, logout } = useAuth();

  const logoutHandler = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    logout();
  };

  return (
    <>
      <div>
        <div id="mobileNav">KPOPPOP</div>
      </div>

      <div className="justify-content-end flex-grow-1 pe-3">
        <a href="/memes">Memes</a>
        {user?.username && (
          <>
            <a href={`/user/profile/${user.username}`}>{user.username}</a>
            <div onClick={logoutHandler}>logout</div>
          </>
        )}
        {!user?.username && (
          <>
            <a href="/register">Signup</a>
            <a href="/login">Login</a>
          </>
        )}
      </div>
    </>
  );
};

export default MobileNav;
