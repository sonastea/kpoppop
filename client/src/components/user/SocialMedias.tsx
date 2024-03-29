import { SocialIcon } from 'react-social-icons';
import { useState } from 'react';

type SocialMediasProps = {
  socialMedias: Array<SocialMediaLink> | undefined;
};

export type SocialMediaLink = {
  uuid: string;
  title?: string | undefined;
  url: string;
};

export type EditSocialLinkFormData = {
  title?: string | undefined;
  url: string;
};

const SocialMedias = ({ socialMedias }: SocialMediasProps) => {
  const [socials] = useState(socialMedias);

  if (!socials) return null;
  return (
    <>
      <div className="flex justify-center lg:flex-wrap">
        {socials.map((social: SocialMediaLink) => {
          return (
            <div className="m-3 hover:text-once-700" key={social.uuid}>
              <div className="space-x-1">
                <SocialIcon
                  style={{ verticalAlign: 'bottom', width: '24px', height: '24px' }}
                  url={`${social.url}`}
                  aria-label={social.title}
                />
                <a className="align-sub" href={`${social.url}`} aria-label={social.url}>
                  <p className="hidden align-bottom text-xl lg:inline">{social.title}</p>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SocialMedias;
