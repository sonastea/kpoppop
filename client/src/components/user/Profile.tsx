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
      <div className="w-full h-auto mx-auto max-w-screen-2xl">
        <div className="mx-auto flex justify-center h-auto lg:min-h-[320px] max-h-[320px]">
          <div className="bg-center bg-cover w-full">
            <a
              className="banner-anchor"
              href={`${data?.banner ? data?.banner : '/images/default_banner_white_1920x320.png'}`}
            >
              <img
                className="w-full h-full"
                src={`${data?.banner ? data?.banner : '/images/default_banner_white_1920x320.png'}`}
                alt="profile-banner"
              />
            </a>
          </div>
        </div>

        <div className="flex flex-col w-full h-full min-w-0 mb-6">
          <div className="flex flex-wrap items-center justify-center w-full h-auto">
            <div className="flex justify-center order-1 w-full lg:order-2 lg:w-1/3">
              <div className="flex flex-col m-3 text-center">
                <span className="text-xl font-bold tracking-wide">{data._count.memes}</span>
                <span className="text-sm text-gray-600">Posts</span>
              </div>
              <div className="flex flex-col m-3 text-center">
                <span className="text-xl font-bold tracking-wide">{data._count.likedMemes}</span>
                <span className="text-sm text-gray-600">Likes</span>
              </div>
            </div>
            <div className="flex justify-center w-full lg:order-2 lg:w-1/4">
              <div className="relative">
                <a className="rounded-full" href={data.photo && `${data.photo}`}>
                  <img
                    className="bg-white rounded-full aspect-square mt-[-50%] border border-black w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48"
                    src={data.photo ? `${data.photo}` : '/images/default_photo_white_200x200.png'}
                    alt="profile"
                    onError={(e: BaseSyntheticEvent) => {
                      e.currentTarget.src = '/images/default_photo_white_200x200.png';
                    }}
                  />
                </a>
                {username === user?.username && (
                  <div className="absolute top-0 right-[-15px] text-xs md:text-sm">
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
          <div className="mx-auto fit-content">
            <h3
              onClick={() => toggleDisplayName()}
              className="text-3xl leading-normal lg:m-6 lg:text-4xl"
            >
              {showDisplayName ? `${data?.displayname} *` : data?.username}
            </h3>
          </div>
        </div>
        <div className="w-full p-3 text-xs md:text-lg columns-3 md:columns-4 gap-3 space-y-6">
          {data?.memes?.map((meme: Post) => {
            const title = meme.title.replace(/ /g, '_');
            return (
              <div key={meme.id} className="inline-flex font-semibold text-center">
                <a href={`/meme/${meme.id}/${title}`}>
                  {meme.url.split('.')[3] === 'mp4' ? (
                    <video key={meme.title} className="rounded-lg w-full" controls muted>
                      <source src={meme.url} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      className="object-cover w-full rounded-lg"
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
    return <NoProfile message={data?.errors?.User!} />;
  }
};

export default Profile;
