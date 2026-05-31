/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Unify www → apex (avoids duplicate content). Vercel also enforces
      // this at the domain level once the apex is set as primary.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.operonhub.com" }],
        destination: "https://operonhub.com/:path*",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
