"use client"; // 标记此文件为客户端组件

import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

// 检测是否在 LINE 的 WebView 内
const isLineWebView = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("line");
};

const openInExternalBrowser = (url: string) => {
  const isIOSStandalone = (window.navigator as any).standalone;
  if (isIOSStandalone) {
    // iOS PWA 环境
    window.location.href = url;
  } else {
    // 其他情况，尝试在默认浏览器中打开
    window.open(url, '_blank');
  }
};

// 用法：
openInExternalBrowser('https://yourwebsite.com');


export default function Home() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    if (isLineWebView()) {
      alert("检测到您在 LINE 内打开，请在外部浏览器登录 Google。");
      openInExternalBrowser(window.location.href);
      return;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Google 登录失败：", error);
      alert("Google 登录失败");
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4f6d7a] via-[#2a3d51] to-[#6f9a8a]">
          <span className="font-mono">FindUCore｜遇見對的人</span>
        </h1>
        <ol className="list-inside list-decimal text-sm text-center sm:text-center font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            歡迎來到交友網站，FindUCore全名Find you Core beliefs，讓你遇見對的價值觀
            <code className="bg-black/[.05] dark:bg-white/[.05] px-1 py-0.5 rounded font-semibold">
              系統透過三觀問卷、智能匹配、實體見面，幫助您開啟旅程
            </code>
            .
          </li>
          <li>點擊《註冊/登入》按鈕開始<code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold"> 免費 </code>尋找您的伴侶</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-col justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-white text-black gap-2 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] text-sm sm:text-base h-12 px-5 sm:px-12 w-full sm:w-auto mt-4"
          >
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpJ20a1arvwqPXEyHoGer8g2sNveUrFKB_Rg&s" alt="Google Logo" className="w-5 h-5" />
            登录
          </button>
        </div>
      </main>
    </div>
  );
}
