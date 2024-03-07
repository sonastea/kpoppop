import { PredictionType } from './UploadMeme';

export const identifyImage = async (image: any): Promise<PredictionType> => {
  // eslint-disable-next-line prefer-const
  let img = new window.Image();

  const objectUrl = URL.createObjectURL(image);
  fetch(objectUrl).then((blob) => (img.src = blob.url));

  const nsfwjs = await import('nsfwjs');
  const model = await nsfwjs.load('/models/inception_v3/model.json', { size: 299 });
  const predictions = await model.classify(img);

  return predictions[0];
};
