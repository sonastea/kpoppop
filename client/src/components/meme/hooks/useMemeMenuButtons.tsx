import { faFlag } from '@fortawesome/free-regular-svg-icons';
import { faBan, faGavel, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useRemoveMeme from 'hooks/useRemoveMeme';
import { toast } from 'react-toastify/unstyled';
import { toggleMeme } from '../MemeAPI';
import useReportMemeStore from './useReportMeme';

const useMemeMenuButtons = (userId: number | boolean, memeId: number) => {
  const { reportingMeme } = useReportMemeStore();
  const { confirmingOpen } = useRemoveMeme();

  const button_bg =
    'grid grid-flow-col auto-cols-max gap-x-2 p-2 py-1 hover:bg-gray-200/75 \
    focus-visible:outline-offset-[-1.5px] outline-slate-800';

  const removeMemeHandler = () => {
    confirmingOpen(memeId);
  };

  const reportMemeHandler = () => {
    if (!userId) window.location.href = '/login';
    else reportingMeme(memeId);
  };

  const toggleMemeHandler = async () => {
    await toggleMeme(memeId).then((data) => toast.warning(JSON.stringify(data)));
  };

  return {
    DefaultMenuButtons: (
      <>
        <div
          className={`${button_bg} ${!userId && 'cursor-not-allowed'}`}
          role="button"
          aria-label="report-meme"
          onClick={() => reportMemeHandler()}
          onKeyDown={(e) => {
            if (e.code === 'Space') reportMemeHandler();
          }}
          tabIndex={0}
        >
          <span>
            <FontAwesomeIcon
              height={18}
              width={18}
              className="text-red-500"
              icon={faFlag}
              flip="horizontal"
            />
          </span>
          <span className="whitespace-nowrap">{userId ? 'Report meme' : 'Login to report'}</span>
        </div>
      </>
    ),
    LoggedInMenuButtons: (
      <>
        <div
          className={`${button_bg} ${!userId && 'cursor-not-allowed'}`}
          role="button"
          aria-label="remove-meme"
          onClick={removeMemeHandler}
          onKeyDown={(e) => {
            if (e.code === 'Space') removeMemeHandler();
          }}
          tabIndex={0}
        >
          <span>
            <FontAwesomeIcon
              height={18}
              width={18}
              className="text-lg text-red-500"
              icon={faXmark}
              flip="horizontal"
            />
          </span>
          <span className="whitespace-nowrap">Remove</span>
        </div>
      </>
    ),
    ModerationMenuButtons: (
      <>
        <div
          className={`${button_bg}`}
          role="button"
          aria-label="toggle-meme"
          onClick={toggleMemeHandler}
          onKeyDown={(e) => {
            if (e.code === 'Space') toggleMemeHandler();
          }}
          tabIndex={0}
        >
          <span className="fa-layers my-auto w-[18px]">
            <FontAwesomeIcon height={18} className="text-red-600" icon={faBan} />
            <FontAwesomeIcon height={18} size="xs" icon={faGavel} />
          </span>
          <span className="whitespace-nowrap">Toggle active</span>
        </div>
      </>
    ),
  };
};

export default useMemeMenuButtons;
