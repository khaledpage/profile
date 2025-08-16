import type { NextConfig } from "next";

// Ensure GitHub Pages gets correct asset paths when statically exporting
const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const basePath = isStatic ? process.env.NEXT_PUBLIC_BASE_PATH || "/profile" : "";

const nextConfig: NextConfig = {
  output: isStatic ? "export" : undefined,
  basePath: isStatic ? basePath : undefined,
  assetPrefix: isStatic ? `${basePath}/` : undefined,
  trailingSlash: isStatic ? true : undefined,
  images: {
    unoptimized: isStatic,
    remotePatterns: [
      { protocol: "https", hostname: "source.unsplash.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", port: "", pathname: "/**" },
    ],
  },
};

export default nextConfig;
