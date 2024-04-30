import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/plugins/captions.css';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';

type MediaLightboxProps = {
  open: boolean;
  setOpen: () => void;
  src: string;
  alt: string;
  isVideo: boolean;
};

const MediaLightbox = ({ open, setOpen, src, alt, isVideo }: MediaLightboxProps) => {
  if (isVideo) {
    return (
      <Lightbox
        open={open}
        close={setOpen}
        captions={{ descriptionTextAlign: 'center' }}
        plugins={[Video]}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
        slides={[{ type: 'video', sources: [{ src: src, type: 'video/mp4' }] }]}
        styles={{ container: { backgroundColor: 'rgba(0, 0, 0, .90)' } }}
      />
    );
  }

  return (
    <Lightbox
      open={open}
      close={setOpen}
      captions={{ descriptionTextAlign: 'center' }}
      plugins={[Captions]}
      render={{
        buttonPrev: () => null,
        buttonNext: () => null,
      }}
      slides={[{ src: src, description: alt, alt: alt }]}
      styles={{ container: { backgroundColor: 'rgba(0, 0, 0, .90)' } }}
    />
  );
};

export default MediaLightbox;
