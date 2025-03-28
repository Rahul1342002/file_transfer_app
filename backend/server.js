const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Function to generate a 6-digit random number
const generateTransferId = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configure Multer for file uploads (No File Size Limit)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, generateTransferId() + path.extname(file.originalname)),
});
const upload = multer({ storage }); // No file size limit

// Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  console.log("File uploaded:", req.file);
  res.json({ transferId: req.file.filename.split(".")[0] }); // Remove file extension from ID
});

// Download and Delete File After Receiving
app.get("/download/:transferId", (req, res) => {
  const { transferId } = req.params;
  const filePath = path.join(__dirname, "uploads");

  // Find file that matches the transferId
  const files = fs.readdirSync(filePath);
  const matchedFile = files.find((file) => file.startsWith(transferId));

  if (!matchedFile) {
    return res.status(404).json({ error: "File not found" });
  }

  const fullPath = path.join(filePath, matchedFile);
  
  // Send file and delete after successful transfer
  res.download(fullPath, matchedFile, (err) => {
    if (!err) {
      fs.unlink(fullPath, (err) => {
        if (err) console.error("Error deleting file:", err);
        else console.log("File deleted after download:", matchedFile);
      });
    }
  });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
