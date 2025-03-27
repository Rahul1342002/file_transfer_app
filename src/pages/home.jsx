import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [clickedButton, setClickedButton] = useState(null);
  const navigate = useNavigate();

  const handleClick = (path, color, text, logo, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setClickedButton({
      path,
      color,
      text,
      logo,
      top: rect.top + "px",
      left: rect.left + "px",
      width: rect.width + "px",
      height: rect.height + "px",
    });

    setTimeout(() => navigate(path), 600); // Navigate after animation
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 relative overflow-hidden">
      {/* Title */}
      <h1 className="font-poppins text-xl md:text-4xl font-extrabold text-blue-600 mb-2">
        Welcome to the File Transfer App
      </h1>
      <h1 className="font-poppins text- md:text-3xl font-bold text-gray-800 mb-24">
        File Transfer AnyTime
      </h1>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
        {/* Send Button */}
        <div
          className="relative w-48 h-48 md:w-72 md:h-56 bg-blue-500 rounded-3xl shadow-xl transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer flex flex-col items-center justify-center"
          onClick={(e) => handleClick("/send", "bg-blue-500", "Sending Files...", "/send-icon.png", e)}
        >
          <img src="/send-icon.png" alt="Send" className="w-24 md:w-28" />
          <span className="text-white text-lg md:text-xl font-medium mt-2">Send</span>
        </div>

        {/* Receive Button */}
        <div
          className="relative w-48 h-48 md:w-72 md:h-56 bg-green-500 rounded-3xl shadow-xl transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer flex flex-col items-center justify-center"
          onClick={(e) => handleClick("/receive", "bg-green-500", "Receiving Files...", "/receive-icon.png", e)}
        >
          <img src="/receive-icon.png" alt="Receive" className="w-24 md:w-28" />
          <span className="text-white text-lg md:text-xl font-medium mt-2">Receive</span>
        </div>
      </div>

      {/* Expanding Animation with Text & Logo */}
      {clickedButton && (
        <div
          className={`fixed transition-all duration-500 ease-in-out ${clickedButton.color} flex items-center justify-center`}
          style={{
            top: clickedButton.top,
            left: clickedButton.left,
            width: clickedButton.width,
            height: clickedButton.height,
            borderRadius: "24px",
            zIndex: 50,
            animation: "expand 0.5s forwards",
          }}
        >
          {/* Centered Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
            <img src={clickedButton.logo} alt="Action Icon" className="w-24 md:w-32 mb-4 animate-pulse" />
            <span className="text-xl md:text-3xl font-bold">{clickedButton.text}</span>
          </div>
        </div>
      )}

      {/* Animation Keyframes */}
      <style>
        {`
          @keyframes expand {
            0% {
              transform: scale(1);
            }
            100% {
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              border-radius: 0;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Home;
