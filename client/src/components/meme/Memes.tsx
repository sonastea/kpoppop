import { useAutoAnimate } from '@formkit/auto-animate/react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DAY } from 'Global.d';
import { useAuth } from 'contexts/AuthContext';
import useRemoveMemeStore from 'hooks/useRemoveMeme';
import { debounce } from 'lodash';
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { toast } from 'react-toastify';
import { fetchMemes } from './MemeAPI';
import MemeLazyImage from './MemeLazyImage';
import MemesSkeletonLoader from './MemesSkeletonLoader';

const ConfirmationDialog = lazy(() => import('./ConfirmationDialog'));
const InteractiveButtons = lazy(() => import('./InteractiveButtons'));
const LoginModal = lazy(() => import('../user/LoginModal'));
const MemeMenu = lazy(() => import('./MemeMenu'));
const ReportMemeModal = lazy(() => import('./ReportMemeModal'));
const UploadMeme = lazy(() => import('./UploadMeme'));

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

const Memes = () => {
  const [cursor, setCursor] = useState(0);
  const { user } = useAuth();
  const [posts, setPosts] = useState([] as any);
  const [loading, setLoading] = useState(true);

  const [postsRef] = useAutoAnimate<HTMLUListElement>();

  const [title, setTitle] = useState<string>('');
  const { memeId: currentMemeId } = useRemoveMemeStore();

  useEffect(() => {
    const preloadFirstMemes = async () => {
      const firstMemes = posts.slice(0, 3);
      const urlsToPreload = firstMemes.map((meme: Meme) => {
        let baseSrc = meme.url;
        if (!baseSrc.endsWith('.mp4')) {
          if (window.matchMedia('(max-width: 639px)').matches) {
            baseSrc += '?tr=w-336';
          } else if (window.matchMedia('(min-width: 640px)').matches) {
            baseSrc += '?tr=w-672';
          }
        }
        return baseSrc;
      });

      await Promise.all(
        urlsToPreload.map((url: string) => {
          return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = resolve;
            image.onerror = reject;
            image.src = url;
          });
        })
      );
    };

    if (posts.length > 0) {
      preloadFirstMemes().catch(() => {
        toast.error('Unable to fetch memes. Please try again later.');
      });
    }
  }, [posts]);

  const loadMorePosts = async () => {
    setLoading(false);
    await fetchMemes(cursor)
      .then((memes) => {
        if (memes.length !== 0) {
          setPosts((prev: Meme[]) => [...prev, ...memes]);
          setCursor(memes[memes.length - 1].id);
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
            setCursor(memes[memes.length - 1].id);
          }
        })
        .catch((error) => {
          if (error.message === 'Failed to fetch') {
            toast.error('Unable to fetch memes. Please try again later.');
          }
        })
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
      <Suspense>
        {!user && <LoginModal />}
        <ReportMemeModal />
        <ConfirmationDialog title={title} updateList={removeMemeFromList} />
      </Suspense>
      <ul className="meme-container flex flex-col items-center overflow-hidden" ref={postsRef}>
        {loading && <MemesSkeletonLoader />}
        <UploadMeme />
        {posts &&
          posts.map((meme: Meme, index: number) => {
            const title = meme.title.replace(/ /g, '_');
            return (
              <li
                className="my-2 w-full border bg-white shadow-sm sm:max-w-2xl sm:rounded-md"
                key={meme.id}
              >
                <div className="author-bar mx-4 mb-2 mt-4 flex flex-wrap leading-normal md:text-xl">
                  <a
                    className="px-1 font-bold hover:text-once-800
                      focus-visible:outline-offset-[-1px]"
                    href={`/user/${meme.author.username}`}
                  >
                    {meme.author.username}
                  </a>
                  <div className="ml-2 pr-4">
                    <span className="text-xs text-gray-500 sm:text-sm">
                      {DAY(meme.createdAt).fromNow()}
                    </span>
                  </div>
                  <div className="ml-auto">
                    <MemeMenu authorId={meme.authorId} memeId={meme.id} />
                  </div>
                </div>
                <div className="mx-4 my-2 flex">
                  <a
                    className="my-2 text-sm text-slate-900 outline-offset-4 hover:underline
                      md:text-lg"
                    href={`/meme/${meme.id}/${title}`}
                  >
                    {meme.title}
                  </a>
                </div>
                <div className="inline-flex w-full content-center justify-center">
                  <MemeLazyImage
                    key={meme.id}
                    id={meme.id}
                    src={meme.url}
                    title={meme.title}
                    alt={meme.title}
                    visibleByDefault={index < 2}
                  />
                </div>
                <InteractiveButtons
                  memeId={meme.id}
                  memeTitle={title}
                  liked={meme.likes.length > 0}
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
        className="page-number flex justify-center p-5"
      >
        {loading && <FontAwesomeIcon className="-z-1" icon={faSpinner} spin />}
      </div>
    </>
  );
};

export default Memes;
