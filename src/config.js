const getBackendURL = async () => {
    try {
      const response = await fetch("http://localhost:5000/ip"); // Initially using localhost
      const data = await response.json();
      return `http://${data.ip}:5000`;
    } catch (error) {
      console.error("Failed to fetch backend IP, using fallback URL", error);
      return process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"; // Fallback
    }
  };
  
  export default getBackendURL;
  