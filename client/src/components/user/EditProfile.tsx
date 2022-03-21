import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { addSocialMediaLink, deleteSocialMediaLink, fetchUserSettings, updateProfile } from './UserAPI';
import { SubmitHandler, useForm } from 'react-hook-form';
import { EditSocialLinkFormData, SocialMediaLink } from './SocialMedias';
import { useAuth } from 'contexts/AuthContext';

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
  const [socials, setSocials] = useState<SocialMediaLink[] | undefined>([]);
  const { register, handleSubmit, setValue } = useForm<EditProfileFormData>({
    defaultValues: { displayname: user?.displayname },
  });
  const {
    register: registerSocial,
    handleSubmit: handleSubmitSocial,
    formState: { errors },
  } = useForm<EditSocialLinkFormData>({});

  useEffect(() => {
    fetchUserSettings().then((data) => {
      if (data.statusCode === 403) {
        window.location.href = '/login';
      }
      setData(data);
      setSocials(data.socialMedias);
      setLoading(false);
    });
  }, []);

  const editProfileHandler: SubmitHandler<EditProfileFormData> = async (newData): Promise<any> => {
    const formData = new FormData();
    formData.append('displayname', newData.displayname);
    formData.append('banner', newData.banner[0]);
    formData.append('photo', newData.photo[0]);
    await updateProfile(formData).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'banner':
        setBanner(e.target.files);
        break;

      case 'photo':
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

  const addSocial: SubmitHandler<EditSocialLinkFormData> = async (newData: EditSocialLinkFormData) => {
    const formData = new FormData();
    formData.append('title', newData.title!);
    formData.append('url', newData.url);

    await addSocialMediaLink(formData).then((social) => {
      if (social.uuid) socials?.push(social);
    });
  };

  const deleteSocial = async (e: any) => {
    const index = parseInt(e.currentTarget.dataset.index); // dataset is a string

    await deleteSocialMediaLink(socials?.at(index)?.uuid!).then((response) => {
      if (response.success) {
        const updatedSocials = socials?.filter((_social, idx: number) => idx !== index);
        setSocials(updatedSocials);
      }
    });
  };

  if (isLoading) return null;

  return (
    <div className="w-full">
      <div className="flex justify-center w-full h-full mx-auto max-w-screen-md">
        <form className="edit-profile mx-auto">
          <div className="flex-col w-full text-2xl space-y-3 md:text-3xl ">
            <h2 className="py-3 font-bold text-center border-b border-slate-200">Edit profile</h2>

            <div className="mx-2 space-y-3">
              <div className="flex flex-wrap w-full py-3 text-center">
                <img
                  className={`${banner?.length === 1 && 'hidden'} w-full h-40 sm:h-60 lg:h-80 rounded-md`}
                  src={data?.banner ? data?.banner : '/images/default_banner_white_1920x320.png'}
                  alt="banner"
                  onError={(e) => imageChange(e)}
                />
                {banner &&
                  banner.length === 1 &&
                  Array.from(banner).map((file) => {
                    return (
                      <img
                        className={`${banner.length === 0 && 'hidden'} w-full h-40 sm:h-60 lg:h-80 rounded-md`}
                        key={file.name}
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                      />
                    );
                  })}
                <div className="w-full my-2 text-right">
                  <label htmlFor="banner" className="cursor-pointer text-once-600 hover:text-once-400">
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

              <div className="flex items-center justify-between w-full">
                <img
                  className={`${
                    photo?.length === 1 && 'hidden'
                  } w-24 h-24 bg-white border rounded-full border-slate-900 md:w-48 md:h-48`}
                  src={data?.photo ? data?.photo : '/images/default_photo_white_200x200.png'}
                  alt="profile"
                  onError={(e) => imageChange(e)}
                />
                {photo &&
                  photo.length === 1 &&
                  Array.from(photo).map((file) => {
                    return (
                      <img
                        className="left-0 z-20 w-24 h-24 bg-white border rounded-full border-slate-900 md:w-48 md:h-48"
                        key={file.name}
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                      />
                    );
                  })}
                <div className="py-4">
                  <span className="cursor-pointer text-once-600 hover:text-once-400 md:hidden">Edit</span>
                  <label
                    htmlFor="photo"
                    className="hidden h-full cursor-pointer md:block text-once-600 hover:text-once-400"
                  >
                    Edit profile photo
                    <input
                      id="photo"
                      className="w-auto hidden cursor-pointer"
                      type="file"
                      {...register('photo')}
                      onInput={handleImageSelect}
                    />
                  </label>
                </div>
              </div>
              <div className="text-sm sm:text-lg flex justify-between">
                <label className="my-auto pr-2 whitespace-nowrap font-semibold md:text-xl">Display Name</label>
                <input
                  type="text"
                  placeholder={data?.displayname}
                  className="w-1/2 p-1 border text-center focus:outline-none focus-within:border-once border-slate-400 rounded-md"
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSubmit(editProfileHandler)();
                    }
                  }}
                  {...register('displayname')}
                />
              </div>
              <div className="flex justify-end w-full py-2 space-x-2">
                <button
                  className="w-auto p-1 text-sm border md:text-xl shadow-sm bg-slate-200 text-slate-600 border-slate-700 rounded-md hover:bg-slate-300 hover:text-slate-800"
                  type="reset"
                  onClick={() => setValue('displayname', `${data?.displayname}`, { shouldValidate: false })}
                >
                  Cancel
                </button>
                <button
                  className="w-auto p-1 text-sm border md:text-xl shadow-sm shadow-once-500/50 rounded-md border-once-700 bg-once-500 text-once-100 hover:bg-once-600"
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

      <div className="mt-2 pb-40 flex justify-center mx-auto max-w-screen-lg w-full">
        <div className="w-full sm:w-3/4">
          <form className="edit-socials">
            <h2 className="py-3 text-2xl font-bold border-b md:text-3xl border-slate-300">
              Social Links
              <p className="text-sm text-slate-500 font-normal">
                Add up to 6 social media links to display on your profile.
              </p>
            </h2>
            <div className="flex flex-col m-2">
              <label className="text-sm font-semibold sm:text-lg">Link title</label>
              <input
                className="text-sm sm:text-lg w-auto p-1 border border-slate-400 focus:outline-none focus-within:border-once rounded-md"
                type="text"
                {...registerSocial('title')}
              />
              <span className="text-sm text-slate-500">Text shown for the link</span>
            </div>
            <div className="flex flex-col m-2">
              <label className="text-sm font-semibold sm:text-lg">Link URL</label>
              <input
                className="text-sm sm:text-lg w-auto p-1 border focus:outline-none border-slate-400 focus-within:border-once rounded-md"
                type="text"
                {...registerSocial('url', {
                  required: true,
                  pattern: regex,
                })}
              />
              <span className="text-sm text-slate-500">For example: https://twitter.com/OfficialKpoppop</span>
              {errors.url && <span className="align-middle p-1 bg-red-300/50 text-error">Please enter a URL</span>}
            </div>
            <div className="p-2 relative text-right border-b border-slate-300">
              <button
                type="button"
                className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer w-auto p-1 text-sm border md:text-xl shadow-sm shadow-once-500/50 border-once-700 rounded-md bg-once-500 text-once-100 hover:bg-once-700"
                onClick={handleSubmitSocial(addSocial)}
                disabled={socials === undefined || socials?.length >= 6 ? true : false}
              >
                Add
              </button>
            </div>
          </form>
          <div className="text-sm sm:text-lg m-2 space-y-2">
            {socials &&
              socials.map((social: SocialMediaLink, index: number) => {
                return (
                  <div className="bg-gray-200 p-2 rounded-md relative" key={social.uuid}>
                    <p className="font-semibold">{social.title}</p>
                    <a className="text-slate-600" href={social.url}>
                      {social.url}
                    </a>
                    <FontAwesomeIcon
                      key={social.uuid}
                      className="cursor-pointer text-md sm:text-xl absolute my-auto p-1 rounded-md inset-y-0 right-2 hover:bg-gray-300 hover:text-black text-red-600 cursor-pointer "
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
