import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { TbInfoTriangle } from "react-icons/tb";

const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Yes, Delete",
  cancelText = "No, Cancel",
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 p-4 flex justify-center items-center w-full h-full z-[1000] overflow-auto"
      style={{ backdropFilter: "blur(3px)", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative">
        {/* Close Icon */}
         <IoCloseSharp onClick={onCancel} className="h-5 w-5 text-gray-500 absolute top-3 right-3 cursor-pointer" />

        {/* Icon + Message */}
        <div className="my-6 text-center">
          <TbInfoTriangle className="mx-auto text-red-600 w-20 h-20"/>
          <h4 className="text-slate-900 text-base font-medium mt-4">{title}</h4>
          <p className="text-gray-500 text-sm mt-1">{message}</p>

          {/* Buttons */}
          <div className="text-center space-x-4 mt-10">
            <button
              onClick={onCancel}
              type="button"
              className="px-5 py-2.5 rounded-lg text-slate-900 text-sm font-medium bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              type="button"
              className="px-5 py-2.5 rounded-lg text-white text-sm font-medium bg-red-600 hover:bg-red-700 active:bg-red-600"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
