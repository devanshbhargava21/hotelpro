import { fmtDate } from "../api.js";

// Shared by "My Bookings" (user) and "All Bookings" (admin)
export default function BookingCards({ bookings, onCancel, showUser, title = "My Bookings" }) {
  return (
    <div>
      <h3 className="text-center my-4">{title}</h3>
      <div className="row g-3">
        {bookings.map((b) => (
          <div className="col-md-6" key={b._id}>
            <div className="card p-3 h-100">
              <h5>
                {b.type} Room {b.roomNumber}{" "}
                <span className={`badge ${b.status === "cancelled" ? "bg-danger" : "bg-success"} fs-6`}>
                  {b.status.toUpperCase()}
                </span>
              </h5>
              <div className="small"><b>Booking ID:</b> <span className="mono">{b._id}</span></div>
              {showUser && <div className="small"><b>Guest:</b> {b.username}</div>}
              <div className="small"><b>From:</b> {fmtDate(b.fromdate)} &nbsp;|&nbsp; <b>To:</b> {fmtDate(b.todate)}</div>
              <div className="small"><b>Total Amount:</b> ₹{b.totalAmount} ({b.totaldays} night{b.totaldays > 1 ? "s" : ""})</div>
              <div className="small"><b>Customer Phone:</b> {b.phone}</div>
              <div className="small"><b>Paid with card:</b> •••• {b.cardDetails?.last4}</div>
              {b.status !== "cancelled" && (
                <button className="btn btn-outline-danger btn-sm w-100 mt-3" onClick={() => onCancel(b._id)}>
                  CANCEL BOOKING
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {bookings.length === 0 && <p className="text-center text-muted">No bookings yet.</p>}
      <p className="text-center fw-bold mt-4">Total Bookings: {bookings.length}</p>
    </div>
  );
}
