import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_URL } from 'Global.d';

const DiscordLoginButton = () => {
  return (
    <>
      <button
        type="button"
        className="w-full overflow-hidden whitespace-nowrap rounded-md border border-zinc-300
          bg-white p-2 pr-8 font-semibold text-slate-700 shadow hover:text-[#7289da]"
        onClick={() => window.location.assign(`${API_URL}/auth/discord/redirect`)}
      >
        <FontAwesomeIcon className="fa-outline pr-4 text-[#7289da]" icon={faDiscord} />
        Login with Discord
      </button>
    </>
  );
};
export default DiscordLoginButton;
