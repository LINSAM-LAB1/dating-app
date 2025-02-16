import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FindUCore｜尋找核心價值觀",
  description: "「還在煩惱如何找到理想對象？FindUCore｜尋找核心價值觀透過獨家『三觀問卷』、『智能配對』、『實體見面』，智能推薦幫你找到價值觀相似的人。不只線上聊天，還能安排真實見面，讓交友更高效、更有品質。立即加入，開始你的愛情旅程！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta name="google-site-verification" content="zMatERrBVsLx0SYOEIdv-WN3ovW_tt3K4NM1eeLA75s" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
