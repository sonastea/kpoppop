import autoAnimate from '@formkit/auto-animate';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from 'contexts/AuthContext';
import { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import EditProfilePhoto from './EditProfilePhoto';
import { EditSocialLinkFormData, SocialMediaLink } from './SocialMedias';
import {
  addSocialMediaLink,
  deleteSocialMediaLink,
  fetchUserSettings,
  updateProfile,
} from './UserAPI';

const regex = new RegExp(
  'https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()@:%_+.~#?&//=]*)'
);

type EditProfileFormData = {
  displayname: string;
  banner: FileList | string;
  photo: FileList | string;
  socialMedias: Array<SocialMediaLink>;
};

type EditProfileData = {
  id: number;
  username: string;
  displayname: string | undefined;
  socialMedias: Array<SocialMediaLink>;
  role: string;
  banner: string | undefined;
  photo: string | undefined;
};

const EditProfile = () => {
  const { user } = useAuth();
  const [data, setData] = useState<EditProfileData>();
  const [photo, setPhoto] = useState<FileList | null>();
  const [banner, setBanner] = useState<FileList | null>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [croppedUrl, setCroppedUrl] = useState<RequestInfo | URL | null>(null);
  const [socials, setSocials] = useState<SocialMediaLink[] | undefined>([]);
  const socialsRef = useRef<HTMLDivElement>(null);
  const [edittingProfilePhoto, setEdittingProfilePhoto] = useState<boolean>(false);
  const { register, handleSubmit, setValue } = useForm<EditProfileFormData>({
    defaultValues: { displayname: user?.displayname },
  });
  const {
    register: registerSocial,
    handleSubmit: handleSubmitSocial,
    formState: { errors },
  } = useForm<EditSocialLinkFormData>({});

  useEffect(() => {
    fetchUserSettings().then((d) => {
      if (d.statusCode === 403) {
        window.location.href = '/login';
      }
      setData(d);
      setSocials(d.socialMedias);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    socialsRef.current && autoAnimate(socialsRef.current);
  }, [socialsRef]);

  const editProfileHandler: SubmitHandler<EditProfileFormData> = async (newData) => {
    const formData = new FormData();
    formData.append('displayname', newData.displayname ?? '');
    formData.append('banner', newData.banner[0]);

    if (croppedUrl && photo) {
      const file = await fetch(croppedUrl)
        .then((r) => r.blob())
        .then((blobFile) => new File([blobFile], photo[0].name, { type: photo[0].type }));

      formData.append('photo', file, photo[0].name);
    }

    await updateProfile(formData).finally(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'banner':
        setBanner(e.target.files);
        break;

      case 'photo':
        setEdittingProfilePhoto(true);
        setPhoto(e.target.files);
        break;
    }
  };

  const imageChange = (e: BaseSyntheticEvent) => {
    if (data?.banner === (null || undefined)) {
      // no banner, what should we have as default?
    } else {
      e.target.src = data?.banner;
    }
  };

  const addSocial: SubmitHandler<EditSocialLinkFormData> = async (
    newData: EditSocialLinkFormData
  ) => {
    const formData = new FormData();
    formData.append('title', newData.title!);
    formData.append('url', newData.url);

    await addSocialMediaLink(formData).then((social) => {
      if (social.uuid) socials?.push(social);
    });
  };

  const deleteSocial = async (e: BaseSyntheticEvent<MouseEvent | TouchEvent>) => {
    const index = parseInt(e.currentTarget.dataset.index); // dataset is a string

    await deleteSocialMediaLink(socials![index].uuid).then((response) => {
      if (response.success) {
        setSocials(socials?.filter((_, idx) => idx !== index));
      }
    });
  };

  if (isLoading) return null;

  return (
    <div className="w-full">
      <div className="mx-auto flex h-full w-full max-w-screen-md justify-center">
        <form className="edit-profile mx-auto">
          <div className="w-full flex-col space-y-3 text-2xl md:text-3xl ">
            <h2 className="py-3 text-center font-bold">Edit profile</h2>

            <div className="mx-2 space-y-3">
              <div className="flex w-full flex-wrap py-3 text-center">
                <img
                  className={`${banner?.length === 1 ? 'hidden' : 'block'} h-40 w-full rounded-md
                  object-cover sm:h-60 lg:h-80`}
                  src={data?.banner ? data?.banner : '/images/default_banner_white_1920x320.png'}
                  alt="banner"
                  onError={(e) => imageChange(e)}
                />
                {banner &&
                  banner.length === 1 &&
                  Array.from(banner).map((file) => {
                    return (
                      <img
                        className={`${banner.length === 0 && 'hidden'} h-40 w-full rounded-md
                        object-cover sm:h-60 lg:h-80`}
                        key={file.name}
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                      />
                    );
                  })}
                <div className="my-2 w-full text-right">
                  <label
                    htmlFor="banner"
                    className="cursor-pointer text-once-600 hover:text-once-700"
                  >
                    Edit banner
                    <input
                      id="banner"
                      className="hidden"
                      type="file"
                      {...register('banner')}
                      onInput={handleImageSelect}
                    />
                  </label>
                </div>
              </div>

              <div className="flex w-full items-center justify-between">
                <img
                  className={`${photo?.length === 1 || croppedUrl ? 'hidden' : 'flex'} h-24 w-24
                  rounded-full border border-slate-900 bg-white md:h-48 md:w-48`}
                  src={data?.photo ? data?.photo : '/images/default_photo_white_200x200.png'}
                  alt="profile"
                  onError={(e) => imageChange(e)}
                />
                {photo &&
                  !croppedUrl &&
                  photo.length === 1 &&
                  Array.from(photo).map((file) => {
                    return (
                      <img
                        className="left-0 z-20 h-24 w-24 rounded-full border border-slate-900
                          bg-white object-cover md:h-48 md:w-48"
                        key={file.name}
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                      />
                    );
                  })}
                {croppedUrl && (
                  <img
                    className="left-0 z-30 h-24 w-24 rounded-full border border-slate-900 bg-white
                      object-cover md:h-48 md:w-48"
                    src={croppedUrl.toString()}
                    alt={'cropped profile'}
                  />
                )}
                {photo && photo[0] && edittingProfilePhoto && (
                  <EditProfilePhoto
                    image_src={URL.createObjectURL(photo[0])}
                    setCroppedUrl={setCroppedUrl}
                    setPhoto={setPhoto}
                    editting={setEdittingProfilePhoto}
                  />
                )}
                <div className="py-4">
                  <label
                    htmlFor="photo"
                    className="cursor-pointer text-once-600 hover:text-once-700 md:hidden"
                  >
                    Edit
                  </label>
                  <label
                    htmlFor="photo"
                    className="hidden h-full cursor-pointer text-once-600 hover:text-once-700
                      md:block"
                  >
                    Edit profile photo
                    <input
                      id="photo"
                      className="hidden w-auto cursor-pointer"
                      type="file"
                      {...register('photo')}
                      onInput={handleImageSelect}
                      onClick={(e) => (e.currentTarget.value = '')}
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-between text-sm sm:text-lg">
                <label
                  className="my-auto w-24 whitespace-nowrap text-center font-semibold md:w-48
                    md:text-xl"
                  htmlFor="displayname"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder={data?.displayname}
                  className="w-1/2 rounded-md border border-slate-400 p-1 text-center
                    focus-within:border-once focus:outline-none"
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmit(editProfileHandler)();
                    }
                  }}
                  id="displayname"
                  {...register('displayname')}
                />
              </div>
              <div className="flex w-full justify-end space-x-2 py-2">
                <button
                  className="w-auto rounded-md bg-slate-200 p-1 text-sm font-semibold text-slate-600
                    shadow-sm shadow-slate-400 hover:bg-slate-300 hover:text-slate-800 md:text-xl"
                  type="reset"
                  onClick={() => {
                    setValue('displayname', `${data?.displayname}`, { shouldValidate: false });
                    setCroppedUrl(null);
                    setPhoto(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="w-auto rounded-md bg-once-200 p-1 text-sm font-semibold text-once-800
                    shadow-sm shadow-once-400 hover:bg-once-300 md:text-xl"
                  type="button"
                  onClick={handleSubmit(editProfileHandler)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="mx-auto mt-4 flex h-3/5 w-full max-w-screen-lg justify-center pb-40">
        <div className="w-full sm:w-3/4">
          <form className="edit-socials">
            <h2
              className={'m-1 border-b border-slate-300 pb-3 text-2xl font-bold md:m-0 md:text-3xl'}
            >
              Social Links
              <p className="text-sm font-normal text-slate-500">
                Add up to 6 social media links to display on your profile.
              </p>
            </h2>
            <div className="m-2 flex flex-col">
              <label className="text-sm font-semibold sm:text-lg" htmlFor="social-title">
                Link title
              </label>
              <input
                className="w-auto rounded-md border border-slate-400 p-1 text-sm
                  focus-within:border-once focus:outline-none sm:text-lg"
                type="text"
                id="social-title"
                {...registerSocial('title')}
              />
              <span className="text-sm text-slate-500">Text shown for the link</span>
            </div>
            <div className="m-2 flex flex-col">
              <label className="text-sm font-semibold sm:text-lg" htmlFor="social-url">
                Link URL
              </label>
              <input
                className="w-auto rounded-md border border-slate-400 p-1 text-sm
                  focus-within:border-once focus:outline-none sm:text-lg"
                type="text"
                id="social-url"
                {...registerSocial('url', {
                  required: true,
                  pattern: regex,
                })}
              />
              <span className="text-sm text-slate-500">
                For example: https://twitter.com/OfficialKpoppop
              </span>
              {errors.url && (
                <span className="bg-red-300/50 p-1 align-middle text-error">
                  Please enter a URL
                </span>
              )}
            </div>
            <div className="relative border-b border-slate-300 p-2 text-right">
              <button
                type="button"
                className="w-auto cursor-pointer rounded-md bg-once-200 p-1 text-sm font-semibold
                  text-once-800 shadow-sm shadow-once-400 hover:bg-once-300
                  disabled:cursor-not-allowed disabled:opacity-50 md:text-xl"
                onClick={handleSubmitSocial(addSocial)}
                disabled={socials && socials?.length >= 6 ? true : false}
              >
                Add
              </button>
            </div>
          </form>
          <div className="m-2 space-y-2 text-sm sm:text-lg" ref={socialsRef}>
            {socials &&
              socials.map((social: SocialMediaLink, index: number) => {
                return (
                  <div className="relative rounded-md bg-gray-200 p-2" key={social.uuid}>
                    <p className="font-semibold">{social.title}</p>
                    <a className="text-slate-600" href={social.url}>
                      {social.url}
                    </a>
                    <FontAwesomeIcon
                      key={social.uuid}
                      className="text-md absolute inset-y-0 right-2 my-auto cursor-pointer
                        rounded-md p-1 text-red-500 hover:bg-red-200/90 hover:text-red-600
                        sm:text-xl"
                      icon={faTrashCan}
                      data-index={index}
                      onClick={(e: any) => deleteSocial(e)}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
