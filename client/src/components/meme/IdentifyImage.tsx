import * as nsfwjs from 'nsfwjs';
import { PredictionType } from './UploadMeme';

export const identifyImage = async (image: any): Promise<PredictionType> => {
  let img = new window.Image();
  const objectUrl = URL.createObjectURL(image);
  fetch(objectUrl).then((blob) => (img.src = blob.url));
  const model = await nsfwjs.load();
  const predictions = await model.classify(img);
  return predictions[0];
};
