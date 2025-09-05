// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    regNo: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    const mobilePattern = /^[6-9]\d{9}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mobilePattern.test(form.mobile)) {
      setError("Invalid Mobile Number");
      return false;
    }

    if (!emailPattern.test(form.email)) {
      setError("Invalid Email Address");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  // ✅ Correct handleSubmit (sends data to backend)
 const handleSubmit = async (e) => {
  e.preventDefault();
  if (validate()) {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message); // ❌ Shows whitelist rejection too
      } else {
        alert(data.message);
        navigate("/"); // Go to login after successful registration
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        {/* College Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="https://rgicdn.s3.ap-south-1.amazonaws.com/ghrcempune/images/new-theme/logo.png"
            alt="Raisoni Logo"
            className="h-16"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-600">RaisoniConnect Registration</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

       <input 
  type="text" 
  name="firstName" 
  placeholder="First Name" 
  required 
  value={form.firstName}
  onChange={handleChange} 
  className="w-full border px-3 py-2 rounded" 
/>
<input 
  type="text" 
  name="lastName" 
  placeholder="Last Name" 
  required 
  value={form.lastName}
  onChange={handleChange} 
  className="w-full border px-3 py-2 rounded" 
/>
<input 
  type="text" 
  name="mobile" 
  placeholder="Mobile No" 
  required 
  value={form.mobile}
  onChange={handleChange} 
  className="w-full border px-3 py-2 rounded" 
/>
<input 
  type="email" 
  name="email" 
  placeholder="Email ID" 
  required 
  value={form.email}
  onChange={handleChange} 
  className="w-full border px-3 py-2 rounded" 
/>
<input 
  type="text" 
  name="regNo" 
  placeholder="Registration No" 
  required 
  value={form.regNo}
  onChange={handleChange} 
  className="w-full border px-3 py-2 rounded" 
/>

<input 
  type="password" 
  name="password" 
  placeholder="Set Password" 
  required 
  value={form.password}
  onChange={handleChange} 
  className="w-full border px-3 py-2 rounded" 
/>
<input 
  type="password" 
  name="confirmPassword" 
  placeholder="Confirm Password" 
  required 
  value={form.confirmPassword}
  onChange={handleChange} 
  className="w-full border px-3 py-2 rounded" 
/>


        {/* Verification (just placeholder field here)
        <input type="text" placeholder="Verify Registration No" required className="w-full border px-3 py-2 rounded" /> */}


        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Register
        </button>

        <p className="text-center text-sm">
          Already have an account? <a href="/" className="text-blue-600 font-medium">Login</a>
        </p>
      </form>
    </div>
  );
}
