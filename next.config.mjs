/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'trackercdn.com',
          pathname: '/cdn/tracker.gg/valorant/icons/**',
        },
        {
          protocol: 'https',
          hostname: 'static-cdn.jtvnw.net',
          pathname: '/badges/**',
        }
      ],
    },
  };
  
  export default nextConfig;