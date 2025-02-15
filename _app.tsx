import { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
      <meta name="google-site-verification" content="zMatERrBVsLx0SYOEIdv-WN3ovW_tt3K4NM1eeLA75s" />
      </Head>
      <DefaultSeo
        title="DuiWay｜對味交友 - 三觀智能配對，約會更合拍！"
        description="「還在煩惱如何找到理想對象？DuiWay｜對味交友透過獨家『三觀問卷』，智能推薦最合拍的靈魂伴侶。不只線上聊天，還能安排真實見面，讓交友更高效、更有品質。立即加入，開始你的愛情旅程！」"
        openGraph={{
          url: "https://dating-3qwbo5f03-sams-projects-d90b494b.vercel.app/",
          title: "DuiWay｜對味交友 - 三觀智能配對，約會更合拍！",
          description: "透過三觀問卷智能配對，找到最適合你的靈魂伴侶！DuiWay｜對味交友專注於真誠配對，智能推薦 + 見面約會，讓你快速脫單，脫離無效社交！",
          site_name: "DuiWay｜對味交友",
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
