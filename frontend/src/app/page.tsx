// src/app/page.tsx
"use client";
import { useState } from "react";
import LoginInput from "@/components/LoginInput";
import RoomsList from "@/components/RoomLists";
import Messages from "@/components/Messages";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [joinedRoom, setJoinedRoom] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleLogin = (id: string) => {
    setUserId(id);
  };

  const handleJoinRoom = (roomId: number, roomName: string) => {
    setJoinedRoom({ id: roomId, name: roomName });
  };

  const handleLeaveRoom = () => {
    setJoinedRoom(null);
  };

  // Step 1: Show login if user hasn't entered an ID
  if (!userId) {
    return <LoginInput onSubmit={handleLogin} />;
  }

  // Step 2: Show rooms list if user is logged in but hasn't joined a room
  if (!joinedRoom) {
    return <RoomsList userId={userId} onJoinRoom={handleJoinRoom} />;
  }

  // Step 3: Show messages if user has joined a room
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Room: {joinedRoom.name}</h1>
        <button
          onClick={handleLeaveRoom}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Leave Room
        </button>
      </div>
      <Messages roomId={joinedRoom.id} userId={userId} />
    </div>
  );
}
