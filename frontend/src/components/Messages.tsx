// src/components/Messages.tsx
"use client";
import { useEffect, useState, useRef } from "react";

type Message = {
  id: number;
  user: string;
  content: string;
  timestamp: string;
};

export default function Messages({
  roomId,
  userId,
}: {
  roomId: number;
  userId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch previous messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/messages/?room=${roomId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await res.json();
        setMessages(data);
        scrollToBottom();
      } catch (err) {
        setError("Error loading messages. Please try again.");
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  // Setup WebSocket connection - ONLY THIS ONE SHOULD EXIST
  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomId}/`);
    wsRef.current = ws;

    // Add debug logging
    console.log("WebSocket created, readyState:", ws.readyState);

    ws.onopen = () => {
      console.log(
        "WebSocket connection established, readyState:",
        ws.readyState
      );
      setError("");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.message) {
        const tempMessage = {
          id: Date.now(),
          user: data.user || "Unknown",
          content: data.message,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempMessage]);
      } else {
        setMessages((prev) => [...prev, data]);
      }
      scrollToBottom();
    };

    ws.onerror = (error) => {
      console.error(
        "WebSocket error:" +
          JSON.stringify(error) +
          "readyState:" +
          ws.readyState
      );

      // Check actual connection state before showing error
      if (ws.readyState === WebSocket.CLOSED) {
        setError("Connection error. Please refresh the page.");
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  // Send new message
  const handleSend = async () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      room: roomId,
      user: userId,
      content: newMessage.trim(),
    };

    try {
      // Send via WebSocket first for real-time
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            message: newMessage.trim(),
            user: userId,
          })
        );
      }

      // Also send via REST API to persist
      const res = await fetch("http://127.0.0.1:8000/api/messages/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (res.ok) {
        setNewMessage("");
        setError("");
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      setError("Error sending message. Please try again.");
      console.error("Error sending message:", err);
    }
  };

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div
      style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "15px" }}
    >
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      <div
        className="messages-container"
        style={{
          height: "400px",
          overflowY: "auto",
          marginBottom: "15px",
          padding: "10px",
          border: "1px solid #eee",
          borderRadius: "4px",
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#777" }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                marginBottom: "10px",
                padding: "8px",
                backgroundColor: msg.user === userId ? "#e3f2fd" : "#f5f5f5",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  color: msg.user === userId ? "#1976d2" : "#555",
                }}
              >
                {msg.user} {msg.user === userId && "(You)"}
              </div>
              <div>{msg.content}</div>
              <div style={{ fontSize: "12px", color: "#777" }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleSend}
          disabled={newMessage.trim() === ""}
          style={{
            padding: "10px 15px",
            backgroundColor: newMessage.trim() === "" ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: newMessage.trim() === "" ? "not-allowed" : "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
