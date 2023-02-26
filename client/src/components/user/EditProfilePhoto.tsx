import { useCallback, useEffect, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { getCroppedImg } from './Crop';

const EditProfilePhoto = ({
  image_src,
  setCroppedUrl,
}: /* setPhoto, */
{
  image_src: string;
  setCroppedUrl: Function;
  /* setPhoto: Function; */
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
      document.body.classList.remove('overflow-hidden');
    } catch (e) {
      document.body.classList.remove('overflow-hidden');
      console.error(e);
    }
  }, [croppedAreaPixels, image_src, setCroppedUrl]);

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
        <button
          className="absolute p-1 text-md border md:text-xl shadow-sm shadow-once-500/50 rounded-md border-once-700 bg-once-500 text-once-100 hover:bg-once-600 right-0 -top-1/4"
          onClick={() => showCroppedImage()}
          type="button"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default EditProfilePhoto;
