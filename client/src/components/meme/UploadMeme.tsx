import { faSpinner, faCheck, faHourglass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubmitHandler, useForm } from 'react-hook-form';
import { compressImage } from './CompressImage';
import { useState } from 'react';
import { submitMeme } from './MemeAPI';
import { profanityFilter } from 'utils/profanity-filter';
import { toast } from 'react-toastify';

export type PredictionType = {
  className: string;
  probability: number;
};

export type MemeFormData = {
  title: string;
  url?: string | undefined;
  file?: FileList | undefined;
};

const UploadMeme = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isUploading, setUploading] = useState<boolean>(false);
  const [uploadFinished, setUploadFinished] = useState<boolean>(false);
  const [files, setFiles] = useState<FileList | null>();
  const [previewURL, setPreviewURL] = useState<string | null>();
  const [postable, setPostable] = useState<boolean>(false);
  const [flagged, setFlagged] = useState<boolean>(false);
  const [detecting, setDetecting] = useState<boolean>(false);
  const {
    formState: { errors },
    register,
    resetField,
    handleSubmit,
  } = useForm<MemeFormData>();
  const filter = [
    'image/gif',
    'image/png',
    'image/jpg',
    'image/jpeg',
    'video/quicktime',
    'video/mp4',
  ];

  const memeHandler: SubmitHandler<MemeFormData> = async (data) => {
    const formData = new FormData();
    if (files && files.length > 0) {
      let compressed;
      if (files[0].type === 'video/quicktime' || files[0].type === 'video/mp4') {
        compressed = files[0];
      } else {
        compressed = await compressImage(files[0]);
      }
      formData.append('file', compressed as File);
    } else {
      formData.append('file', files?.[0] as File);
    }

    formData.append('title', data.title);
    formData.append('url', data.url!);
    formData.append('flagged', JSON.stringify(flagged));

    if (postable) {
      setUploading(true);
      setUploadFinished(false);
      submitMeme(formData)
        .then((response) => {
          if (response.status === 400) {
            toast.error('Upload failed.');
            setTimeout(() => {
              setUploadFinished(false);
              setUploading(false);
            }, 500);
          }
          if (response.status >= 401 && response.status < 600) {
            toast.error('You must be logged in to submit a meme.');
            setTimeout(() => {
              setUploadFinished(false);
              setUploading(false);
            }, 500);
          }
          if (response.status === 201) {
            setTimeout(() => {
              setUploadFinished(true);
              setUploading(false);
              window.location.reload();
            }, 2000);
          }
        })
        .catch((err) => {
          console.log(err);
          setUploading(false);
          toast.error('Failed to upload meme.');
        });
    }
  };

  const isSFW = (prediction: PredictionType) => {
    switch (prediction.className) {
      case 'Porn':
      case 'Hentai':
        if (prediction.probability > 0.8) {
          setFlagged(true);
          return false;
        } else if (prediction.probability > 0.5) {
          setFlagged(true);
          return true;
        } else {
          return true;
        }
      case 'Sexy':
        if (prediction.probability > 0.5) {
          setFlagged(true);
          return true;
        } else {
          return true;
        }
      default:
        return true;
    }
  };

  const handleChangeEvent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const urlInput = document.getElementById('url-input-box')!;
    const fileInput = document.getElementById('file-input-box')!;

    if (e.target.files?.length === 1) setFiles(e.target.files); // UploadMeme Image Preview

    if (e.target.files && e.target.files.length > 1) {
      if (!filter.some((format) => e.target.files?.[0].type.includes(format))) {
        toast.error('We do not support ' + e.target.files[0].type + ' files');
        resetField('file');
        return;
      }
      toast.error('Cannot post more than 1 photo.');
      setPostable(false);
      return;
    } else if (e.target.files?.length === 1) {
      // Skip identifying video formats and just set postable to true.
      if (e.target.files[0].type.match('^video/(quicktime|mp4)$')) {
        setPostable(true);
        return;
      }
      setDetecting(true);
      const { identifyImage } = await import('./IdentifyImage.tsx');
      const prediction = await identifyImage(e.target.files[0]).finally(() => setDetecting(false));
      setPostable(isSFW(prediction));
    }

    switch (e.target?.name) {
      case 'url':
        if (e.target.value !== '') {
          fileInput.style.display = 'none';
          setPreviewURL(e.target.value);
          setPostable(true);
        } else {
          fileInput.style.display = 'block';
          setPostable(false);
        }
        break;

      case 'file':
        if (e.target.files?.length !== 0) {
          urlInput.style.display = 'none';
        } else {
          urlInput.style.display = 'block';
          setPostable(false);
        }
        setFiles(e.target.files);
        break;
      default:
        setPostable(false);
        break;
    }
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={() => setOpen((open) => !open)}
        type="button"
        className="duration-400 z-10 m-4 overflow-hidden whitespace-pre rounded-md border-once-400
          bg-once-400 p-2 font-semibold text-gray-900 transition hover:bg-once"
      >
        Submit a post
      </button>

      {open && (
        <div
          onClick={() => setOpen((open) => !open)}
          className="fixed inset-0 z-10 flex min-h-screen w-full justify-center backdrop-blur"
        >
          <div
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            className="absolute inset-x-0 top-10 m-0.5 rounded border border-gray-300 bg-white
              shadow-md shadow-once-400/50 sm:inset-x-auto sm:m-0 sm:w-1/2 md:top-20"
          >
            <form onSubmit={handleSubmit(memeHandler)} className="space-y-5 p-8">
              <button
                onClick={() => {
                  setFiles(null);
                  setOpen((open) => !open);
                }}
                type="button"
                className="absolute right-2 top-0 p-2"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <h2 className="mb-10 text-xl font-bold text-gray-900">Submit to kpoppop</h2>

              <div>
                <label className="mb-1 block font-semibold text-gray-800" htmlFor="title-input">
                  title
                </label>
                <input
                  id="title-input"
                  required
                  className="label-outline w-full appearance-none border border-gray-300 px-1
                    focus-within:border-once focus:outline-none"
                  type="text"
                  {...register('title', {
                    required: true,
                    minLength: 3,
                    maxLength: 320,
                    validate: profanityFilter,
                  })}
                />
                {errors.title?.type === 'minLength' && (
                  <span className="text-error">{'Title must be a minimum 3 characters.'}</span>
                )}
                {errors.title?.type === 'validate' && (
                  <span className="text-error">{'Title contains a swear word.'}</span>
                )}
              </div>

              <div id="url-input-box">
                <label className="mb-1 block font-semibold text-gray-800" htmlFor="url-input">
                  url
                </label>
                <input
                  id="url-input"
                  className="w-full border border-gray-300 px-1 focus-within:border-once
                    focus:outline-none"
                  type="url"
                  {...register('url')}
                  onChange={handleChangeEvent}
                />
              </div>

              <div id="file-input-box">
                <input
                  multiple
                  type="file"
                  accept="image/gif, image/jpg, image/jpeg, image/png, video/quicktime, video/mp4"
                  className="w-full"
                  {...register('file')}
                  onInput={handleChangeEvent}
                />
              </div>

              <div className="relative">
                {detecting && (
                  <div className="absolute right-1/2 top-2 text-white mix-blend-difference">
                    <FontAwesomeIcon className="fa-beat-fade" size="xl" icon={faHourglass} />
                  </div>
                )}

                {files &&
                  files.length <= 1 &&
                  Array.from(files).map((file) => {
                    switch (file.type) {
                      case 'video/mp4':
                      case 'video/quicktime':
                        return (
                          <video
                            key={file.name}
                            className="m-auto aspect-video h-56 sm:h-64 md:h-96"
                            controls
                          >
                            <source src={URL.createObjectURL(file)} type="video/mp4" />
                          </video>
                        );

                      default:
                        return (
                          <img
                            className="mx-auto my-1 max-h-96 flex-initial"
                            key={file.name}
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                          />
                        );
                    }
                  })}
              </div>

              {previewURL && (
                <img
                  className="mx-auto my-1 max-h-96 flex-initial"
                  src={previewURL}
                  alt="previewURL thumbnail"
                />
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="duration-400 z-10 rounded-md border-once-400 bg-once-400 p-2
                    font-semibold text-gray-900 transition hover:bg-once"
                >
                  Post
                  {isUploading && <FontAwesomeIcon className="ml-2" icon={faSpinner} spin />}
                  {uploadFinished && (
                    <FontAwesomeIcon className="ml-2 text-green-600" icon={faCheck} />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMeme;
