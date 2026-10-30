import { useState } from "react";

export default function RoomCard({ room, action }) {
  const [imgOk, setImgOk] = useState(true);
  const photo = room.photos?.[0];

  return (
    <div className="card h-100">
      {photo && imgOk ? (
        <img src={photo} alt={`Room ${room.roomNumber}`} className="card-img-top room-img" onError={() => setImgOk(false)} />
      ) : (
        <div className="room-img d-flex align-items-center justify-content-center fs-1">🛏️</div>
      )}
      <div className="card-body">
        <h5 className="card-title">Room {room.roomNumber} · {room.type}</h5>
        <p className="mb-1 small">Capacity: {room.capacity} {room.capacity > 1 ? "People" : "Person"}</p>
        <p className="mb-1 small">Rent: ₹{room.rent} per day</p>
        <p className="mb-3 small text-muted">{room.description}</p>
        {action}
      </div>
    </div>
  );
}
