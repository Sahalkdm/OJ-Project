import { useNavigate } from "react-router-dom";

const NoPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-9xl font-extrabold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-2 dark:text-gray-200">Oops! Page not found</h2>
      <p className="text-center text-gray-600 mb-6 dark:text-gray-400">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NoPage;
