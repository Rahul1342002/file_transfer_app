import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function Send() {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [transferId, setTransferId] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    setFiles([...files, ...event.target.files]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const generateTransferId = () => {
    if (files.length === 0) {
      alert("Please select at least one file before sending.");
      return;
    }

    const newTransferId = uuidv4().slice(0, 8);
    setTransferId(newTransferId);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 relative">
      {/* Home Button with SVG */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 p-2 bg-gray-600 rounded-full hover:bg-gray-700 transition-all"
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

      <div className="flex flex-col items-center justify-center bg-blue-200 rounded-3xl w-[50vw] h-[50vh] relative overflow-hidden">
        <h1 className="font-poppins text-3xl md:text-4xl font-extrabold text-blue-700 mb-2">
          Send Your Files
        </h1>
        <h2 className="font-poppins text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Drag & Drop to Upload
        </h2>

        {/* Drag & Drop Area */}
        <div
          className={`w-80 h-40 flex flex-col items-center justify-center border-2 border-dashed ${
            dragging ? "border-blue-500 bg-blue-100" : "border-gray-400"
          } rounded-lg p-6 cursor-pointer transition-all`}
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

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />

        {/* File Count Display */}
        {files.length > 0 && (
          <p className="mt-3 text-gray-800">Selected Files: {files.length}</p>
        )}

        {/* Send Button */}
        <button
          onClick={generateTransferId}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Generate Transfer ID
        </button>

        {/* Display Generated Transfer ID */}
        {transferId && (
          <div className="mt-4 p-3 bg-white text-blue-600 font-bold rounded-lg border border-blue-400">
            Transfer ID: {transferId}
          </div>
        )}
      </div>
    </div>
  );
}

export default Send;
