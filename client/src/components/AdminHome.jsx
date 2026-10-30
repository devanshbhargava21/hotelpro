import { useEffect, useState } from "react";
import api, { errMsg } from "../api.js";
import BookingCards from "./BookingCards.jsx";

const TABS = ["All Bookings", "All Rooms", "Add Room", "All Users"];
const emptyRoom = { roomNumber: "", capacity: "", rent: "", p1: "", p2: "", p3: "", type: "", description: "" };

export default function AdminHome() {
  const [tab, setTab] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyRoom);
  const [error, setError] = useState("");

  const load = () => {
    api.get("/bookings").then((r) => setBookings(r.data)).catch((e) => setError(errMsg(e)));
    api.get("/rooms").then((r) => setRooms(r.data)).catch((e) => setError(errMsg(e)));
    api.get("/users").then((r) => setUsers(r.data)).catch((e) => setError(errMsg(e)));
  };
  useEffect(load, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try { await api.post(`/bookings/${id}/cancel`); load(); } catch (e) { alert(errMsg(e)); }
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addRoom = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.type) return setError("Please select a room type");
    try {
      await api.post("/rooms", {
        roomNumber: form.roomNumber,
        capacity: Number(form.capacity),
        rent: Number(form.rent),
        type: form.type,
        description: form.description,
        photos: [form.p1, form.p2, form.p3],
      });
      alert("Room added successfully");
      setForm(emptyRoom);
      load();
      setTab(1);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="container py-3" style={{ maxWidth: 1100 }}>
      <ul className="nav nav-tabs mb-3">
        {TABS.map((t, i) => (
          <li className="nav-item" key={t}>
            <button className={`nav-link text-uppercase small ${tab === i ? "active fw-semibold" : ""}`} onClick={() => { setTab(i); setError(""); }}>{t}</button>
          </li>
        ))}
      </ul>
      {error && <div className="alert alert-danger">{error}</div>}

      {tab === 0 && <BookingCards bookings={bookings} onCancel={cancel} showUser title="All Bookings" />}

      {tab === 1 && (
        <div className="card overflow-hidden">
          <div className="table-head-blue text-center py-3"><h4 className="mb-0">Hotel Room Booking History</h4><small>Total Rooms: {rooms.length}</small></div>
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead><tr><th>Room ID</th><th>Room Number</th><th>Capacity</th><th>Rent / Day</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r._id}>
                    <td className="mono">{r._id}</td><td>{r.roomNumber}</td><td>{r.capacity}</td><td>₹ {r.rent}</td>
                    <td><span className={`badge ${r.type === "Delux" ? "bg-success" : "bg-secondary"}`}>{r.type}</span></td>
                    <td>{r.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="card overflow-hidden mx-auto" style={{ maxWidth: 800 }}>
          <div className="table-head-blue text-center py-3"><h4 className="mb-0">Add a New Room</h4></div>
          <form className="p-4" onSubmit={addRoom}>
            <div className="row g-3 mb-3">
              <div className="col-md-4"><label className="form-label small">Room Number</label><input className="form-control" name="roomNumber" placeholder="Room Number" value={form.roomNumber} onChange={onChange} required /></div>
              <div className="col-md-4"><label className="form-label small">Max. Capacity</label><input className="form-control" type="number" min="1" name="capacity" placeholder="No. of people" value={form.capacity} onChange={onChange} required /></div>
              <div className="col-md-4"><label className="form-label small">Room Rent</label><input className="form-control" type="number" min="1" name="rent" placeholder="Rent per day" value={form.rent} onChange={onChange} required /></div>
            </div>
            <label className="form-label small">Room Photos</label>
            {["p1", "p2", "p3"].map((k, i) => (
              <input key={k} className="form-control mb-2" name={k} placeholder={`Image ${i + 1} URL`} value={form[k]} onChange={onChange} />
            ))}
            <div className="my-3">
              <label className="form-label small d-block">Room Type</label>
              {["Delux", "Non-Delux"].map((t) => (
                <div className="form-check form-check-inline" key={t}>
                  <input className="form-check-input" type="radio" name="type" id={t} value={t} checked={form.type === t} onChange={onChange} />
                  <label className="form-check-label" htmlFor={t}>{t}</label>
                </div>
              ))}
            </div>
            <label className="form-label small">Room Description</label>
            <textarea className="form-control mb-3" rows="4" name="description" value={form.description} onChange={onChange} />
            <div className="text-center"><button className="btn btn-primary px-4">ADD ROOM</button></div>
          </form>
        </div>
      )}

      {tab === 3 && (
        <div className="card overflow-hidden">
          <div className="table-head-dark text-center py-3"><h4 className="mb-0">All Registered Users</h4><small>Total Users: {users.length}</small></div>
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead><tr><th>User ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Type</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="mono">{u._id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.phone}</td>
                    <td><span className={`badge ${u.type === "admin" ? "bg-success" : "bg-primary"}`}>{u.type === "admin" ? "Admin" : "Ordinary"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
