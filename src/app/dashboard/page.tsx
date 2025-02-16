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
  const [matchedUsers, setMatchedUsers] = useState<Profile[]>([]); // 配对用户列表
  const [sidebarOpen, setSidebarOpen] = useState(true); // 控制左侧列表显示
  const auth = getAuth();
  const router = useRouter(); // 用来跳转到聊天页面
  const [settingsOpen, setSettingsOpen] = useState(false); // 用于管理齿轮菜单的状态
 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await checkViewedCount(currentUser.uid);
        await loadProfiles(currentUser);

        // 查询 matches 集合，检查是否有配对记录
        const matchesRef = collection(db, "matches");

        // 查询 userId 等于当前用户 email 的记录
        const userQuery = query(matchesRef, where("userId", "==", currentUser.email));
        const matchedQuery = query(matchesRef, where("matchedUserId", "==", currentUser.email));

        // 获取两个查询结果
        const userSnapshot = await getDocs(userQuery);
        const matchedSnapshot = await getDocs(matchedQuery);

        const matchedUsersList: Profile[] = [];

        // 合并两个查询的结果
        userSnapshot.docs.forEach((doc) => {
          const matchedDoc = doc.data();
          matchedUsersList.push({
            name: matchedDoc.matchedUserId, // 假设 matchedUserId 是配对用户的 email
            age: 0, // 根据需要加载更多资料
            email: matchedDoc.matchedUserId,
            photo: "" // 根据需要加载更多资料
          });
        });

        matchedSnapshot.docs.forEach((doc) => {
          const matchedDoc = doc.data();
          matchedUsersList.push({
            name: matchedDoc.userId, // 假设 userId 是配对用户的 email
            age: 0, // 根据需要加载更多资料
            email: matchedDoc.userId,
            photo: "" // 根据需要加载更多资料
          });
        });

        // 打印配对成功的用户信息
        console.log("配对成功的用户列表：", matchedUsersList);

        // 去除重复的用户（如果存在）
        const uniqueMatchedUsers = Array.from(
          new Map(matchedUsersList.map((user) => [user.email, user])).values()
        );
        
        setMatchedUsers(uniqueMatchedUsers); // 设置多个配对用户
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const checkViewedCount = async (userId: string) => {
    const userDocRef = doc(db, "users", userId); // 获取当前用户文档的引用
    const docSnap = await getDoc(userDocRef); // 获取文档内容
    console.log(userId);
    const today = new Date().toISOString().split("T")[0]; // 获取今天的日期
  
    if (docSnap.exists()) {
      const data = docSnap.data();
  
      // 如果今天已经有记录了推荐次数，则直接更新视图
      if (data.lastRecommendDate === today) {
        setViewedToday(data.recommendCount || 0); // 显示当前推荐次数
      } else {
        // 如果今天没有记录，更新文档，重置推荐次数
        await updateDoc(userDocRef, {
          lastRecommendDate: today, // 更新今天的日期
          recommendCount: 0, // 重置推荐次数为 0
        });
        setViewedToday(0); // 更新本地状态
      }
    } else {
      // 如果找不到文档，这里其实不应该发生，既然文档是注册时创建的
      console.log("User document not found!"); // 可以加入日志查看问题
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
        setMatchedUsers((prev) => [...prev, likedUser]); // 添加配对成功的用户到列表

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

// 新增的处理齿轮菜单点击的函数
const handleSettingsClick = () => {
  setSettingsOpen(!settingsOpen);  // 切换齿轮菜单的状态
};

return (
  <div className="flex h-screen">
    {/* 左侧列表区域 */}
    <div className={`transition-all duration-300 bg-gray-800 text-white ${sidebarOpen ? "w-64" : "w-20"} p-4 flex flex-col justify-between`}>
      
      {/* 展开/收起按钮 - 替换为箭头图标 */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-4 text-xl w-full text-center bg-gray-700 hover:bg-gray-600 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sidebarOpen ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
        </svg>
        <p className="text-white text-sm">配對成功的用戶</p>
      </button>

      {/* 设置按钮（右上角） */}
      <div className="absolute top-4 right-4">
        <button onClick={handleSettingsClick} className="text-gray-800 text-3xl">
          {/* 使用汉堡菜单图标 */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* 设置菜单 */}
      {settingsOpen && (
        <div className="absolute top-12 right-4 bg-white text-gray-800 p-4 rounded-lg shadow-lg">
          <ul>
            <li className="py-2"><a href="/settings" className="hover:bg-gray-200">设置</a></li>
            <li className="py-2"><a href="/profile" className="hover:bg-gray-200">个人资料</a></li>
            <li className="py-2"><a href="/logout" className="hover:bg-gray-200">退出</a></li>
          </ul>
        </div>
      )}

      {/* 显示配对成功的用户区域 */}
      {sidebarOpen && matchedUsers.length > 0 && (
        <div className="flex flex-col items-start mt-4 overflow-y-auto max-h-auto">
          {matchedUsers.map((matchedUser) => (
            <div key={matchedUser.email} className="flex flex-col items-start p-2 bg-gray-700 rounded-lg w-full mb-2">
              <p className="text-white text-sm">和 {matchedUser.name} </p>
              <button
                onClick={() => router.push(`/chat?userId=${user?.email}&matchedUserId=${matchedUser.email}`)}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs">
                聊天
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* 主要内容区域 */}
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
            <p className="mt-4 text-gray-600">加载中...</p>
          )}
          <button onClick={handleSignOut} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 transition">
            退出登录
          </button>
        </>
      ) : (
        <p className="text-gray-600">加载中...</p>
      )}
    </div>
  </div>
);

}