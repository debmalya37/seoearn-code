/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    swcMinify: false,
    transpilePackages: ['crypto-js'], // Include any other packages if needed
    images: {
      domains: ['lh3.googleusercontent.com'], // Add other domains as needed
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          crypto: false,
          // Add other modules to exclude if needed
        };
      }
      return config;
    },
  };
  
  export default nextConfig; // Use export default for ES6 syntax