import { LazyLoadImage } from 'react-lazy-load-image-component';

type MemeLazyImageProps = {
  id: number;
  src: string;
  title: string;
  alt: string;
  lazy: boolean;
};

const MemeLazyImage: React.FC<MemeLazyImageProps> = ({ id, src, title, alt, lazy }) => {
  const isVideo = src.split('.')[3] === 'mp4';

  if (isVideo) {
    return (
      <video
        key={title}
        className="mx-auto aspect-square w-full object-cover md:aspect-auto md:max-h-96"
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
    <a className="contents" href={`/meme/${id}/${title}`} aria-label={title}>
      <picture className="mx-auto">
        <source media="(max-width: 639px)" srcSet={`${src}?tr=w-336`} />
        <source media="(min-width: 640px)" srcSet={`${src}?tr=w-672`} />
        <LazyLoadImage
          effect="blur"
          className="mt-2 h-64 max-h-64 w-[336px] object-scale-down md:h-96 md:max-h-96 md:w-[672px]
            md:object-contain"
          src={src}
          alt={alt}
          visibleByDefault={!lazy}
        />
      </picture>
    </a>
  );
};

export default MemeLazyImage;
