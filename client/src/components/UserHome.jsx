import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errMsg } from "../api.js";
import RoomCard from "./RoomCard.jsx";
import BookingModal from "./BookingModal.jsx";

const iso = (d) => d.toISOString().slice(0, 10);
const today = iso(new Date());

export default function UserHome() {
  const [rooms, setRooms] = useState([]);
  const [fromdate, setFrom] = useState("");
  const [todate, setTo] = useState("");
  const [checked, setChecked] = useState(false); // true once availability was checked for current dates
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const nights = fromdate && todate ? Math.round((new Date(todate) - new Date(fromdate)) / 86400000) : 0;

  const loadAll = () => {
    setLoading(true);
    api.get("/rooms").then((r) => setRooms(r.data)).catch((e) => setError(errMsg(e))).finally(() => setLoading(false));
  };
  useEffect(loadAll, []);

  const checkAvailability = async (e) => {
    e.preventDefault();
    setError("");
    if (nights <= 0) return setError("Check-out date must be after check-in date");
    setLoading(true);
    try {
      const { data } = await api.get("/rooms/available", { params: { from: fromdate, to: todate } });
      setRooms(data);
      setChecked(true);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const resetCheck = () => { setChecked(false); };

  return (
    <div className="container py-4">
      <form className="card p-3 mb-4" onSubmit={checkAvailability}>
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label small fw-semibold">Arrival date</label>
            <input type="date" className="form-control" min={today} value={fromdate} onChange={(e) => { setFrom(e.target.value); resetCheck(); }} required />
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold">Departure date</label>
            <input type="date" className="form-control" min={fromdate || today} value={todate} onChange={(e) => { setTo(e.target.value); resetCheck(); }} required />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button className="btn btn-primary flex-fill">Check Availability</button>
            {checked && <button type="button" className="btn btn-outline-secondary" onClick={() => { setFrom(""); setTo(""); setChecked(false); loadAll(); }}>Reset</button>}
          </div>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}
      {!checked && <p className="text-muted small">Select arrival and departure dates, then click Check Availability to book a room.</p>}
      {checked && <p className="small fw-semibold">{rooms.length} room(s) available for {nights} night(s).</p>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="row g-4">
          {rooms.map((r) => (
            <div className="col-md-4 col-lg-3" key={r._id}>
              <RoomCard
                room={r}
                action={
                  <button className="btn btn-primary btn-sm" disabled={!checked} onClick={() => setSelected(r)}>
                    {checked ? "BOOK NOW" : "PICK DATES"}
                  </button>
                }
              />
            </div>
          ))}
          {rooms.length === 0 && <p className="text-center text-muted">No rooms available.</p>}
        </div>
      )}

      {selected && (
        <BookingModal
          room={selected}
          fromdate={fromdate}
          todate={todate}
          nights={nights}
          onClose={() => setSelected(null)}
          onSuccess={() => {
            setSelected(null);
            alert("Booking confirmed! Payment successful.");
            navigate("/user/bookings");
          }}
        />
      )}
    </div>
  );
}
