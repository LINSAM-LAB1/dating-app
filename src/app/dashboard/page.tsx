"use client";

import { useState, useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/navigation"; // 用來進行頁面跳轉


interface Profile {
  name: string;
  age: number;
  email: string;
  photo: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedToday, setViewedToday] = useState<number>(0);
  const [matchedUser, setMatchedUser] = useState<Profile | null>(null); // 新增配對用戶狀態
  const auth = getAuth();
  const router = useRouter(); // 用來跳轉到聊天頁面

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await checkViewedCount(currentUser.uid); // 读取 Firestore 的推荐次数
        await loadProfiles(currentUser);
      } else {
        setUser(null);
        setProfiles([]);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const checkViewedCount = async (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const today = new Date().toISOString().split("T")[0];

      if (data.lastRecommendDate === today) {
        setViewedToday(data.recommendCount || 0);
      } else {
        await updateDoc(userDocRef, {
          lastRecommendDate: today,
          recommendCount: 0,
        });
        setViewedToday(0);
      }
    } else {
      await setDoc(userDocRef, {
        lastRecommendDate: new Date().toISOString().split("T")[0],
        recommendCount: 0,
      });
      setViewedToday(0);
    }
  };

  const updateViewedCount = async () => {
    if (!user) return;
    
    const newCount = viewedToday + 1;
    const userDocRef = doc(db, "users", user.uid);
    
    await updateDoc(userDocRef, { recommendCount: newCount });
    setViewedToday(newCount);
  };

  const loadProfiles = async (currentUser: User) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "!=", currentUser.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const usersData = querySnapshot.docs.map((doc) => doc.data() as Profile);
        setProfiles(usersData);
        setCurrentIndex(0);
      } else {
        console.log("没有找到其他用户数据");
      }
    } catch (error) {
      console.error("加载推荐用户时出错:", error);
    }
  };

  const handleNextProfile = () => {
    if (viewedToday >= 3) return;

    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }

    updateViewedCount();
  };

  const handleLike = async () => {
    if (!user) {
      console.error("用户未登录");
      return;
    }

    const likedUser = profiles[currentIndex];
    console.log(`喜欢: ${likedUser.name}`);

    try {
      const likeRef = doc(db, "likes", `${user.uid}_${likedUser.email}`);
      await setDoc(likeRef, {
        userId: user.uid,
        likedUserId: likedUser.email,
        timestamp: new Date().toISOString()
      });

      const reverseLikeQuery = query(
        collection(db, "likes"),
        where("likedUserId", "==", likedUser.email),
        where("userId", "==", user.uid)
      );
      const reverseLikeSnapshot = await getDocs(reverseLikeQuery);

      if (!reverseLikeSnapshot.empty) {
        alert("配对成功！");
        setMatchedUser(likedUser); // 设置配对成功的用户
      } else {
        console.log("反向喜欢记录不存在，等待对方喜欢！");
      }

      handleNextProfile();
    } catch (error) {
      console.error("添加喜欢记录时出错:", error);
    }
  };

  const handleDislike = () => {
    console.log(`不喜欢: ${profiles[currentIndex].name}`);
    handleNextProfile();
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfiles([]);
    } catch (error) {
      console.error("退出登录失败:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {user ? (
        <>
          <h1 className="text-2xl font-bold">欢迎, {user.email}！</h1>
          {viewedToday >= 3 ? (
            <p className="text-red-500 mt-4">今天的推荐用完了，请明天再来！</p>
          ) : profiles.length > 0 ? (
            <div className="mt-4 flex flex-col items-center">
              <h2 className="text-xl">{profiles[currentIndex].name}, {profiles[currentIndex].age} 岁</h2>
              <img src={profiles[currentIndex].photo} alt={profiles[currentIndex].name} className="w-32 h-32 rounded-full mt-2" width={500} height={300} />
              <div className="flex mt-4">
                <button onClick={handleLike} className="px-4 py-2 bg-green-500 text-white rounded mr-2">喜欢</button>
                <button onClick={handleDislike} className="px-4 py-2 bg-red-500 text-white rounded">不喜欢</button>
              </div>
              <p className="mt-2">今天剩余推荐次数: {3 - viewedToday}</p>
            </div>
          ) : (
            <p>加载推荐用户中...</p>
          )}
          <button onClick={handleSignOut} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
            退出
          </button>

          {/* 如果配对成功，则显示聊天链接 */}
          {matchedUser && (
            <div className="mt-4">
              <p>你和 {matchedUser.name} 配对成功！</p>
              <button
                onClick={() => router.push(`/chat?userId=${user.email}&matchedUserId=${matchedUser.email}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded">
                去聊天
              </button>
            </div>
          )}
        </>
      ) : (
        <p>请先登录</p>
      )}
    </div>
  );
}
