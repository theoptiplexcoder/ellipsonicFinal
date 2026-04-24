"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    "firstName": "",
    "middleName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "password": "",
    "isAdmin": false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (e) => {
    const value = e.target.value === "true";
    setFormData({
      ...formData,
      isAdmin: value,
    });
    console.log(JSON.stringify(formData))
  };

 

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const res = await fetch("http://localhost:3000/api/v1/auth-user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // ✅ Read raw text first before attempting to parse
    const rawText = await res.text();
    console.log("Raw response:", rawText); // <-- check your browser console

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error(`Server returned non-JSON response: ${rawText.slice(0, 200)}`);
    }

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    localStorage.setItem("token", data.token);
    setSuccess("Registration successful!");

    setTimeout(() => {
      router.push("/sign-in");
    }, 1500);

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
        <h2 className="text-2xl font-medium mb-6">Sign up</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">First name</label>
              <input type="text" name="firstName" placeholder="Jane"
                value={formData.firstName} onChange={handleChange} required
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Last name</label>
              <input type="text" name="lastName" placeholder="Smith"
                value={formData.lastName} onChange={handleChange} required
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Middle name <span className="text-gray-400">(optional)</span>
            </label>
            <input type="text" name="middleName" placeholder="Optional"
              value={formData.middleName} onChange={handleChange}
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input type="email" name="email" placeholder="jane@example.com"
              value={formData.email} onChange={handleChange} required
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Phone</label>
            <input type="tel" name="phone" placeholder="1234567890"
              value={formData.phone} onChange={handleChange} required
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Password</label>
            <input type="password" name="password" placeholder="8+ characters"
              value={formData.password} onChange={handleChange} required
              className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>

          {/* ✅ Fixed: labeled, spaced radio buttons */}
          <div>
            <label className="block text-xs text-gray-500 mb-2">Role</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="isAdmin"
                  value="false"
                  checked={formData.isAdmin === false}
                  onChange={handleRoleChange}
                />
                User
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="isAdmin"
                  value="true"
                  checked={formData.isAdmin === true}
                  onChange={handleRoleChange}
                />
                Admin
              </label>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors mt-2">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <span onClick={() => router.push("/sign-in")}
            className="text-gray-900 font-medium underline underline-offset-2 cursor-pointer">
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}