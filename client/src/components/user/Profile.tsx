import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from 'contexts/AuthContext';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NoProfile from './NoProfile';
import SocialMedias, { SocialMediaLink } from './SocialMedias';
import { fetchUser } from './UserAPI';

export type UserProfileData = {
  id: number;
  username: string;
  displayname?: string;
  role: string;
  banner?: string | FileList | undefined;
  photo?: string | FileList | undefined;
  memes?: Array<Post>;
  socialMedias?: Array<SocialMediaLink>;
  _count: CountData;
  errors?: { User: string };
};

export type Post = {
  id: number;
  title: string;
  url: string;
};

type CountData = {
  memes: number;
  likedMemes: number;
};

const Profile = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<UserProfileData>();
  const [showDisplayName, setShowDisplayName] = useState<boolean>();
  const { username } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    fetchUser(username as string).then((d) => {
      setData(d);
      if (d.displayname) setShowDisplayName(true);
      setLoading(false);
    });
  }, [username]);

  const toggleDisplayName = () => {
    setShowDisplayName((display) => !display);
  };

  if (!loading && data && !data?.errors?.User) {
    return (
      <div className="mx-auto h-auto w-full max-w-screen-2xl">
        <div className="mx-auto flex h-auto max-h-[192px] min-h-[192px] justify-center">
          <div className="w-full bg-cover bg-center">
            <a
              className="banner-anchor"
              href={`${data?.banner ? data?.banner : '/images/default_banner_white_1920x320.png'}`}
            >
              <img
                className="h-full w-full object-cover"
                src={`${data?.banner ? data?.banner : '/images/default_banner_white_1920x320.png'}`}
                alt="profile-banner"
              />
            </a>
          </div>
        </div>

        <div className="mb-6 flex h-full w-full min-w-0 flex-col items-stretch">
          <div className="flex h-auto w-full flex-wrap justify-center">
            <div className="order-1 flex w-full justify-center lg:order-2 lg:w-1/3">
              <div className="m-3 flex flex-col text-center">
                <span className="text-xl font-bold tracking-wide">{data._count.memes}</span>
                <span className="text-sm text-gray-600">Posts</span>
              </div>
              <div className="m-3 flex flex-col text-center">
                <span className="text-xl font-bold tracking-wide">{data._count.likedMemes}</span>
                <span className="text-sm text-gray-600">Likes</span>
              </div>
            </div>
            <div className="flex w-full justify-center lg:order-2 lg:w-1/4">
              <div className="relative max-w-[50px] sm:max-w-[75px] md:max-w-[100px]">
                <a className="rounded-full" href={data.photo && `${data.photo}`}>
                  <img
                    className="mt-[-50%] aspect-square rounded-full border border-black bg-white"
                    src={data.photo ? `${data.photo}` : '/images/default_photo_white_200x200.png'}
                    alt="profile"
                    onError={(e: BaseSyntheticEvent) => {
                      e.currentTarget.src = '/images/default_photo_white_200x200.png';
                    }}
                  />
                </a>
                {username === user?.username && (
                  <div className="absolute right-[-15px] top-0 text-xs md:text-sm">
                    <a href="/profile/settings" className="w-full text-gray-500 hover:text-once">
                      <FontAwesomeIcon icon={faGear} className="hover:animate-spin-slow" />
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full lg:order-3 lg:w-1/3">
              <SocialMedias socialMedias={data?.socialMedias} />
            </div>
          </div>
          <div className="fit-content mx-auto">
            <h3
              onClick={() => toggleDisplayName()}
              className="text-3xl leading-normal lg:m-6 lg:text-4xl"
            >
              {showDisplayName ? `${data?.displayname ?? ''} *` : data?.username}
            </h3>
          </div>
        </div>
        <div
          className="w-full columns-3 gap-3 space-y-6 p-3 text-center text-xs md:columns-4
            md:text-lg"
        >
          {data?.memes?.map((meme: Post) => {
            const title = meme.title.replace(/ /g, '_');
            return (
              <div key={meme.id} className="inline-flex text-center font-semibold">
                <a className="w-full xl:w-2/3" href={`/meme/${meme.id}/${title}`}>
                  {meme.url.split('.')[3] === 'mp4' ? (
                    <video key={meme.title} className="w-full rounded-lg" controls muted>
                      <source src={meme.url} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      className="w-full rounded-lg object-cover"
                      src={meme.url}
                      alt={meme.title}
                    />
                  )}
                  {meme.title}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return <NoProfile message={data?.errors?.User ?? 'User does not exist.'} />;
  }
};

export default Profile;
