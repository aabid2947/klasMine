// AuthModal.tsx
import React from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPassword from "./ForgotPassword";

interface AuthModalProps {
  onClose: () => void;
  formType: "login" | "signup" | "forgot";
  setFormType: (type: "login" | "signup" | "forgot") => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, formType, setFormType }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white w-full max-w-md p-6 rounded-lg relative">
        {/* Close button with accessibility support */}
        <button
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Render the correct form based on formType */}
        {formType === "login" && (
          <LoginForm
            onForgot={() => setFormType("forgot")}
            onSwitch={() => setFormType("signup")}
            onClose={onClose} // Pass onClose to LoginForm
          />
        )}
        {formType === "signup" && (
          <SignupForm onSwitch={() => setFormType("login")} />
        )}
        {formType === "forgot" && (
          <ForgotPassword onBack={() => setFormType("login")} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
