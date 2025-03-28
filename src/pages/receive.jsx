import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Receive() {
  const [transferId, setTransferId] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [serverIP, setServerIP] = useState("localhost");
  const navigate = useNavigate();

  // Fetch local IP dynamically
  useEffect(() => {
    async function getLocalIP() {
      try {
        const response = await axios.get("http://localhost:5000/ip");
        setServerIP(response.data.ip); // Server returns { ip: "192.168.x.x" }
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    }
    getLocalIP();
  }, []);

  const handleReceive = async () => {
    if (!transferId.trim()) {
      setError("Please enter a valid Transfer ID.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const response = await axios.get(`http://${serverIP}:5000/download/${transferId}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        },
      });

      if (response.status === 200) {
        const contentDisposition = response.headers["content-disposition"];
        let fileName = `file_${transferId}`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename\*=UTF-8''(.+)|filename="(.+)"/);
          if (match) fileName = decodeURIComponent(match[1] || match[2]);
        }

        const mimeType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: mimeType });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error("File not found.");
      }
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download file. Please check the Transfer ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative p-4">
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75M4.5 10.5v9h15v-9" />
        </svg>
      </button>

      <div className="flex flex-col items-center justify-center bg-green-200 rounded-3xl w-full max-w-md md:w-[70vw] lg:w-[50vw] h-auto py-10 px-6 shadow-lg">
        <h1 className="font-poppins text-2xl md:text-3xl font-extrabold text-green-700 mb-2 text-center">
          Receive Files
        </h1>
        <h2 className="font-poppins text-lg md:text-xl font-bold text-gray-800 mb-6 text-center">
          Enter Transfer ID
        </h2>

        <div className="flex flex-col items-center w-full">
          <input
            type="text"
            placeholder="Enter Transfer ID..."
            value={transferId}
            onChange={(e) => setTransferId(e.target.value)}
            className="w-full max-w-xs p-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-green-500 text-lg text-center"
          />

          <button
            onClick={handleReceive}
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all w-full max-w-xs text-lg font-semibold"
          >
            Receive Files
          </button>
        </div>

        {loading && <div className="mt-4 text-gray-700">Downloading... {progress}%</div>}
        {error && <div className="mt-4 p-3 bg-red-500 text-white font-bold rounded-lg text-center">{error}</div>}
      </div>
    </div>
  );
}

export default Receive;
