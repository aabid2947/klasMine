"use client";
import React, { useState } from "react";
import pkg from "../../package.json"; // ✅ for version
import { postRequest } from "../utils/api";

interface OtpModalProps {
  email: string;
  onClose: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ email, onClose }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        device: "android",
        app_version: pkg.version,
        latitude: "00",
        longitude: "00",
        email: email, // ✅ comes from signup
        otp: otp,
      };

      const res = await postRequest("/account/verify-otp", payload);
      console.log("OTP Verified:", res);

      alert("OTP Verified Successfully 🎉");
      onClose(); // close modal on success
    } catch (err: any) {
      console.error("OTP Verification Failed:", err.message);
      alert(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4 text-center">Verify OTP</h3>
        <p className="text-sm text-gray-600 mb-4 text-center">
          We have sent an OTP to <strong>{email}</strong>
        </p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        />
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
