// Purpose: This file is used to configure the webpack settings for the Next.js project.
// Team: Acever-AI

const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;
