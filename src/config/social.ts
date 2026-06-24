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
    url: 'https://discord.com/users/verminew',
    username: 'verminew'
  },
  email: {
    address: 'werminew@protonmail.com',
    url: 'mailto:werminew@protonmail.com'
  }
} as const;

export const getSocialUrl = (platform: keyof typeof socialConfig) =>
  socialConfig[platform].url;