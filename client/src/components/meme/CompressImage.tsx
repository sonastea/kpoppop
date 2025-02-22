import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify/unstyled';

const options = {
  maxSizeMB: 2,
  useWebWorker: true,
};

export const compressImage = async (image: File): Promise<File> => {
  try {
    const compressed = await imageCompression(image, options);
    const file = new File([compressed], image.name, {
      lastModified: image.lastModified,
      type: image.type,
    });

    return file;
  } catch (error) {
    console.error(error);
    toast.error('There was a problem while compressing your image.');
    return image;
  }
};
