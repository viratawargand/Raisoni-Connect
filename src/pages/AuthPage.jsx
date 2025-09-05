import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ regNo: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || data.message || "Login failed");
      } else {
        // ✅ Store token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        console.log("✅ Login successful - Token stored");
        alert(data.message);
        navigate("/home"); // redirect to HomePage after login
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4"
      >
        {/* College Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="https://rgicdn.s3.ap-south-1.amazonaws.com/ghrcempune/images/new-theme/logo.png"
            alt="Raisoni Logo"
            className="h-16"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-600">Raisoni Connect Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="text"
          name="regNo"
          placeholder="Registration No"
          required
          onChange={handleChange}
          value={form.regNo}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          value={form.password}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}