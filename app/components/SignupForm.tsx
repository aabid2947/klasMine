// "use client";
import React, { useState } from "react";
import pkg from "../../package.json"; // ✅ import version
import { postRequest } from "../utils/api";
import { useRouter } from "next/navigation"; // ✅ Next.js router
import { notify } from "./NotificationManager";

interface SignupFormProps {
  onSwitch: () => void; // Switch between Login and Signup
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitch }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword,setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.type === "email"
        ? "email"
        : e.target.type === "password" &&
          e.target.placeholder.includes("Confirm")
        ? "confirm_password"
        : e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        device: "android",
        app_version: pkg.version, // ✅ from package.json
        latitude: "00",
        longitude: "00",
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
      };

      const res = await postRequest("/account/register", payload);
      notify("Successfully registered! Please log in.", "success");
      // ✅ show notification

      // ✅ hide notification after 2s and redirect
      onSwitch();
    } catch (err: any) {
      console.error("Registration Failed:", err.message);
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center bg-white px-4">
      <div className="rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Sign Up
        </h2>

        

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              value={formData.email}
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                name="password"
                className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 cursor-pointer text-gray-400">
                👁️
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                value={formData.confirm_password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                name="confirm_password"
                placeholder="Confirm your password"
                className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 cursor-pointer text-gray-400">
                👁️
              </span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg text-lg font-semibold"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Already Have An Account?{" "}
          <button
            type="button"
            onClick={onSwitch} // Switch between Login and Sign Up
            className="text-black font-medium hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
      {/* ✅ Tailwind Notification */}
      {showNotification && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Successfully registered! Please log in.
        </div>
      )}
    </div>
  );
};

export default SignupForm;
