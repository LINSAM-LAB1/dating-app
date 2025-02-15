import Head from "next/head";

const GoogleVerification = () => {
  return (
    <>
      <Head>
        <meta
          name="google-site-verification"
          content="zMatERrBVsLx0SYOEIdv-WN3ovW_tt3K4NM1eeLA75s"
        />
      </Head>
      <div>
        <h1>Google 验证成功</h1>
        <p>您的网站已成功验证。</p>
      </div>
    </>
  );
};

export default GoogleVerification;
