// Example fetch

// app/api/rooms/rooms.ts
useEffect(() => {
  fetch("/api/rooms/")
    .then((res) => res.json())
    .then((data) => setRooms(data));
}, []);
