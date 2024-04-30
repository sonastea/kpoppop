import MediaLightbox from 'components/MediaLightbox';
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

type MemeLazyImageProps = {
  id: number;
  src: string;
  title: string;
  alt: string;
  visibleByDefault: boolean;
};

const PlaceHolder = () => {
  return (
    <div
      className="mt-2 flex h-96 max-h-64 w-full items-center justify-center rounded bg-gray-200
        object-cover sm:max-h-96 sm:object-contain"
    />
  );
};

const MemeLazyImage: React.FC<MemeLazyImageProps> = ({ id, src, title, alt, visibleByDefault }) => {
  const [openLightbox, setOpenLightbox] = useState(false);
  const isVideo = src.split('.')[3] === 'mp4';

  const src336 = `${src}?tr=w-336`;
  const src640 = `${src}?tr=w-640`;

  const toggleMediaLightBox = () => {
    setOpenLightbox((state) => !state);
  };

  if (isVideo) {
    return (
      <video
        key={title}
        className="mx-4 aspect-square w-full rounded-md object-cover sm:aspect-auto sm:max-h-96"
        autoPlay
        controls
        muted
        loop
        src={src}
      >
        <source src={src} type="video/mp4" />
      </video>
    );
  }

  return (
    <button className="mx-4 w-full" onClick={() => toggleMediaLightBox()} aria-label={alt}>
      <MediaLightbox open={openLightbox} setOpen={toggleMediaLightBox} src={src} alt={alt} />
      <picture className="grid w-full" data-image-id={id}>
        <source media="(max-width: 639px)" srcSet={src336} />
        <source media="(min-width: 640px)" srcSet={src640} />
        <LazyLoadImage
          effect="blur"
          className="mt-2 flex h-64 max-h-64 w-full rounded-md object-cover sm:h-96 sm:max-h-96
            sm:w-[672px]"
          src={src640}
          alt={alt}
          visibleByDefault={visibleByDefault}
          placeholder={<PlaceHolder />}
        />
      </picture>
    </button>
  );
};

export default MemeLazyImage;
