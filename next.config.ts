import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  /* SANDBOX PREVIEW ONLY (not part of the static-site deliverable):
     proxy the mock Supabase service (mini-services/mock-supabase, port 3040)
     so the static pages served from public/ work on port 3000 too. The real
     deliverable talks to the real Supabase project directly — these rewrites
     never run on GitHub Pages. */
  async rewrites() {
    const mock = "http://localhost:3040";
    return [
      { source: "/rest/v1/:path*", destination: `${mock}/rest/v1/:path*` },
      { source: "/auth/v1/:path*", destination: `${mock}/auth/v1/:path*` },
      { source: "/storage/v1/:path*", destination: `${mock}/storage/v1/:path*` },
    ];
  },
};

export default nextConfig;
