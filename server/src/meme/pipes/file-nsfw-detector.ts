import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import identifyImageNsfw from './identify-image-nsfw';

export interface MulterFileExt extends Express.Multer.File {
  flagged?: boolean;
  probability?: number;
}

@Injectable()
export class FileNsfwDetector implements PipeTransform {
  async transform(file: MulterFileExt, _metadata: ArgumentMetadata) {
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
