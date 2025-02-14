"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export default function Chat() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // 当前用户
  const matchedUserId = searchParams.get("matchedUserId"); // 对方用户

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // 引用消息容器元素
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!userId || !matchedUserId) return;

    const chatId = userId < matchedUserId ? `${userId}_${matchedUserId}` : `${matchedUserId}_${userId}`;
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        senderId: doc.data().senderId,
        text: doc.data().text,
        timestamp: doc.data().timestamp,
      })) as Message[];

      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [userId, matchedUserId]);

  useEffect(() => {
    // 滚动到对话的底部
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // 每次消息更新时自动滚动到底部

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId || !matchedUserId) return;

    const chatId = userId < matchedUserId ? `${userId}_${matchedUserId}` : `${matchedUserId}_${userId}`;
    const messagesRef = collection(db, "chats", chatId, "messages");

    await addDoc(messagesRef, {
      senderId: userId,
      text: newMessage.trim(),
      timestamp: serverTimestamp(),
    });
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <h1 className="text-xl font-bold mb-4">聊天室</h1>
      <div className="flex-1 overflow-y-auto border p-4 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 my-2 w-fit max-w-xs rounded ${
              msg.senderId === userId
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start mr-auto"
            }`}
          >
            <div className="font-semibold">
              {msg.senderId === userId ? "我:" : "对方:"}
            </div>
            <div>{msg.text}</div>
          </div>
        ))}
        {/* 这个空的 div 用来让滚动容器自动滚动到底部 */}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
        >
          发送
        </button>
      </div>
    </div>
  );
}
