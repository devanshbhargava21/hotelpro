import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errMsg } from "../api.js";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "", c_password: "", phone: "", type: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.type) return setError("Please select user type");
    if (form.password !== form.c_password) return setError("Password and Confirm Password must match");
    if (!/^\d{10}$/.test(form.phone)) return setError("Mobile number must be 10 digits");
    setLoading(true);
    try {
      await api.post("/auth/signup", form);
      alert("Account created successfully");
      navigate("/login");
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
          <div className="auth-art"><div className="big">🛎️</div><h3>Join HotelPro</h3><p>Create an account to start booking.</p></div>
        </div>
        <div className="col-md-5 offset-md-1">
          <h5 className="fw-bold mb-3">Register for the Account</h5>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <form onSubmit={onSubmit}>
            <input className="form-control mb-3" name="name" placeholder="Full Name" value={form.name} onChange={onChange} required />
            <input className="form-control mb-3" type="email" name="email" placeholder="Email Address" value={form.email} onChange={onChange} required />
            <input className="form-control mb-3" type="password" name="password" placeholder="Password (min 6 chars)" value={form.password} onChange={onChange} required />
            <input className="form-control mb-3" type="password" name="c_password" placeholder="Confirm Password" value={form.c_password} onChange={onChange} required />
            <input className="form-control mb-3" name="phone" placeholder="Enter Mobile no." value={form.phone} onChange={onChange} maxLength={10} required />
            <select className="form-select mb-3 w-auto" name="type" value={form.type} onChange={onChange} required>
              <option value="">Select User</option>
              <option value="ordinary">Ordinary</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn btn-primary px-4" disabled={loading}>{loading ? "Please wait..." : "REGISTER"}</button>
          </form>
          <p className="mt-3 fw-bold small">Had an account? <Link className="text-danger" to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
