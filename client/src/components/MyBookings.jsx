import { useEffect, useState } from "react";
import api, { errMsg } from "../api.js";
import BookingCards from "./BookingCards.jsx";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    api.get("/bookings/mine").then((r) => setBookings(r.data)).catch((e) => setError(errMsg(e)));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.post(`/bookings/${id}/cancel`);
      load();
    } catch (e) {
      alert(errMsg(e));
    }
  };

  return (
    <div className="container py-3">
      {error && <div className="alert alert-danger">{error}</div>}
      <BookingCards bookings={bookings} onCancel={cancel} />
    </div>
  );
}
