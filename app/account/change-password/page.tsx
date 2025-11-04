"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { postRequest } from "@/app/utils/api";
import { useAuthStore } from "@/app/store/useAuthStore";
export default function ChangePasswordForm() {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const user = useAuthStore((s) => s.user);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  // show loading skeleton / message while user is not available
  if (!user) {
    return (
      <div className="h-full flex items-center justify-center w-full py-20">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full" />
        <span className="ml-4 text-gray-600">Loading user…</span>
      </div>
    );
  }
  const toggleVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("Please fill all the fields.");
      return;
    }

    if (!user) {
      setError("User not found. Please login and try again.");
      return;
    }

    // derive user_id and sess_id from user object (try common keys)
    const user_id =
      (user as any).user_id ?? (user as any).id ?? (user as any).userId;
    const sess_id =
      (user as any).sess_id ?? (user as any).sessId ?? (user as any).session_id;

    if (!user_id || !sess_id) {
      setError("Session not available. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        user_id: String(user_id),
        sess_id: String(sess_id),
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      };

      // use your helper (withToken true optional; depends on your backend/auth)
      const res = await postRequest("/account/update-forgot-password", payload);

      // if backend returns success flag
      if (res?.success) {
        setSuccess(res.message || "Password changed successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        // backend returned 200 but success: false
        setError(res?.message || "Failed to change password.");
      }
    } catch (err: any) {
      // request helper throws on non-OK responses with message from API when available
      setError(err?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center w-full px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[540px] mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-200"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Change Password</h2>

        {error && <p className="mb-4 text-red-600">{error}</p>}
        {success && <p className="mb-4 text-green-600">{success}</p>}

        {/* Current Password */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">Current Password</label>
          <div className="relative">
            <input
              type={showPassword.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => toggleVisibility("current")}
            >
              {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">New Password</label>
          <div className="relative">
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => toggleVisibility("new")}
            >
              {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-1 text-sm sm:text-base">
            Re-Enter New Password
          </label>
          <div className="relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => toggleVisibility("confirm")}
            >
              {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[16px] sm:text-[18px] font-medium py-2 sm:py-3 rounded-md hover:opacity-90 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
