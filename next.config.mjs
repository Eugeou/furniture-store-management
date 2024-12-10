/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        // You can add these as well
        // port: '',
        // pathname: 'arifscloud/image/upload/**',
      },
    ],
  },
};

export default nextConfig;
