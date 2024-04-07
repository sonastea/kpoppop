import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class FileSizeExtValidator implements PipeTransform {
  private readonly ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/gif'];
  private readonly MAX_SIZE = 2000000;
  transform(value: Express.Multer.File, _metadata: ArgumentMetadata) {
    const mimetype = (value.mimetype);

    if (value.size > this.MAX_SIZE) {
      throw new UnprocessableEntityException(
        `Files greater than ${this.MAX_SIZE / (10 * 6)}MB are not allowed.`
      );
    }

    if (!this.ALLOWED_MIMETYPES.includes(mimetype)) {
      throw new UnprocessableEntityException(`Files with type ${mimetype} are not allowed.`);
    }

    return value;
  }
}
