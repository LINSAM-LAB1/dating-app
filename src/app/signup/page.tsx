"use client"; // ✅ 这行一定要加在最顶部 

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ 导入 useRouter 进行跳转
import { auth, db, googleAuthProvider } from "../firebase"; // ✅ 导入 googleAuthProvider
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // ✅ 添加 name
  const [age, setAge] = useState("");   // ✅ 添加 age
  const [photo, setPhoto] = useState(""); // ✅ 添加 photo URL
  const router = useRouter(); // ✅ 初始化 useRouter

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ 创建用户数据存入 Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        age: Number(age), // 确保 age 是数值
        photo
      });

      alert("注册成功！");
      router.push("/dashboard"); // ✅ 成功注册后跳转到 dashboard
    } catch (error: unknown) {
      console.error("注册失败：", error);
      alert("注册失败");
    }
  };

  // Google 登录处理
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      // 如果你希望将用户信息保存到 Firestore，可以在这里处理
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        age: 0, // 你可以选择在此处将年龄设为默认值
      });

      alert("Google 登录成功！");
      router.push("/dashboard"); // ✅ 成功登录后跳转到 dashboard
    } catch (error) {
      console.error("Google 登录失败：", error);
      alert("Google 登录失败");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">注册</h1>
        
        {/* 姓名输入框 */}
        <input 
          type="text" 
          placeholder="姓名" 
          onChange={(e) => setName(e.target.value)} 
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
        />
        
        {/* 年龄输入框 */}
        <input 
          type="number" 
          placeholder="年龄" 
          onChange={(e) => setAge(e.target.value)} 
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
        />
        
        {/* 邮箱输入框 */}
        <input 
          type="email" 
          placeholder="邮箱" 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
        />
        
        {/* 密码输入框 */}
        <input 
          type="password" 
          placeholder="密码" 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
        />
        
        {/* 照片 URL 输入框 */}
        <input 
          type="text" 
          placeholder="照片 URL" 
          onChange={(e) => setPhoto(e.target.value)} 
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
        />

        {/* 注册按钮 */}
        <button 
          onClick={handleSignUp}
          className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 mb-4"
        >
          注册
        </button>

        {/* Google 登录按钮 */}
        <button 
          onClick={handleGoogleSignIn}
          className="w-full p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 mb-4"
        >
          使用 Google 登录
        </button>

        <div className="text-center">
          <p>已有账户？<a href="/login" className="text-blue-500">登录</a></p>
        </div>
      </div>
    </div>
  );
}
