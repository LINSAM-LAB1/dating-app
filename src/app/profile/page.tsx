"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase"; // 确保引入 db
import { doc, getDoc, setDoc } from "firebase/firestore";

// 用户资料接口
interface UserProfile {
  name: string;
  age: number;
  photo: string;
}

export default function Profile() {
  const [user, setUser] = useState<string | null>(null); // 当前登录用户
  const [profile, setProfile] = useState<UserProfile | null>(null); // 当前用户资料
  const [newName, setNewName] = useState<string>("");
  const [newAge, setNewAge] = useState<number>(0);
  const [newPhoto, setNewPhoto] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email) {  // 确保 currentUser 存在并且有 email
        setUser(currentUser.email);
        loadProfile(currentUser.email);  // 这里我们可以安全地使用 currentUser.email
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  // 加载当前用户资料
  const loadProfile = async (email: string) => {
    const userRef = doc(db, "users", email);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      setProfile(docSnap.data() as UserProfile);
    } else {
      console.log("没有找到用户资料");
    }
  };

  // 更新用户资料
  const handleUpdateProfile = async () => {
    if (profile) {
      const userRef = doc(db, "users", user!);
      await setDoc(userRef, {
        name: newName || profile.name,
        age: newAge || profile.age,
        photo: newPhoto || profile.photo,
      });

      loadProfile(user!); // 更新资料后重新加载
    }
  };

  // 退出登录
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mt-5">个人资料</h1>

      <div className="mt-6 w-full max-w-md">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700">姓名</label>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-lg w-full"
              value={newName || profile?.name || ""}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">年龄</label>
            <input
              type="number"
              className="border border-gray-300 p-2 rounded-lg w-full"
              value={newAge || profile?.age || ""}
              onChange={(e) => setNewAge(Number(e.target.value))}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">头像 URL</label>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-lg w-full"
              value={newPhoto || profile?.photo || ""}
              onChange={(e) => setNewPhoto(e.target.value)}
            />
          </div>

          <button
            onClick={handleUpdateProfile}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
          >
            更新资料
          </button>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        退出登录
      </button>
    </div>
  );
}
