import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errMsg } from "../api.js";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(data.user.type === "admin" ? "/admin" : "/user");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row align-items-center g-4">
        <div className="col-md-6">
          <div className="auth-art"><div className="big">🏨</div><h3>Welcome back to HotelPro</h3><p>Book rooms in seconds.</p></div>
        </div>
        <div className="col-md-5 offset-md-1">
          <h5 className="fw-bold mb-3">Login for the Account</h5>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={onSubmit}>
            <input className="form-control mb-3" type="email" name="email" placeholder="Email address" value={form.email} onChange={onChange} required />
            <input className="form-control mb-3" type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
            <button className="btn btn-primary px-4" disabled={loading}>{loading ? "Please wait..." : "LOGIN"}</button>
          </form>
          <p className="mt-3 fw-bold small">Don't have an account? <Link className="text-danger" to="/signup">Register</Link></p>
        </div>
      </div>
    </div>
  );
}
