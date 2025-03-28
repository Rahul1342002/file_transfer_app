const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const os = require("os");

const app = express();
const PORT = 5000;

app.use(cors());

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
  return "localhost";
};
const LOCAL_IP = getLocalIP();

const generateTransferId = () => Math.floor(100000 + Math.random() * 900000).toString();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, generateTransferId() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  console.log("File uploaded:", req.file);
  res.json({ transferId: req.file.filename.split(".")[0] });
});

app.get("/download/:transferId", (req, res) => {
  const { transferId } = req.params;
  const filePath = path.join(__dirname, "uploads");

  const files = fs.readdirSync(filePath);
  const matchedFile = files.find((file) => file.startsWith(transferId));

  if (!matchedFile) return res.status(404).json({ error: "File not found" });

  const fullPath = path.join(filePath, matchedFile);
  res.download(fullPath, matchedFile, (err) => {
    if (err) {
      console.error("Download failed:", err);
      return res.status(500).json({ error: "File download failed" });
    }
    
    fs.unlink(fullPath, (unlinkErr) => {
      if (unlinkErr) console.error("Error deleting file:", unlinkErr);
      else console.log("File deleted successfully after download:", matchedFile);
    });
  });
});

// Fixed /ip route
app.get("/ip", (req, res) => {
  res.json({ ip: LOCAL_IP });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on:`);
  console.log(`- Local:   http://localhost:${PORT}`);
  console.log(`- Network: http://${LOCAL_IP}:${PORT}`);
});
