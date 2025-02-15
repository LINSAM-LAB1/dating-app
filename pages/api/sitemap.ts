import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "text/xml");
  res.write(`<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://dating-3qwbo5f03-sams-projects-d90b494b.vercel.app/</loc>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>https://dating-3qwbo5f03-sams-projects-d90b494b.vercel.app/signup</loc>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://dating-3qwbo5f03-sams-projects-d90b494b.vercel.app/login</loc>
      <priority>0.8</priority>
    </url>
  </urlset>`);
  res.end();
}
