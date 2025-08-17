
const variantClasses = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  outline: "border border-gray-400 text-gray-800 hover:bg-gray-100",
  danger: "bg-red-500 text-white hover:bg-red-600",
  success: "bg-green-600 text-white hover:bg-green-700",
  default: "",
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "defualt",
  className = "",
  disabled = false,
}) {
  const baseClasses = "py-2 px-4 rounded-md transition duration-200";
  const combined = `${baseClasses} ${variantClasses[variant] || ""} ${className} ${disabled && 'cursor-not-allowed opacity-80'}`;

  return (
    <button type={type} onClick={onClick} className={combined} disabled={disabled}>
      {children}
    </button>
  );
}
