"use client"; // 标记此文件为客户端组件

import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("登录成功！");
      router.push("/dashboard"); // 登录后跳转到主页
    } catch (error: unknown) {
      alert("登入錯誤");
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">登录</h1>

        {/* 邮箱输入框 */}
        <input
          type="email"
          placeholder="邮箱"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 密码输入框 */}
        <input
          type="password"
          placeholder="密码"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 登录按钮 */}
        <button
          onClick={handleLogin}
          className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 mb-4"
        >
          登录
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            没有账户？{" "}
            <a href="/signup" className="text-blue-600 hover:text-blue-700">
              注册
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
