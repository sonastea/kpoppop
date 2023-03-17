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
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 text-3xl z-50 group"
      onClick={scrollToTop}
    >
      <FontAwesomeIcon
        icon={faCircleArrowUp}
        className="bg-white group-hover:text-once-700 text-once-700/70 rounded-full"
      />
    </button>
  );
};

export default ScrollToTopButton;
