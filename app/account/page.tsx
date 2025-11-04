"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { useAuthStore } from "../store/useAuthStore";
import { postRequest, uploadProfileImage } from "../utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function MyProfile() {
  const user = useAuthStore((state) => state.user);
  // form states
  const [nameInput, setNameInput] = useState(user?.name ?? "");
  const [emailInput, setEmailInput] = useState(user?.email ?? "");
  const [phoneInput, setPhoneInput] = useState(user?.phone ?? "");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressLine, setAddressLine] = useState(
    user?.address?.address_line_1 ?? ""
  );
  const [city, setCity] = useState(user?.address?.city ?? "");
  const [zip, setZip] = useState(user?.address?.zip ?? "");
  const [stateCode, setStateCode] = useState(user?.address?.state_code ?? "");
  const setAuth = useAuthStore((state) => state.setAuth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(
    "/assets/images/service/van-gogh.jpg"
  );
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  
  // OTP verification states
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  if (!user) {
    // Redirect to home page if user is not logged in
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-lg text-gray-600">Redirecting...</span>
      </div>
    );
  }

  // ✅ handle address update
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Validate all address fields are filled
    if (!addressLine.trim() || !city.trim() || !zip.trim() || !stateCode.trim()) {
      toast.error("All address fields are required.");
      return;
    }
    
    try {
      setLoading(true);
      const updated = await postRequest("/account/update-address", {
        user_id: user.user_id,
        sess_id: user.sess_id,
        address_line_1: addressLine,
        city,
        zip,
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        state_code: stateCode,
      });

      // Check if redirect is true - session expired
      if (updated?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }

      if (updated?.error) {
        toast.error(updated.message || "Failed to update address");
        return;
      }

      // Update state after success
      setAuth({
        ...user,
        address: {
          ...user.address,
          address_line_1: addressLine,
          city,
          zip,
          state_code: stateCode,
        },
      });

      toast.success("Address updated successfully!");
      setIsAddressModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected || !user) return;

    setFile(selected);

    // show preview while uploading
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result as string);
    };
    reader.readAsDataURL(selected);

    try {
      setLoading(true);

      // Step 1: upload image
      const res = await uploadProfileImage(selected, user);
      
      // Check if redirect is true - session expired
      if (res?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }
      
      if (res?.error) {
        toast.error(res.message || "Failed to upload image");
        return;
      }
      
      const fileUrl = res?.data?.file_obj?.file_url;

      if (!fileUrl) {
        toast.error("Failed to upload image - no URL returned");
        return;
      }

      // Step 2: update profile immediately with new image
      const profileUpdate = await postRequest("/account/update-profile", {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        sess_id: user.sess_id,
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: fileUrl, // ✅ use uploaded file URL
      });
      
      // Check if redirect is true - session expired
      if (profileUpdate?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }
      
      if (profileUpdate?.error) {
        toast.error(profileUpdate.message || "Failed to update profile with new image");
        return;
      }
      
      // Step 3: update state
      setAuth({
        ...user,
        image: fileUrl,
      });
      setProfilePic(fileUrl);
      toast.success("Profile picture updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Image update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    // Validate all fields are filled
    if (!nameInput.trim() || !emailInput.trim() || !phoneInput.trim()) {
      toast.error("All fields are required.");
      return;
    }
    
    // Validate phone number is 10 digits
    if (phoneInput.trim().length !== 10 || !/^\d+$/.test(phoneInput.trim())) {
      toast.error("Please enter a 10 digit phone number.");
      return;
    }
    
    try {
      setLoading(true);
      // Step 2: Update profile
      const updated = await postRequest("/account/update-profile", {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        sess_id: user.sess_id,
        user_id: user.user_id,
        name: nameInput,
        email: emailInput,
        phone: phoneInput,
      });
      
      // Check if redirect is true - session expired
      if (updated?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }
      
      if (updated?.error) {
        toast.error(updated.message || "Something went wrong");
        return;
      }
      // Step 3: Sync state
      setAuth({
        ...user,
        name: nameInput,
        email: emailInput,
        phone: phoneInput,
      });
      toast.success("Profile updated successfully!");
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle Send OTP for email verification
  const handleSendOtp = async () => {
    if (!user?.email) {
      toast.error("No email found to verify");
      return;
    }

    setIsOtpSending(true);
    try {
      const response = await postRequest("/account/send-otp", {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        email: user.email,
      });

      // Check if redirect is true - session expired
      if (response?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }

      if (response?.success) {
        toast.success("OTP sent to your email successfully!");
        setIsOtpModalOpen(true);
      } else {
        toast.error(response?.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsOtpSending(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !otpInput.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    setIsOtpVerifying(true);
    try {
      const response = await postRequest("/account/verify-otp", {
        device: "android",
        app_version: "1.0.5",
        latitude: "28.6139",
        longitude: "77.2090",
        email: user.email,
        otp: otpInput.trim(),
      });

      // Check if redirect is true - session expired
      if (response?.redirect === true) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }

      if (response?.success) {
        toast.success("Email verified successfully!");
        
        // Update user state to mark email as verified
        setAuth({
          ...user,
          is_email_verified: "1",
        });
        
        // Close modal and reset OTP input
        setIsOtpModalOpen(false);
        setOtpInput("");
      } else {
        toast.error(response?.message || "Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast.error(error.message || "Failed to verify OTP");
    } finally {
      setIsOtpVerifying(false);
    }
  };

  // ✅ Show loading if user not loaded yet
  return (
    <div className="bg-white min-h-screen py-6 sm:py-8 md:py-12 space-y-4 sm:space-y-6">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h1 className="font-medium text-[#333333] text-[28px] sm:text-[36px] md:text-[44px]">My Profile</h1>
      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-[#E6E6E6] p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="cursor-pointer relative group flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image
              src={user?.image ? user?.image : profilePic}
              alt="Profile"
              width={80}
              height={80}
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-[120px] md:h-[120px] rounded-full object-cover"
            />
            <div className="absolute inset-0 rounded-full bg-[rgba(0,0,0,0.48)] bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs">
              Change
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div>
            <p className="text-base sm:text-lg md:text-[24px] text-[#333333] font-semibold">
              {" "}
              <span>{user.name}</span>
            </p>
            <p className="flex mb-2 mt-2 text-[rgba(51,51,51,0.5)] font-semibold text-[14px] sm:text-[16px] font-['Open_Sans']">
              <span className="mr-3 w-[20px] flex justify-center">
                <img src="/assets/images/icon/mail.svg" alt="mail" />
              </span>
              {user.email}
            </p>
            <p className="flex text-[rgba(51,51,51,0.5)] font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] break-all">
              <span className="mr-3 w-[20px] flex justify-center">
                <img src="/assets/images/icon/map.svg" alt="mail" />
              </span>
              {user.address?.address_line_1 || "N/A"},{" "}
              {user.address?.city || "N/A"} - {user.address?.zip || "N/A"},{" "}
              {user.address?.state_code || "N/A"}{" "}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          {user?.is_email_verified === "0" && ( // ✅ Conditionally render Verify Email button
            <button
              onClick={handleSendOtp}
              disabled={isOtpSending}
              className="text-white font-semibold text-[16px] font-['Open_Sans'] bg-blue-600 hover:bg-blue-700 cursor-pointer p-[16px] px-[20px] rounded-md flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img
                className="mr-2"
                src="/assets/images/icon/mail.svg"
                alt="Verify"
              />
              {isOtpSending ? "Sending OTP..." : "Verify Email"}
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[rgba(51,51,51,0.5)] font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] bg-[#F1F2F4] hover:bg-[#dedede] cursor-pointer p-[12px] sm:p-[16px] px-[16px] sm:px-[20px] rounded-md flex items-center gap-1 flex-1 sm:flex-initial justify-center"
          >
            <img
              className="mr-2 sm:mr-3 w-4 h-4"
              src="/assets/images/icon/edit.svg"
              alt="Edit"
            />
            Edit
          </button>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-xl border border-[#E6E6E6] p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h2 className="text-[#333333] font-semibold text-[24px] sm:text-[28px] md:text-[32px]">
            Personal Information
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[rgba(51,51,51,0.5)] font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] bg-[#F1F2F4] hover:bg-[#dedede] cursor-pointer p-[12px] sm:p-[16px] px-[16px] sm:px-[20px] rounded-md flex items-center gap-1 w-full sm:w-auto justify-center"
          >
            <img
              className="mr-2 sm:mr-3 w-4 h-4"
              src="/assets/images/icon/edit.svg"
              alt="Edit"
            />
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-full md:max-w-[720px]">
          <div>
            <p className="text-[rgba(51,51,51,0.5)] font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] mb-2">
              First Name
            </p>
            <p className="font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] text-[#333333]">
              {user.name}
            </p>
          </div>
          <div>
            <p className="text-[rgba(51,51,51,0.5)] font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] mb-2">
              Last name
            </p>
            <p className="font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] text-[#333333]"></p>
          </div>
          <div>
            <p className="text-[rgba(51,51,51,0.5)] font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] mb-2">
              Email Address
            </p>
            <p className="font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] text-[#333333] break-all">
              {user.email}
            </p>
          </div>
          <div>
            <p className="text-[rgba(51,51,51,0.5)] font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] mb-2">
              Phone Number
            </p>
            <p className="font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] text-[#333333]">
              {user.phone ?? ""}
            </p>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white rounded-xl border border-[#E6E6E6] p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h2 className="text-[#333333] font-semibold text-[24px] sm:text-[28px] md:text-[32px]">Address</h2>
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="text-[rgba(51,51,51,0.5)] font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] bg-[#F1F2F4] hover:bg-[#dedede] cursor-pointer p-[12px] sm:p-[16px] px-[16px] sm:px-[20px] rounded-md flex items-center gap-1 w-full sm:w-auto justify-center"
          >
            <img
              className="mr-2 sm:mr-3 w-4 h-4"
              src="/assets/images/icon/edit.svg"
              alt="Edit"
            />
            Edit
          </button>
        </div>
        <div className="mt-3">
          <p className="text-[rgba(51,51,51,0.5)] font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] mb-2">
            Locality
          </p>
          <p className="font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] text-[#333333]">
            {" "}
            {user.address?.address_line_1}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-full md:max-w-[720px]">
          <div>
            <p className="text-[rgba(51,51,51,0.5)] font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] mb-2">
              City/State
            </p>
            <p className="font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] text-[#333333]">
              {user.address?.city}
            </p>
          </div>
          <div>
            <p className="text-[rgba(51,51,51,0.5)] font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] mb-2">
              Country
            </p>
            <p className="font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] text-[#333333]">
              India
              {user.address?.country ?? ""}
            </p>
          </div>
          <div>
            <p className="text-[rgba(51,51,51,0.5)] font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] mb-2">
              Pincode
            </p>
            <p className="font-semibold text-[14px] sm:text-[16px] font-['Open_Sans'] text-[#333333]">
              {user.address?.zip}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Edit Profile
            </Dialog.Title>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="First Name"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Email"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Phone Number"
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={
                    !nameInput.trim() ||
                    !emailInput.trim() ||
                    !phoneInput.trim() ||
                    loading
                  }
                  style={{
                    opacity:
                      !nameInput.trim() ||
                      !emailInput.trim() ||
                      !phoneInput.trim() ||
                      loading
                        ? 0.6
                        : 1,
                    cursor:
                      !nameInput.trim() ||
                      !emailInput.trim() ||
                      !phoneInput.trim() ||
                      loading
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            </form>
            {/* Toast Container intentionally left empty - it's added at the page level */}
          </Dialog.Panel>
        </div>
      </Dialog>
      {/* Address Edit Modal */}
      <Dialog
        open={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Edit Address
            </Dialog.Title>
            <form className="space-y-4" onSubmit={handleAddressSubmit}>
              <input
                type="text"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="Address Line 1"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="Zip Code"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                placeholder="State Code"
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !addressLine.trim() || !city.trim() || !zip.trim() || !stateCode.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  style={{
                    opacity: loading || !addressLine.trim() || !city.trim() || !zip.trim() || !stateCode.trim() ? 0.6 : 1,
                    cursor: loading || !addressLine.trim() || !city.trim() || !zip.trim() || !stateCode.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* OTP Verification Modal */}
      <Dialog
        open={isOtpModalOpen}
        onClose={() => {
          setIsOtpModalOpen(false);
          setOtpInput("");
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Verify Email Address
            </Dialog.Title>
            <p className="text-gray-600 mb-4">
              We've sent a verification code to <strong>{user?.email}</strong>. 
              Please enter the code below to verify your email address.
            </p>
            <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full border rounded px-3 py-2 text-center text-lg tracking-widest"
              />
              <div className="flex justify-between gap-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isOtpSending}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOtpSending ? "Sending..." : "Resend OTP"}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpModalOpen(false);
                      setOtpInput("");
                    }}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!otpInput.trim() || isOtpVerifying}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOtpVerifying ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
