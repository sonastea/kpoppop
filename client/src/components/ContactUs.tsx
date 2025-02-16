import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ContactUs = () => {
  return (
    <div
      className="grid grid-rows-2 overflow-hidden shadow-md md:flex md:h-[calc(100vh-80px)]
        md:w-full md:items-center"
    >
      <div className="py-2 text-thrice md:mx-12 md:shrink-0 md:bg-white">
        <h2 className="text-center text-2xl md:text-7xl md:text-once-400">Contact us</h2>
      </div>
      <div
        className="font-semi-bold md:bg-linear-to-r h-full w-full items-center md:flex
          md:from-once-400 md:to-ponce-400 md:text-2xl md:font-semibold md:text-gray-800"
      >
        <div className="py-2 text-center md:flex-1">
          <a
            className="whitespace-pre underline md:px-2 md:align-baseline md:no-underline
              md:hover:text-thrice"
            href="mailto: help@kpoppop.com"
          >
            <FontAwesomeIcon className="px-2 md:align-middle" icon={faEnvelope} />
            help@kpoppop.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
