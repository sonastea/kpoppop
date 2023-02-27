import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { getCroppedImg } from './Crop';

const EditProfilePhoto = ({
  image_src,
  setCroppedUrl,
  editting,
}: {
  image_src: string;
  setCroppedUrl: Function;
  editting: Function;
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
  }, []);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
    window.localStorage.setItem('croppedArea', JSON.stringify(_croppedArea));
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(image_src, croppedAreaPixels);
      setCroppedUrl(croppedImage);
      editting(false);
      document.body.classList.remove('overflow-hidden');
    } catch (e) {
      editting(false);
      document.body.classList.remove('overflow-hidden');
      console.error(e);
    }
  }, [croppedAreaPixels, image_src, setCroppedUrl, editting]);

  return (
    <div className="absolute inset-0 z-40 backdrop-blur-md bg-white-100/30">
      <div className="relative z-40 m-auto top-1/4 h-56 w-56">
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
          className="absolute justify-center z-40 hover:text-once-500 left-0 -top-1/4 text-once-900 p-1"
          role="button"
          onClick={() => editting(false)}
          aria-label="Back to profile settings"
        >
          <FontAwesomeIcon className="cursor-pointer" icon={faRotateLeft} />
        </div>
        <button
          className="absolute p-1 z-40 text-md border md:text-xl shadow-sm shadow-once-500/50 rounded-md border-once-700 bg-once-500 text-once-100 hover:bg-once-600 right-0 -top-1/4"
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
          className="absolute z-40 w-full h-2 bg-slate-400 rounded-lg appearance-none cursor-pointer -bottom-4 text-once"
          aria-labelledby="zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default EditProfilePhoto;
