import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import API from "../services/api";

export default function StudentContact() {
  const [thread, setThread] = useState(null);
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // ✅ FIX: Safely extract user — handles all common localStorage shapes:
  //   Shape A: { name, email, role }           → stored directly
  //   Shape B: { user: { name, email, role } }  → nested under "user" key
  //   Shape C: { username, email }              → "username" instead of "name"
  const rawStored = JSON.parse(localStorage.getItem("user") || "null");
  const storedUser = rawStored?.user || rawStored || {};

  const user = {
    name:  storedUser.name  || storedUser.username  || storedUser.fullName  || "Student",
    email: storedUser.email || storedUser.userEmail || "student@email.com",
    role:  storedUser.role  || "student",
  };

  // 👇 TEMPORARY — check the console to confirm fields, then remove these two lines
  console.log("RAW localStorage user:", rawStored);
  console.log("Resolved user fields:", user);

  // Initialize socket once
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:7000");

    socketRef.current.on("newMessage", (msg) => {
      setThread((prev) => {
        if (!prev) return prev;
        return { ...prev, messages: [...(prev.messages || []), msg] };
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Load existing thread on mount
  useEffect(() => {
    const fetchThread = async () => {
      try {
        const res = await API.get("/contact/my-thread");
        const t = res.data || null;
        setThread(t);
        if (t?._id) {
          socketRef.current?.emit("joinThread", t._id);
        }
      } catch (err) {
        console.error("fetchThread error:", err);
      }
    };
    fetchThread();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages?.length]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const trimmed = message.trim();

    try {
      if (!thread?._id) {
        // First message — create the thread
        const payload = {
          name: user.name,
          email: user.email,
          subject: "Support",
          message: trimmed,
        };

        console.log("Sending /start payload:", payload); // 👈 remove after debugging

        const res = await API.post("/contact/start", payload);
        const newThread = res.data.data;
        setThread(newThread);
        socketRef.current.emit("joinThread", newThread._id);
        setMessage("");
        return;
      }

      // Subsequent messages
      await API.post(`/contact/reply/${thread._id}`, { message: trimmed });
      setMessage("");
    } catch (err) {
      // ✅ Logs the actual backend error message so you can see what failed
      console.error("sendMessage error:", err.response?.data || err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const messages = thread?.messages || [];

  return (
    <div className="h-screen flex flex-col bg-blue-50">
      <div className="p-4 bg-white border-b font-semibold text-blue-700">
        Student Support Chat
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-8">
            Send a message to start a conversation with support.
          </p>
        )}

        {messages.map((msg, i) => {
          const isStudent = msg.sender === "student" || msg.sender === "guest";
          return (
            <div
              key={i}
              className={`flex mb-2 ${isStudent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-xs break-words text-sm ${
                  isStudent ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t flex gap-2 bg-white">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border p-2 rounded-lg text-sm"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          disabled={!message.trim()}
          className="bg-blue-600 text-white px-4 rounded-lg disabled:opacity-50 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}