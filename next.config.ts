import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep pdf-parse server-side only — not bundled into client
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
