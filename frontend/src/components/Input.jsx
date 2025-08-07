import { IconContext } from "react-icons";

export default function InputField({ icon: Icon, type = "text", placeholder, value, setValue, required = false }) {
  return (
    <div className="flex items-center border-b border-gray-300 py-2 mb-4 w-full">
      <IconContext.Provider value={{ className: "text-gray-500 text-lg mr-2" }}>
        {Icon && <Icon />}
      </IconContext.Provider>
      <input
        type={type}
        value={value}
        onChange={(e)=>setValue(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full outline-none bg-transparent placeholder-gray-400"
      />
    </div>
  );
}
