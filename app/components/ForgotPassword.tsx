// pages/forgot-password.tsx
"use client";

import React from "react";
import Link from "next/link";

interface ForgotPasswordProps {
  onBack: () => void;  // Define onBack here
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  return (
    <div className="flex items-center justify-center bg-white px-4">
      <div className="rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Forgot Password</h2>

        <div className="text-center text-gray-500 mb-4">Or</div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Enter your registered email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg text-lg font-semibold"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Remember your password?{" "}
          <Link href="/login" className="text-black font-medium hover:underline">
            Log In
          </Link>
        </p>

        {/* Optional back button */}
        <div className="text-center mt-4">
          <button 
            type="button"
            onClick={onBack}
            className="text-black font-medium hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
