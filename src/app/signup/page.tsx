"use client"; // ✅ 这行一定要加在最顶部 

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ 导入 useRouter 进行跳转
import { auth, db } from "../firebase"; // ✅ 确保 firebase.ts 里正确导出 auth & db
import { createUserWithEmailAndPassword } from "firebase/auth";
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

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>注册</h1>
      <input type="text" placeholder="姓名" onChange={(e) => setName(e.target.value)} />
      <input type="number" placeholder="年龄" onChange={(e) => setAge(e.target.value)} />
      <input type="email" placeholder="邮箱" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="密码" onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="照片 URL" onChange={(e) => setPhoto(e.target.value)} />
      <button onClick={handleSignUp}>注册</button>
    </div>
  );
}
