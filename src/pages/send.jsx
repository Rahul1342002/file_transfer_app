import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Send() {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [transferId, setTransferId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(""); // New state for "Copied to Clipboard" message
  const [serverIP, setServerIP] = useState("localhost");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch local network IP
  useEffect(() => {
    async function getLocalIP() {
      try {
        const response = await axios.get("http://192.168.1.16:5000/ip", { timeout: 5000 });
        if (response.data.ip && response.data.ip !== "127.0.0.1") {
          setServerIP(response.data.ip);
        } else {
          console.warn("Received localhost IP, trying alternative methods...");
          const fallbackIP = await fetchLocalIP();
          setServerIP(fallbackIP);
        }
      } catch (error) {
        console.error("Error fetching IP:", error);
        setServerIP("localhost");
      }
    }

    async function fetchLocalIP() {
      try {
        const res = await axios.get("https://api64.ipify.org?format=json"); // External API fallback
        return res.data.ip;
      } catch (err) {
        console.error("Failed to get IP using external API", err);
        return "localhost";
      }
    }

    getLocalIP();
  }, []);

  const handleFileSelect = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    setFiles(Array.from(event.dataTransfer.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select a file before sending.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", files[0]); // Upload only one file at a time

    try {
      const response = await axios.post(`http://${serverIP}:5000/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });

      setTransferId(response.data.transferId);

      // Reset file input after upload
      setFiles([]);
      fileInputRef.current.value = ""; // Reset file input field
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (!transferId) return;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(transferId)
        .then(() => {
          setCopied(true);
          setCopiedMessage("Copied to Clipboard!"); // Set message to display
          setTimeout(() => setCopiedMessage(""), 2000); // Reset message after 2 seconds
        })
        .catch((err) => console.error("Clipboard copy failed:", err));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = transferId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setCopiedMessage("Copied to Clipboard!"); // Set message to display
      setTimeout(() => setCopiedMessage(""), 2000); // Reset message after 2 seconds
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative p-4">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-all"
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

      <div className="flex flex-col items-center justify-center bg-blue-200 rounded-3xl w-full max-w-2xl md:w-[70vw] lg:w-[50vw] h-auto py-10 px-6 relative shadow-lg">
        <h1 className="font-poppins text-2xl md:text-3xl font-extrabold text-blue-700 mb-2 text-center">
          Send Your Files
        </h1>
        <h2 className="font-poppins text-lg md:text-xl font-bold text-gray-800 mb-6 text-center">
          Drag & Drop to Upload
        </h2>

        <div
          className={`w-full max-w-md h-40 flex flex-col items-center justify-center border-2 border-dashed ${
            dragging ? "border-blue-500 bg-blue-100" : "border-gray-400"
          } rounded-lg p-6 cursor-pointer transition-all text-center`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <p className="text-gray-600">Drag & drop files here</p>
          <p className="text-gray-400">or click to upload</p>
        </div>

        <input
          id="fileInput"
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />

        {files.length > 0 && (
          <p className="mt-3 text-gray-800 font-medium">Selected File: {files[0].name}</p>
        )}

        <button
          onClick={handleUpload}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all w-full max-w-xs text-lg font-semibold"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>

        {uploading && (
          <div className="w-64 h-4 bg-gray-300 rounded-lg mt-4">
            <div className="h-4 bg-blue-500 rounded-lg" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}

        {transferId && (
          <div className="mt-4 p-3 bg-white text-blue-600 font-bold rounded-lg border border-blue-400 flex items-center gap-2">
            Transfer ID: {transferId}
            <button onClick={copyToClipboard} className="p-1 rounded hover:bg-gray-200">
              <svg className="w-6 h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
          </div>
        )}

        {copiedMessage && (
          <div className="mt-3 text-green-600 font-semibold p-2 bg-green-100 rounded-lg">
            {copiedMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default Send;
