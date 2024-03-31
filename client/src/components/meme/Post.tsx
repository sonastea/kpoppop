import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DAY } from 'Global.d';
import { lazy, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InteractiveButtons from './InteractiveButtons';
import InteractiveComments, { type CommentProps } from './InteractiveComments';
import { fetchMeme } from './MemeAPI';
import PostNonexistent from './PostNonexistent';

const ReportCommentModal = lazy(() => import('components/user/ReportCommentModal'));
const ReportUserModal = lazy(() => import('components/user/ReportUserModal'));

type PostProps = {
  author: {
    id: number;
    username: string;
  };
  id: number;
  title: string;
  url: string;
  createdAt: string;
  likes: { id: number }[];
  _count: {
    comments: number;
    likes: number;
  };
  comments: CommentProps[];
};

const Post = () => {
  const { memeid } = useParams();
  const [meme, setMeme] = useState<PostProps>({} as PostProps);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeme = async (id: number) => {
      setLoading(true);
      await fetchMeme(id).then((data: PostProps) => {
        setMeme(data);
      });
      setLoading(false);
    };
    loadMeme(parseInt(memeid!));
  }, [setMeme, memeid]);

  if (loading) return <FontAwesomeIcon id="scroll-load-div" icon={faSpinner} spin />;

  return Object.keys(meme).length === 0 ? (
    <PostNonexistent message={'Post does not exist'} />
  ) : (
    <>
      <ReportCommentModal />
      <ReportUserModal user={{ id: meme.author.id, username: meme.author.username }} />
      <div className="mb-2 shadow-sm md:mx-auto md:w-3/5">
        <div className="flex flex-col overflow-auto border-x md:flex-row md:flex-wrap">
          <div className="m-2 w-64 max-w-3xl self-center md:w-80 2xl:w-96">
            {meme.url.split('.')[3] === 'mp4' ? (
              <video key={meme.title} className="object-fit max-h-lg w-auto" controls muted>
                <source src={meme.url} type="video/mp4" />
              </video>
            ) : (
              <img className="w-full object-fill" src={meme.url} alt={meme.title} />
            )}
          </div>
          <div className="m-2 flex-1">
            <div className="text-md flex flex-col items-end text-once-900 md:text-xl">
              <a href={`/user/${meme.author.username}`}>{meme.author.username}</a>
              <span className="text-xs text-once-900/70 sm:text-sm">
                {DAY(meme.createdAt).fromNow(false)}{' '}
              </span>
            </div>
            <div className="grid h-3/4 content-center text-sm md:text-xl">{meme.title}</div>
          </div>
        </div>
        <div className="border-x border-t border-gray-300">
          <InteractiveButtons
            memeId={parseInt(memeid!, 10)}
            memeTitle={meme.title}
            liked={meme.likes.length !== 0}
            comments={meme._count.comments}
            likes={meme._count.likes}
          />
        </div>
        <div className="divide-y divide-gray-300 border border-gray-300">
          <InteractiveComments
            memeId={parseInt(memeid!, 10)}
            ownerId={meme.author.id}
            comments={meme.comments}
          />
        </div>
      </div>
    </>
  );
};

export default Post;
