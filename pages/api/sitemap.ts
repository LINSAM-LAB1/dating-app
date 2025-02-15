// pages/api/sitemap.xml.ts
import { NextApiRequest, NextApiResponse } from "next";

// 模拟从数据库或其他源获取页面 URL
const pages = [
  { url: "/", priority: 1.0 },
  { url: "/signup", priority: 0.8 },
  { url: "/login", priority: 0.8 },
  // 你可以根据实际的页面动态生成更多 URL
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "text/xml");

  // 动态生成站点地图的 URL 部分
  const urls = pages
    .map(page => {
      return `
      <url>
        <loc>https://dating-app-git-main-sams-projects-d90b494b.vercel.app/${page.url}</loc>
        <priority>${page.priority}</priority>
      </url>`;
    })
    .join("\n");

  // 生成完整的站点地图 XML 内容
  res.write(`<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`);
  
  res.end();
}
