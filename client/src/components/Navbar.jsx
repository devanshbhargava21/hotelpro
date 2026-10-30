import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser, logout } from "../api.js";

export default function Navbar() {
  const navigate = useNavigate();
  useLocation(); // re-render on route change so login/logout state stays fresh
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand gradient-nav px-3 py-2 sticky-top">
      <Link className="navbar-brand fs-4 fw-semibold" to="/">HotelPro</Link>
      <ul className="navbar-nav ms-auto align-items-center">
        {!user && (
          <>
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/signup">SignUp</Link></li>
          </>
        )}
        {user && (
          <>
            <li className="nav-item"><span className="nav-link">Hi, {user.name}</span></li>
            {user.type === "ordinary" && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/user">Rooms</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/user/bookings">My Bookings</Link></li>
              </>
            )}
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
