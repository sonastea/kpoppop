import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 2,
  useWebWorker: true,
};

export const compressImage = async (image: File): Promise<File | undefined> => {
  try {
    const compressed = await imageCompression(image, options);

    return compressed;
  } catch (error) {}
};
