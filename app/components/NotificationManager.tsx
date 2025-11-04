"use client";
import { useState } from "react";

let addMessage: (msg: string, type?: "success" | "error" | "info") => void;

export default function NotificationManager() {
  const [messages, setMessages] = useState<
    { id: number; text: string; type: "success" | "error" | "info" }[]
  >([]);

  addMessage = (
    msg: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, text: msg, type }]);

    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 3000);
  };

  return (
    <div className="fixed bottom-5 right-5 space-y-2 z-50">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`px-4 py-2 rounded-lg shadow-lg text-white ${
            m.type === "success"
              ? "bg-green-500"
              : m.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {m.text}
        </div>
      ))}
    </div>
  );
}

export function notify(
  msg: string,
  type: "success" | "error" | "info" = "success"
) {
  if (addMessage) addMessage(msg, type);
}
