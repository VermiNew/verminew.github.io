export const socialConfig = {
  github: {
    url: 'https://github.com/VermiNew',
    username: 'VermiNew'
  },
  discord: {
    url: 'https://discord.com/users/verminew',
    username: 'verminew'
  },
  email: {
    address: 'verminewfey@gmail.com',
    url: 'mailto:verminewfey@gmail.com'
  }
} as const;

// Helper function to get social media URLs
export const getSocialUrl = (platform: keyof typeof socialConfig) => {
  if (platform === 'email') return socialConfig[platform].url;
  return socialConfig[platform].url;
};

// Helper function to get usernames/addresses
export const getSocialUsername = (platform: keyof typeof socialConfig) => {
  if (platform === 'email') return socialConfig[platform].address;
  return socialConfig[platform].username;
}; 