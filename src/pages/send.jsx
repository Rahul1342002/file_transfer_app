import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Send() {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [transferId, setTransferId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one file before sending.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      setTransferId(response.data.transferId);
      setFiles([]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (transferId) {
      navigator.clipboard.writeText(transferId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />

        {files.length > 0 && (
          <p className="mt-3 text-gray-800 font-medium">Selected Files: {files.length}</p>
        )}

        <button
          onClick={handleUpload}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all w-full max-w-xs text-lg font-semibold"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Files"}
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
            <svg className="w-6 h-6 text-blue-600"version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
	 viewBox="0 0 64 64" enable-background="new 0 0 64 64" >
<g id="Text-files">
	<path d="M53.9791489,9.1429005H50.010849c-0.0826988,0-0.1562004,0.0283995-0.2331009,0.0469999V5.0228
		C49.7777481,2.253,47.4731483,0,44.6398468,0h-34.422596C7.3839517,0,5.0793519,2.253,5.0793519,5.0228v46.8432999
		c0,2.7697983,2.3045998,5.0228004,5.1378999,5.0228004h6.0367002v2.2678986C16.253952,61.8274002,18.4702511,64,21.1954517,64
		h32.783699c2.7252007,0,4.9414978-2.1725998,4.9414978-4.8432007V13.9861002
		C58.9206467,11.3155003,56.7043495,9.1429005,53.9791489,9.1429005z M7.1110516,51.8661003V5.0228
		c0-1.6487999,1.3938999-2.9909999,3.1062002-2.9909999h34.422596c1.7123032,0,3.1062012,1.3422,3.1062012,2.9909999v46.8432999
		c0,1.6487999-1.393898,2.9911003-3.1062012,2.9911003h-34.422596C8.5049515,54.8572006,7.1110516,53.5149002,7.1110516,51.8661003z
		 M56.8888474,59.1567993c0,1.550602-1.3055,2.8115005-2.9096985,2.8115005h-32.783699
		c-1.6042004,0-2.9097996-1.2608986-2.9097996-2.8115005v-2.2678986h26.3541946
		c2.8333015,0,5.1379013-2.2530022,5.1379013-5.0228004V11.1275997c0.0769005,0.0186005,0.1504021,0.0469999,0.2331009,0.0469999
		h3.9682999c1.6041985,0,2.9096985,1.2609005,2.9096985,2.8115005V59.1567993z"/>
	<path d="M38.6031494,13.2063999H16.253952c-0.5615005,0-1.0159006,0.4542999-1.0159006,1.0158005
		c0,0.5615997,0.4544001,1.0158997,1.0159006,1.0158997h22.3491974c0.5615005,0,1.0158997-0.4542999,1.0158997-1.0158997
		C39.6190491,13.6606998,39.16465,13.2063999,38.6031494,13.2063999z"/>
	<path d="M38.6031494,21.3334007H16.253952c-0.5615005,0-1.0159006,0.4542999-1.0159006,1.0157986
		c0,0.5615005,0.4544001,1.0159016,1.0159006,1.0159016h22.3491974c0.5615005,0,1.0158997-0.454401,1.0158997-1.0159016
		C39.6190491,21.7877007,39.16465,21.3334007,38.6031494,21.3334007z"/>
	<path d="M38.6031494,29.4603004H16.253952c-0.5615005,0-1.0159006,0.4543991-1.0159006,1.0158997
		s0.4544001,1.0158997,1.0159006,1.0158997h22.3491974c0.5615005,0,1.0158997-0.4543991,1.0158997-1.0158997
		S39.16465,29.4603004,38.6031494,29.4603004z"/>
	<path d="M28.4444485,37.5872993H16.253952c-0.5615005,0-1.0159006,0.4543991-1.0159006,1.0158997
		s0.4544001,1.0158997,1.0159006,1.0158997h12.1904964c0.5615025,0,1.0158005-0.4543991,1.0158005-1.0158997
		S29.0059509,37.5872993,28.4444485,37.5872993z"/>
</g>
</svg>
            </button>
          </div>
        )}

        {copied && (
          <div className="mt-2 text-green-600 text-sm font-semibold">Copied to clipboard!</div>
        )}
      </div>
    </div>
  );
}

export default Send;
