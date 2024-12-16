import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'oaidalleapicontent.blob.core.windows.net'
    ],
    unoptimized: true
  },
};

export default nextConfig;
