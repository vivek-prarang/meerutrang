/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['hi'],
    defaultLocale: 'hi',
  },
  async redirects() {
    return [
      {
        source: '/%E0%A4%B2%E0%A5%87%E0%A4%96/:id/:slug*',
        destination: '/लेख/:id/:slug*',
        permanent: true,
      },

    ];
  },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
