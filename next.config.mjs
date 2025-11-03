/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false, // ADD THIS LINE - prevents trailing slash redirects
  skipTrailingSlashRedirect: true, // ADD THIS LINE - completely disable trailing slash redirects
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
