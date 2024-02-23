import { useAutoAnimate } from '@formkit/auto-animate/react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DAY } from 'Global.d';
import useRemoveMemeStore from 'hooks/useRemoveMeme';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';
import InteractiveButtons from './InteractiveButtons';
import { fetchMemes } from './MemeAPI';
import MemeMenu from './MemeMenu';
import ReportMemeModal from './ReportMemeModal';
import LoginModal from 'components/user/LoginModal';
import { useAuth } from 'contexts/AuthContext';
import MemesSkeletonLoader from './MemesSkeletonLoader';

type Meme = {
  author: { username: string };
  active: boolean;
  authorId: number;
  id: number;
  title: string;
  url: string;
  createdAt: string;
  likes: { id: number }[];
  _count: {
    comments: number;
    likes: number;
  };
};

let cursor: number = 0;

const Memes = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([] as any);
  const [loading, setLoading] = useState(true);

  const [postsRef] = useAutoAnimate<HTMLUListElement>();

  const [title, setTitle] = useState<string>('');
  const { memeId: currentMemeId } = useRemoveMemeStore();

  const loadMorePosts = async () => {
    setLoading(false);
    await fetchMemes(cursor)
      .then((memes) => {
        if (memes.length !== 0) {
          setPosts((prev: Meme[]) => [...prev, ...memes]);
          cursor = memes[memes.length - 1].id;
        } else {
          window.removeEventListener('scroll', handleScroll.current);
        }
      })
      .catch((_error) => {});
  };

  const fetchData = debounce(loadMorePosts, 1000);

  useEffect(() => {
    const loadData = async () => {
      await fetchMemes(cursor)
        .then((memes) => {
          if (memes.length !== 0) {
            setPosts(memes);
            cursor = memes[memes.length - 1].id;
          }
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    };

    loadData().catch((error) => console.error(error));

    const handleScrollRef: any = handleScroll.current;
    window.addEventListener('scroll', handleScrollRef);
    return () => {
      window.removeEventListener('scroll', handleScrollRef);
    };
  }, []);

  const handleScroll = useRef((e: Event) => {
    const { innerHeight, scrollY } = e.currentTarget as Window;

    if (!loading && innerHeight + scrollY >= document.body.scrollHeight) {
      setLoading(true);
      fetchData();
    }
  });

  const removeMemeFromList = (memeId: number) => {
    setPosts((posts: Meme[]) => posts.filter((m: Meme) => m.id !== memeId));
  };

  useEffect(() => {
    const meme: Meme | undefined = posts.find((m: Meme) => m.id === currentMemeId);
    if (meme?.title) {
      setTitle(meme?.title ?? '');
    }
  }, [currentMemeId, posts]);

  return (
    <>
      {!user && <LoginModal />}
      <ConfirmationDialog title={title} updateList={removeMemeFromList} />
      <ul className="meme-container flex flex-col items-center overflow-hidden" ref={postsRef}>
        {loading && <MemesSkeletonLoader />}
        {posts &&
          posts.map((meme: Meme) => {
            const title = meme.title.replace(/ /g, '_');
            return (
              <li
                className="w-full my-2 shadow-sm sm:max-w-2xl sm:rounded-md bg-white border"
                key={meme.id}
              >
                <div className="flex flex-wrap overflow-auto leading-normal mx-4 mt-4 mb-2 md:text-xl author-bar">
                  <a
                    className="font-bold hover:text-once-700"
                    href={`/user/${meme.author.username}`}
                  >
                    {meme.author.username}
                  </a>
                  <div className="ml-2">
                    <span className="text-xs sm:text-sm text-gray-500">
                      {DAY(meme.createdAt).fromNow()}
                    </span>
                  </div>
                  <div className="ml-auto">
                    <ReportMemeModal id={meme.id} />
                    <MemeMenu authorId={meme.authorId} memeId={meme.id} />
                  </div>
                </div>
                <div className="flex mx-4 my-2">
                  <a
                    className="hover:underline text-slate-900 text-sm md:text-lg"
                    href={`/meme/${meme.id}/${title}`}
                  >
                    {meme.title}
                  </a>
                </div>
                {meme.url.split('.')[3] === 'mp4' ? (
                  <video
                    key={meme.title}
                    className="object-cover aspect-square w-full mx-auto md:max-h-96 md:aspect-auto"
                    controls
                    muted
                  >
                    <source src={meme.url} type="video/mp4" />
                  </video>
                ) : (
                  <a className="contents" href={`/meme/${meme.id}/${title}`}>
                    <img
                      className="w-full max-h-64 md:max-h-96 object-scale-down md:object-contain mt-2"
                      src={meme.url}
                      alt={meme.title}
                    />
                  </a>
                )}
                <InteractiveButtons
                  memeId={meme.id}
                  memeTitle={title}
                  liked={meme.likes.length !== 0}
                  comments={meme._count.comments}
                  likes={meme._count.likes}
                />
              </li>
            );
          })}
      </ul>

      <div
        onScroll={() => handleScroll.current}
        id="scroll-load-div"
        className="flex justify-center p-5 page-number"
      >
        {loading && <FontAwesomeIcon className="-z-1" icon={faSpinner} spin />}
      </div>
    </>
  );
};

export default Memes;
