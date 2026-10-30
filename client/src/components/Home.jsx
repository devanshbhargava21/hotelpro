import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import RoomCard from "./RoomCard.jsx";

const slides = [
  { cls: "hero-1", title: "Luxury stays, simple booking", text: "Pick your dates, choose a room, pay securely." },
  { cls: "hero-2", title: "Real-time availability", text: "Only rooms free for your dates are shown." },
  { cls: "hero-3", title: "Manage bookings anytime", text: "View history and cancel in one click." },
];

export default function Home() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get("/rooms").then((r) => setRooms(r.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div>
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {slides.map((s, i) => (
            <div key={s.title} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              <div className={`hero-slide ${s.cls}`}>
                <div>
                  <h1 className="display-5 fw-bold">{s.title}</h1>
                  <p className="lead">{s.text}</p>
                  <Link to="/login" className="btn btn-light me-2">Login</Link>
                  <Link to="/signup" className="btn btn-outline-light">Sign Up</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev"><span className="carousel-control-prev-icon" /></button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next"><span className="carousel-control-next-icon" /></button>
      </div>

      <section className="container py-5">
        <h3 className="text-center mb-3">About HotelPro</h3>
        <p className="text-center text-muted mx-auto" style={{ maxWidth: 760 }}>
          HotelPro is a secure and scalable hotel management system for booking, guest management and payment
          processing. Guests can browse rooms, book and cancel stays, while admins manage rooms, bookings and users.
        </p>
      </section>

      {rooms.length > 0 && (
        <section className="container pb-5">
          <h3 className="text-center mb-4">Our Rooms</h3>
          <div className="row g-4">
            {rooms.map((r) => <div className="col-md-4" key={r._id}><RoomCard room={r} /></div>)}
          </div>
        </section>
      )}

      <footer className="text-center py-3 text-muted small border-top bg-white">© 2026 HotelPro. All rights reserved.</footer>
    </div>
  );
}
