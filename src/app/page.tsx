"use client"; // Next.js 客户端组件

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Home() {
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const [isLineBrowser, setIsLineBrowser] = useState(false);

  // 检测是否在 LINE 浏览器中
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/Line/i.test(userAgent)) {
      setIsLineBrowser(true);
    }
  }, []);

  // 处理 Google 登录回调
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
          });
          router.push("/dashboard"); // 登录成功后跳转
        }
      } catch (error) {
        console.error("Google 登录失败：", error);
        alert("Google 登录失败");
      }
    };
    handleRedirectResult();
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Google 登录失败：", error);
      alert("Google 登录失败");
    }
  };

  // 强制在外部浏览器打开页面
  const openInExternalBrowser = () => {
    const url = window.location.href;
    window.location.href = `googlechrome://${url}`; // Android Chrome
    setTimeout(() => {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(url)}`; // 兼容 Safari
    }, 500);
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
          <li>點擊《註冊/登入》按鈕開始<code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              免費
            </code>尋找您的伴侶</li>
        </ol>

        {/* 如果在 LINE 浏览器，显示提示 */}
        {isLineBrowser ? (
          <div className="flex flex-col items-center">
            <p className="text-red-600 text-lg font-semibold">
              你正在使用 LINE 内建浏览器，Google 登录可能无法使用
            </p>
            <button
              onClick={openInExternalBrowser}
              className="rounded-full bg-blue-600 text-white px-5 py-3 mt-4 text-lg font-bold"
            >
              在 Chrome/Safari 打开
            </button>
          </div>
        ) : (
          // Google 登录按钮
          <div className="flex gap-4 items-center flex-col sm:flex-col justify-center">
            <button
              onClick={handleGoogleSignIn}
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-white text-black gap-2 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] text-sm sm:text-base h-12 px-5 sm:px-12 w-full sm:w-auto mt-4"
            >
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpJ20a1arvwqPXEyHoGer8g2sNveUrFKB_Rg&s" alt="Google Logo" className="w-5 h-5" />
              使用 Google 登录
            </button>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          條款與隱私
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          故事起源
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          關於我們 →
        </a>
      </footer>
    </div>
  );
}
