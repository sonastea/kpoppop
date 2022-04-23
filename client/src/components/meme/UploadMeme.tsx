import { faSpinner, faCheck, faHourglass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubmitHandler, useForm } from 'react-hook-form';
import { identifyImage } from './IdentifyImage';
import { compressImage } from './CompressImage';
import { useEffect, useState } from 'react';
import { submitMeme } from './MemeAPI';
import { profanityFilter } from 'utils/profanity-filter';

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
  const filter = ['image/gif', 'image/png', 'image/jpg', 'image/jpeg'];

  const memeHandler: SubmitHandler<MemeFormData> = async (data) => {
    const formData = new FormData();
    if (files && files.length > 0) {
      const compressed = await compressImage(files[0]);
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
            window.alert('Upload failed.');
            setTimeout(() => {
              setUploadFinished(false);
              setUploading(false);
            }, 500);
          }
          if (response.status >= 401 && response.status < 600) {
            window.alert('You must be logged in to submit a meme.');
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
          alert('Failed to upload meme.');
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

    if (e.target.files && e.target.files.length > 1) {
      if (!filter.some((format) => e.target.files?.[0].type.includes(format))) {
        alert('We do not support ' + e.target.files[0].type + ' files');
        resetField('file');
        return;
      }
      alert('Cannot post more than 1 photo.');
      setPostable(false);
      return;
    } else if (e.target.files?.length === 1) {
      setFiles(e.target.files); // UploadMeme Image Preview
      setDetecting(true);
      const prediction = await identifyImage(e.target.files[0]);
      const isPostable = isSFW(prediction);
      setPostable(isPostable);
      setDetecting(false);
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
        className="z-10 p-2 m-4 font-semibold text-gray-900 border-once-400 rounded-md bg-once-400 hover:bg-once transition duration-400"
      >
        Submit a post
      </button>

      {open && (
        <div
          onClick={() => setOpen((open) => !open)}
          className="z-10 absolute flex justify-center w-full min-h-screen overflow-hidden backdrop backdrop-filter backdrop-blur-lg"
        >
          <div
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            className="border absolute inset-x-0 bg-white rounded shadow-md sm:inset-x-auto sm:w-1/2 top-20"
          >
            <form onSubmit={handleSubmit(memeHandler)} className="p-8 space-y-5">
              <button
                onClick={() => {
                  setFiles(null);
                  setOpen((open) => !open);
                }}
                type="button"
                className="absolute top-0 p-2 right-2"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <h2 className="mb-10 text-xl font-bold text-gray-900">Submit to kpoppop</h2>

              <div>
                <label className="block mb-1 font-semibold text-gray-800" htmlFor="title">
                  title
                </label>
                <input
                  required
                  className="w-full px-1 border appearance-none focus:outline-none label-outline"
                  type="text"
                  {...register('title', {
                    required: true,
                    minLength: 3,
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
                <label className="block mb-1 font-semibold text-gray-800" htmlFor="url">
                  url
                </label>
                <input
                  className="w-full px-1 border focus:outline-none focus-within:border-once"
                  type="url"
                  {...register('url')}
                  onChange={handleChangeEvent}
                />
              </div>

              <div id="appearance-none file-input-box">
                <input
                  multiple
                  type="file"
                  accept="image/gif, image/jpg, image/jpeg, image/png"
                  className="w-full"
                  {...register('file')}
                  onInput={handleChangeEvent}
                />
              </div>

              {detecting && (
                <div className="flex justify-center">
                  <FontAwesomeIcon className="fa-beat-fade" icon={faHourglass} />
                </div>
              )}

              {files &&
                files.length <= 1 &&
                Array.from(files).map((file) => {
                  return (
                    <img
                      className="lg:max-h-96 mx-auto my-1"
                      key={file.name}
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                    />
                  );
                })}

              {previewURL && <img src={previewURL} alt="previewURL thumbnail" />}

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="z-10 p-2 font-semibold text-gray-900 border-once-400 rounded-md bg-once-400 hover:bg-once transition duration-400"
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
