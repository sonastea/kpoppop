import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(document.documentElement.scrollTop >= 56);
    };
    onScroll();
    document.addEventListener('scroll', onScroll);
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      aria-label="Scroll to top"
      className="group fixed bottom-4 right-4 z-50 text-3xl md:bottom-8 md:right-8"
      onClick={scrollToTop}
    >
      <FontAwesomeIcon
        icon={faCircleArrowUp}
        className="rounded-full bg-white text-once-700/70 group-hover:text-once-700"
      />
    </button>
  );
};

export default ScrollToTopButton;
