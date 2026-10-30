import { useState } from "react";
import api, { errMsg, fmtDate } from "../api.js";

// Payment popup shown when the user clicks "Book Now"
export default function BookingModal({ room, fromdate, todate, nights, onClose, onSuccess }) {
  const [card, setCard] = useState({ cardholdername: "", cardnumber: "", expmonthyear: "", cvvcode: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const total = nights * room.rent;

  const set = (k) => (e) => {
    let v = e.target.value;
    if (k === "cardnumber") v = v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (k === "cvvcode") v = v.replace(/\D/g, "").slice(0, 4);
    if (k === "expmonthyear") {
      v = v.replace(/[^\d]/g, "").slice(0, 4);
      if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    setCard({ ...card, [k]: v });
  };

  const pay = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/bookings", { roomid: room._id, fromdate, todate, cardDetails: card });
      onSuccess();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm & Pay — Room {room.roomNumber}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={pay}>
            <div className="modal-body">
              <div className="bg-light rounded p-3 mb-3 small">
                <div><b>From:</b> {fmtDate(fromdate)} &nbsp;|&nbsp; <b>To:</b> {fmtDate(todate)}</div>
                <div><b>Nights:</b> {nights} × ₹{room.rent}</div>
                <div className="fs-6 mt-1"><b>Total Amount: ₹{total}</b></div>
              </div>
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <input className="form-control mb-2" placeholder="Card holder name" value={card.cardholdername} onChange={set("cardholdername")} required />
              <input className="form-control mb-2" placeholder="Card number (16 digits)" value={card.cardnumber} onChange={set("cardnumber")} inputMode="numeric" required />
              <div className="row g-2">
                <div className="col"><input className="form-control" placeholder="MM/YY" value={card.expmonthyear} onChange={set("expmonthyear")} required /></div>
                <div className="col"><input className="form-control" type="password" placeholder="CVV" value={card.cvvcode} onChange={set("cvvcode")} required /></div>
              </div>
              <div className="form-text mt-2">Demo payment: use any 16-digit number, e.g. 4242 4242 4242 4242, and a future expiry.</div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" disabled={loading}>{loading ? "Processing..." : `Pay ₹${total}`}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
