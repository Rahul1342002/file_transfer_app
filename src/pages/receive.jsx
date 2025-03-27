import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Receive() {
  const [transferId, setTransferId] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleReceive = () => {
    if (!transferId) {
      alert("Please enter a Transfer ID.");
      return;
    }

    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative p-4">
      {/* Home Button with SVG */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 p-2 bg-green-600 rounded-full hover:bg-green-700 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 9.75L12 3l9 6.75M4.5 10.5v9h15v-9"
          />
        </svg>
      </button>

      {/* Main Card */}
      <div className="flex flex-col items-center justify-center bg-green-200 rounded-3xl w-full max-w-md md:w-[70vw] lg:w-[50vw] h-auto py-10 px-6 shadow-lg">
        <h1 className="font-poppins text-2xl md:text-3xl font-extrabold text-green-700 mb-2 text-center">
          Receive Files
        </h1>
        <h2 className="font-poppins text-lg md:text-xl font-bold text-gray-800 mb-6 text-center">
          Enter Transfer ID
        </h2>

        {/* Input for Transfer ID */}
        <input
          type="text"
          placeholder="Enter Transfer ID..."
          value={transferId}
          onChange={(e) => setTransferId(e.target.value)}
          className="w-full max-w-xs p-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-green-500 text-lg"
        />

        {/* Receive Button */}
        <button
          onClick={handleReceive}
          className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all w-full max-w-xs text-lg font-semibold"
        >
          Receive Files
        </button>

        {/* Loading Bar (Only when receiving) */}
        {loading && (
          <div className="w-full max-w-xs h-4 bg-gray-300 rounded-lg mt-4 overflow-hidden">
            <div
              className="h-4 bg-green-500 rounded-lg transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Receive;
