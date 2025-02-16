export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-center">
        {/* 程式碼感的 FindUCore */}
        <h1 className="text-6xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4f6d7a] via-[#2a3d51] to-[#6f9a8a]">
          <span className="font-mono">FindUCore｜找到核心價值觀</span>
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

        <div className="flex gap-4 items-center flex-col sm:flex-col justify-center">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-12 px-5 sm:px-12 w-full sm:w-auto"
            href="/login"
            target="_blank"
            rel="noopener noreferrer"
          >
            登入
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-12 px-5 sm:px-12 w-full sm:w-auto"
            href="/signup"
            target="_blank"
            rel="noopener noreferrer"
          >
            註冊
          </a>
        </div>
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
