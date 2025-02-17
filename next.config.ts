import { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
  eslint: {
    // 禁用 ESLint 設置
    ignoreDuringBuilds: true, // 在編譯期間忽略 ESLint 錯誤
  },
};

export default nextConfig;
