import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// Color-coded role badges
const ROLE_BADGE = {
  student:  "bg-blue-100 text-blue-700",
  lecturer: "bg-purple-100 text-purple-700",
  guest:    "bg-gray-100 text-gray-500",
  admin:    "bg-red-100 text-red-600",
};

export default function AdminChat() {
  const [threads, setThreads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  // Initialize socket once
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:7000");

    socketRef.current.on("newMessage", (msg) => {
      setSelected((prev) => {
        if (!prev) return prev;
        return { ...prev, messages: [...(prev.messages || []), msg] };
      });
    });

    return () => socketRef.current.disconnect();
  }, []);

  // Load all threads on mount
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await API.get("/contact/threads");
        setThreads(res.data || []);
      } catch (err) {
        console.error("Load threads error:", err);
      }
    };
    fetchThreads();
  }, []);

  // Open a thread
  const openChat = async (id) => {
    try {
      const res = await API.get(`/contact/thread/${id}`);
      setSelected(res.data);
      socketRef.current.emit("joinThread", res.data._id);
    } catch (err) {
      console.error("Open chat error:", err);
    }
  };

  // Send reply
  const sendReply = async () => {
    if (!selected?._id || !message.trim()) return;
    try {
      await API.post(`/contact/reply/${selected._id}`, { message: message.trim() });
      setMessage("");
    } catch (err) {
      console.error("Send error:", err.response?.data || err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages?.length]);

  // Pull identity fields from thread document
  const getIdentity = (t) => ({
    name:  t?.name  || t?.userId?.name  || "Unknown",
    email: t?.email || t?.userId?.email || "No email",
    role:  t?.role  || t?.userId?.role  || "guest",
  });

  const identity = getIdentity(selected);
  const messages = selected?.messages || [];

  return (
    <div className="flex h-screen bg-gray-50">

      {/* ── SIDEBAR ── */}
      <div className="w-80 bg-white border-r flex flex-col shrink-0">

        {/* ✅ Sidebar header with back button */}
        <div className="p-4 border-b">

          {/* Back button */}
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-3 group"
          >
            {/* Left arrow icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <p className="font-semibold text-gray-800">Support Inbox</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {threads.length} conversation{threads.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <p className="p-4 text-sm text-gray-400">No conversations yet</p>
          ) : (
            threads.map((t) => {
              const id = getIdentity(t);
              const isActive = selected?._id === t._id;
              const lastMsg = t.messages?.[t.messages.length - 1]?.message || "";

              return (
                <div
                  key={t._id}
                  onClick={() => openChat(t._id)}
                  className={`p-3 border-b cursor-pointer transition-colors hover:bg-blue-50
                    ${isActive ? "bg-blue-50 border-l-4 border-l-blue-500" : "border-l-4 border-l-transparent"}`}
                >
                  {/* Name + role badge */}
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm text-gray-800 truncate">
                      {id.name}
                    </span>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_BADGE[id.role] || ROLE_BADGE.guest}`}>
                      {id.role}
                    </span>
                  </div>

                  {/* Email */}
                  <p className="text-xs text-gray-500 truncate mb-1">{id.email}</p>

                  {/* Subject */}
                  <p className="text-xs font-medium text-blue-600 truncate">{t.subject}</p>

                  {/* Last message preview */}
                  {lastMsg && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{lastMsg}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── CHAT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Chat header */}
        {selected ? (
          <div className="bg-white border-b px-5 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {identity.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 text-sm">{identity.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_BADGE[identity.role] || ROLE_BADGE.guest}`}>
                  {identity.role}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{identity.email}</p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400">Subject</p>
              <p className="text-sm font-medium text-gray-700">{selected.subject}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border-b px-5 py-4">
            <p className="text-sm text-gray-400">Select a conversation to start replying</p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!selected ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm">No conversation selected</p>
            </div>
          ) : messages.length === 0 ? (
            <p className="text-gray-400 text-sm">No messages yet</p>
          ) : (
            messages.map((msg, i) => {
              const isAdmin = msg.sender === "admin";
              return (
                <div key={i} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-xs">
                    <p className={`text-xs mb-1 ${isAdmin ? "text-right text-blue-400" : "text-left text-gray-400"}`}>
                      {isAdmin ? "You (Admin)" : `${identity.name} · ${identity.role}`}
                    </p>
                    <div className={`px-4 py-2 break-words text-sm
                      ${isAdmin
                        ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                        : "bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t bg-white flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!selected}
            placeholder={selected ? `Reply to ${identity.name}...` : "Select a conversation first"}
            className="flex-1 border border-gray-200 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-50 disabled:text-gray-400"
          />
          <button
            onClick={sendReply}
            disabled={!selected || !message.trim()}
            className="bg-blue-600 text-white px-4 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}