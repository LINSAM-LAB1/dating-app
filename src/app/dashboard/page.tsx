"use client";

import { useState, useEffect } from "react";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/navigation"; 

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
  const [matchedUser, setMatchedUser] = useState<Profile | null>(null); // 配对用户
  const [sidebarOpen, setSidebarOpen] = useState(true); // 控制左侧列表显示
  const auth = getAuth();
  const router = useRouter(); // 用来跳转到聊天页面

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await checkViewedCount(currentUser.uid);
        await loadProfiles(currentUser);

        // 查询 matches 集合，检查是否有配对记录
        const matchesRef = collection(db, "matches");
        const matchQuery = query(
          matchesRef, 
          where("userId", "==", currentUser.email)
        );
        const matchSnapshot = await getDocs(matchQuery);

        if (!matchSnapshot.empty) {
          const matchedDoc = matchSnapshot.docs[0].data(); // 获取第一个配对记录
          const matchedUserProfile: Profile = {
            name: matchedDoc.matchedUserId, // 假设 matchedUserId 是配对用户的 email
            age: 0, // 可以根据需要加载更多资料
            email: matchedDoc.matchedUserId,
            photo: "" // 可以根据需要加载更多资料
          };
          setMatchedUser(matchedUserProfile); // 设置配对用户
        }
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
    if (!user) return; // 确保 user 不为 null

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
      // 在 "likes" 集合中记录喜欢
      const likeRef = doc(db, "likes", `${user.email}_${likedUser.email}`);
      await setDoc(likeRef, {
        userId: user.email,
        likedUserId: likedUser.email,
        timestamp: new Date().toISOString()
      });

      // 检查是否反向喜欢
      const reverseLikeQuery = query(
        collection(db, "likes"),
        where("likedUserId", "==", user.email),
        where("userId", "==", likedUser.email),
      ); 
      const reverseLikeSnapshot = await getDocs(reverseLikeQuery);

      if (!reverseLikeSnapshot.empty) {
        alert("配对成功！");
        setMatchedUser(likedUser); // 配对成功

        // 在 "matches" 集合中记录配对信息
        const matchRef = doc(db, "matches", `${user.email}_${likedUser.email}`);
        await setDoc(matchRef, {
          userId: user.email,
          matchedUserId: likedUser.email,
          matchDate: new Date().toISOString(),
          status: "matched",
          chatStarted: false // 初始状态为未开始聊天
        });

      } else {
        console.log("反向喜欢记录不存在，等待对方喜欢！");
        alert("等待对方喜欢中！");
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
    <div className="flex h-screen">
      {/* 左側列表區域 */}
      <div className={`transition-all duration-300 bg-gray-800 text-white ${sidebarOpen ? "w-64" : "w-20"} p-4 flex flex-col justify-between`}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 text-xl w-full text-center bg-gray-700 hover:bg-gray-600 rounded"
        >
          {sidebarOpen ? "收起" : "展开"}
        </button>
        
        {/* 顯示配對成功的用戶區域 */}
        {sidebarOpen && matchedUser && (
          <div className="flex flex-col items-start mt-4 overflow-y-auto max-h-64">
            <div className="flex flex-col items-center p-2 bg-gray-700 rounded-lg w-full">
              <p className="text-white text-sm">你和 {matchedUser.name} 配对成功！</p>
              <button
                onClick={() => router.push(`/chat?userId=${user?.email}&matchedUserId=${matchedUser.email}`)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded text-xs">
                去聊天
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {user ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800">欢迎, {user.email}！</h1>
            {viewedToday >= 3 ? (
              <p className="text-red-500 mt-4">今天的推荐用完了，请明天再来！</p>
            ) : profiles.length > 0 ? (
              <div className="mt-4 flex flex-col items-center">
                <h2 className="text-xl text-gray-700">{profiles[currentIndex].name}, {profiles[currentIndex].age} 岁</h2>
                <img src={profiles[currentIndex].photo} alt={profiles[currentIndex].name} className="w-32 h-32 rounded-full mt-2" />
                <div className="flex mt-4">
                  <button onClick={handleLike} className="px-4 py-2 bg-green-500 text-white rounded-full mr-2 hover:bg-green-400 transition">
                    喜欢
                  </button>
                  <button onClick={handleDislike} className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-400 transition">
                    不喜欢
                  </button>
                </div>
                <p className="mt-2 text-gray-600">今天剩余推荐次数: {3 - viewedToday}</p>
              </div>
            ) : (
              <p className="text-gray-500">加载推荐用户中...</p>
            )}
            <button onClick={handleSignOut} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-full">
              退出
            </button>
          </>
        ) : (
          <p>请先登录</p>
        )}
      </div>
    </div>
  );
}
