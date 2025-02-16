import { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        title="FindUCore｜尋找核心價值觀 - 透過『三觀問卷』、『智能配對』、『實體見面』，讓你遇見對的人！"
        description="「還在煩惱如何找到理想對象？FindUCore｜尋找核心價值觀透過獨家『三觀問卷』、『智能配對』、『實體見面』，智能推薦最合拍的靈魂伴侶。不只線上聊天，還能安排真實見面，讓交友更高效、更有品質。立即加入，開始你的愛情旅程！」"
        openGraph={{
          url: "https://dating-3qwbo5f03-sams-projects-d90b494b.vercel.app/",
          title: "FindUCore｜尋找核心價值觀 - 三觀智能配對，見面約會更合拍！",
          description: "透過三觀問卷智能配對，找到最適合你的靈魂伴侶！FindUCore｜尋找核心價值觀交友平台專注於真誠配對，尋找價值觀對的人，智能推薦 + 見面約會，讓你快速脫單，脫離無效社交！",
          site_name: "FindUCore｜尋找核心價值觀",
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
