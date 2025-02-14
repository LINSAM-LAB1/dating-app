"use client";  // 标记此文件为客户端组件

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
    } catch (error:unknown) {
      alert("登入錯誤");
      console.log(error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>登录</h1>
      <input type="text" placeholder="邮箱" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="密码" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>登录</button>
    </div>
  );
}
