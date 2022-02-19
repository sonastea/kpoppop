import { faAngleDoubleDown, faAngleDoubleUp, faSpinner, faCheck, faHourglass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { submitMeme } from './MemeAPI';
import { identifyImage } from './IdentifyImage';

export type PredictionType = {
  className: string;
  probability: number;
};

export type MemeFormData = {
  title: string;
  url?: string | undefined;
  file?: FileList | undefined;
  flagged: boolean;
};

const UploadMeme = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isUploading, setUploading] = useState<boolean>(false);
  const [uploadFinished, setUploadFinished] = useState<boolean>(false);
  const [files, setFiles] = useState<FileList | null>();
  const [postable, setPostable] = useState<boolean>(false);
  const [flagged, setFlagged] = useState<boolean>(false);
  const [detecting, setDetecting] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<MemeFormData>();

  const memeHandler: SubmitHandler<MemeFormData> = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('url', data.url!);
    formData.append('file', data.file![0]);
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
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
          setUploading(false);
          alert('Failed to upload meme.');
        });
    } else {
      window.alert('Please select a different image.');
    }
  };

  const handleChangeEvent = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const urlInput = document.getElementById('url-input-box')!;
    const fileInput = document.getElementById('file-input-box')!;

    if (e.currentTarget.files && e.currentTarget.files.length > 1) {
      alert('Cannot post more than 1 photo.');
      setPostable(false);
      return;
    }

    switch (e.currentTarget.id) {
      case 'url-input-box':
        if (e.target.value !== '') {
          fileInput.style.display = 'none';
          setPostable(true);
        } else {
          fileInput.style.display = 'block';
          setPostable(false);
        }
        break;

      case 'file-input-box':
        if (e.target.value !== '') {
          urlInput.style.display = 'none';
        } else {
          urlInput.style.display = 'block';
          setPostable(false);
        }
        break;
      default:
        setPostable(false);
        break;
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

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files); // UploadMeme Image Preview
    }

    if (e.target.files && e.target.files.length >= 1) {
      setDetecting(true);
      const prediction = await identifyImage(e.target.files[0]);
      const postable = isSFW(prediction);
      setPostable(postable);
      setDetecting(false);
    }
  };

  return (
    <form>
      <input type="text"></input>
      <input type="email"></input>
      <input type="password"></input>
      <input type="password"></input>
    </form>
  );
};

export default UploadMeme;
