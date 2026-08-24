export const socialConfig = {
  github: {
    url: 'https://github.com/VermiNew',
    username: 'VermiNew'
  },
  linkedin: {
    url: 'https://www.linkedin.com/in/michał-oślizło-137879384/',
    username: 'Michał Oślizło'
  },
  discord: {
    username: 'verminew'
  },
  email: {
    address: 'werminew@protonmail.com',
    url: 'mailto:werminew@protonmail.com'
  }
} as const;

type LinkedSocialPlatform = Exclude<keyof typeof socialConfig, 'discord'>;

export const getSocialUrl = (platform: LinkedSocialPlatform) =>
  socialConfig[platform].url;
