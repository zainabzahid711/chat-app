// src/components/RoomLists.tsx
"use client";
import { useEffect, useState } from "react";

interface Room {
  id: number;
  name: string;
  created_at: string;
}

export default function RoomsList({
  userId,
  onJoinRoom,
}: {
  userId: string;
  onJoinRoom: (id: number, name: string) => void;
}) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch rooms from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/rooms/");
        if (!res.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        setError("Error loading rooms. Please try again.");
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Create a new room
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/rooms/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRoomName }),
      });

      if (res.ok) {
        const createdRoom = await res.json();
        setRooms((prev) => [...prev, createdRoom]);
        setNewRoomName("");
        setError("");
      } else {
        throw new Error("Failed to create room");
      }
    } catch (err) {
      setError("Error creating room. Please try again.");
      console.error("Error creating room:", err);
    }
  };

  if (loading) {
    return <div>Loading rooms...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Welcome, {userId}! Choose a room:</h2>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      {/* Rooms list */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Available Rooms:</h3>
        {rooms.length === 0 ? (
          <p>No rooms available. Create one below!</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {rooms.map((room) => (
              <li key={room.id} style={{ marginBottom: "10px" }}>
                <button
                  onClick={() => onJoinRoom(room.id, room.name)}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  {room.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Create new room */}
      <div>
        <h3>Create New Room:</h3>
        <form
          onSubmit={handleCreateRoom}
          style={{ display: "flex", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="New room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 15px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Create Room
          </button>
        </form>
      </div>
    </div>
  );
}
