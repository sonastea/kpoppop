import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { getCroppedImg } from './Crop';

const EditProfilePhoto = ({
  image_src,
  setCroppedUrl,
  setPhoto,
  editting,
}: {
  image_src: string;
  setCroppedUrl: React.Dispatch<React.SetStateAction<RequestInfo | URL | null>>;
  setPhoto: React.Dispatch<React.SetStateAction<FileList | null | undefined>>;
  editting: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    window.scrollTo(0, 0);
  }, []);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
    window.localStorage.setItem('croppedArea', JSON.stringify(_croppedArea));
  }, []);

  const cancelEditting = useCallback(() => {
    document.body.classList.remove('overflow-hidden');
    editting(false);
    setCroppedUrl(null);
    setPhoto(null);
  }, [editting, setCroppedUrl, setPhoto]);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(image_src, croppedAreaPixels);
      setCroppedUrl(croppedImage);
    } catch (e) {
      console.error(e);
    }
    editting(false);
  }, [croppedAreaPixels, image_src, setCroppedUrl]);

  return (
    <div className="absolute inset-0 z-40 bg-zinc-300/30 backdrop-blur-md">
      <div className="relative top-1/4 z-40 m-auto h-56 w-56">
        <Cropper
          image={image_src}
          aspect={1 / 1}
          crop={crop}
          cropShape="round"
          maxZoom={3}
          zoom={zoom}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
        <div
          className="absolute -top-1/4 left-0 z-40 justify-center p-1 text-gray-800"
          role="button"
          onClick={cancelEditting}
          aria-label="Back to profile settings"
        >
          <FontAwesomeIcon
            className="cursor-pointer p-1 hover:rounded-full hover:bg-gray-700/20"
            icon={faArrowLeft}
          />
        </div>
        <button
          className="text-md absolute -top-1/4 right-0 z-40 rounded-md bg-once-200 p-1 text-once-800
            shadow-sm shadow-once-400 hover:bg-once-300 md:text-xl"
          onClick={() => showCroppedImage()}
          type="button"
        >
          Apply
        </button>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          className="absolute -bottom-4 z-40 h-2 w-full cursor-pointer appearance-none rounded-lg
            bg-slate-400 text-once"
          aria-labelledby="zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default EditProfilePhoto;
