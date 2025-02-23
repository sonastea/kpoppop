import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_URL } from 'Global.d';
import { Link } from 'react-router-dom';

const DiscordLoginButton = () => {
  return (
    <Link to={`${API_URL}/auth/discord/redirect`}>
      <button
        type="button"
        className="w-full overflow-hidden whitespace-nowrap rounded-md border border-zinc-300
          bg-white p-2 pr-8 font-semibold text-slate-700 shadow-sm hover:text-[#7289da]"
      >
        <FontAwesomeIcon className="fa-outline pr-4 text-[#7289da]" icon={faDiscord} />
        Login with Discord
      </button>
    </Link>
  );
};
export default DiscordLoginButton;
