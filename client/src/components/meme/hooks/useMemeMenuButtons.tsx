import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faBan, faGavel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toggleMeme } from '../MemeAPI';
import useReportMemeStore from './useReportMeme';

const useMemeMenuButtons = (isLoggedIn: boolean, id: string) => {
  const { reportingMeme } = useReportMemeStore();

  const button_bg = 'grid grid-flow-col auto-cols-max gap-x-2 p-2 py-1 hover:bg-gray-100';

  const removeMemeHandler = async (e: any) => {
    e.preventDefault();
    await toggleMeme(parseInt(id))
      .then((data) => window.alert(JSON.stringify(data)));
  }

  return {
    DefaultMenuButtons: (
      <>
        <div
          className={`${button_bg} ${!isLoggedIn && "cursor-not-allowed"} rounded-t-md`}
          role="button"
          aria-label="report-meme"
          onClick={() => reportingMeme(parseInt(id))}
        >
          <span>
            <FontAwesomeIcon className="text-red-500" icon={faFlag} flip="horizontal" />
          </span>
          <span className="whitespace-nowrap">{isLoggedIn ? "Report meme" : "Login to report"}</span>{' '}
        </div>
      </>
    ),
    ModerationMenuButtons: (
      <>
        <div
          className={`${button_bg} rounded-b-md`}
          role="button"
          aria-label="remove-meme"
          onClick={removeMemeHandler}
        >
          <span className="fa-layers my-auto">
            <FontAwesomeIcon className="text-red-600" icon={faBan} />
            <FontAwesomeIcon size="xs" icon={faGavel} />
          </span>
          <span className="whitespace-nowrap">Remove meme</span>
        </div>
      </>
    )
  };
};

export default useMemeMenuButtons;
