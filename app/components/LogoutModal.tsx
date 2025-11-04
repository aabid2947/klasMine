function LogoutModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800">Logout</h2>
        <p className="mt-2 text-gray-600 text-sm">
          Are you sure you want to logout? Once you logout you need to login again. Are you OK?
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md border text-gray-500 bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600"
          >
            Logout!
          </button>
        </div>
      </div>
    </div>
  );
}
