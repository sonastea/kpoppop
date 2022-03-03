import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ContactUs = () => {
  return (
    <div className="shadow-md md:w-full md:h-screen grid grid-rows-2 md:flex md:items-center">
      <div className="py-2 text-thrice md:bg-white md:flex-initial md:mx-20">
        <h2 className="text-2xl text-center md:text-once-400 md:text-7xl">Contact us</h2>
      </div>
      <div className="items-center w-full h-full md:text-gray-800 md:text-2xl font-semi-bold md:font-semibold md:flex md:bg-gradient-to-r md:from-once-400 md:to-ponce-400">
        <div className="py-2 text-center md:flex-1">
          <a className="underline md:no-underline md:px-2 md:align-baseline md:hover:text-thrice" href="mailto: help@kpoppop.com">
            <FontAwesomeIcon className="px-2 md:align-middle" icon={faEnvelope} />
            help@kpoppop.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
