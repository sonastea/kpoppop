import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_URL } from 'Global.d';

const DiscordLoginButton = () => {
  return (
    <>
      <button
        type="button"
        className="w-full font-bold pr-8 p-2 whitespace-nowrap rounded-md text-white"
        style={{ backgroundColor: '#7289da' }}
        onClick={() => window.location.assign(`${API_URL}/auth/discord/redirect`)}
      >
        <FontAwesomeIcon className="pr-8 fa-outline" icon={faDiscord} />
        Login with Discord
      </button>
    </>
  );
};
export default DiscordLoginButton;
