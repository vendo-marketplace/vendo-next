import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vendo-bucket.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
