import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import identifyImageNsfw from './identify-image-nsfw';

export interface MulterFileExt extends Express.Multer.File {
  active?: boolean;
  flagged?: boolean;
  probability?: number;
}

const TypeSkipIdentify = ['video/quicktime', 'video/mp4', 'image/gif'];

@Injectable()
export class FileNsfwDetector implements PipeTransform {
  async transform(file: MulterFileExt, _metadata: ArgumentMetadata) {
    if (TypeSkipIdentify.includes(file.mimetype)) {
      file.active = true; // videos don't need to be approved for now
      file.flagged = true;
      file.probability = -1;
      return file;
    }

    const probability = await identifyImageNsfw(file);

    if (probability > 0.5) {
      throw new UnprocessableEntityException(
        'This content has been flagged as potentially explicit.'
      );
    } else if (probability > 0.25) {
      file.flagged = true;
      file.probability = probability;
    }

    return file;
  }
}
