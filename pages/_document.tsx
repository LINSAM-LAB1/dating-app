import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="zh">
        <Head>
          {/* Google Site Verification */}
          <meta name="google-site-verification" content="zMatERrBVsLx0SYOEIdv-WN3ovW_tt3K4NM1eeLA75s" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
