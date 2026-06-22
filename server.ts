import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const cleanName = path.basename(file.originalname);
    cb(null, cleanName);
  }
});
const upload = multer({ storage });

async function startServer() {
  const PORT = 3000;
  const app = express();

  // Set up high JSON body limits to support base64 document payloads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Core Directory Paths
  const DIR_DATA = path.join(process.cwd(), 'data');
  const DIR_UPLOADS = path.join(process.cwd(), 'uploads');
  const FILE_DB = path.join(DIR_DATA, 'db.json');

  // Ensure necessary directories exist
  if (!fs.existsSync(DIR_DATA)) {
    fs.mkdirSync(DIR_DATA, { recursive: true });
  }
  if (!fs.existsSync(DIR_UPLOADS)) {
    fs.mkdirSync(DIR_UPLOADS, { recursive: true });
  }

  // Intercept uploads and vault downloads with built-in Express native binary transfer handler
  app.get('/uploads/:filename', (req, res) => {
    try {
      const cleanFileName = path.basename(req.params.filename);
      const filePath = path.join(DIR_UPLOADS, cleanFileName);
      if (fs.existsSync(filePath)) {
        return res.download(filePath, cleanFileName, (err) => {
          if (err) {
            console.error("❌ Error during file transmission:", err);
          }
        });
      }
      return res.status(404).send('File not found');
    } catch (err: any) {
      return res.status(500).send(err.message);
    }
  });

  app.get('/vault/:folder/:filename', (req, res) => {
    try {
      const cleanFileName = path.basename(req.params.filename);
      const filePath = path.join(DIR_UPLOADS, cleanFileName);
      if (fs.existsSync(filePath)) {
        return res.download(filePath, cleanFileName, (err) => {
          if (err) {
            console.error("❌ Error during file transmission:", err);
          }
        });
      }
      return res.status(404).send('File not found');
    } catch (err: any) {
      return res.status(500).send(err.message);
    }
  });

  app.get('/api/download/:filename', (req, res) => {
    try {
      const fileName = req.params.filename;
      const filePath = path.join(DIR_UPLOADS, fileName);
      if (fs.existsSync(filePath)) {
        return res.download(filePath, fileName, (err) => {
          if (err) {
            console.error("❌ Error during file transmission:", err);
          }
        });
      } else {
        console.error(`❌ File not found on disk at: ${filePath}`);
        return res.status(404).send('File does not exist on the server storage.');
      }
    } catch (err: any) {
      return res.status(500).send(err.message);
    }
  });

  app.get('/api/download', (req, res) => {
    try {
      const { filename } = req.query;
      if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
      }
      const cleanFileName = path.basename(filename as string);
      const filePath = path.join(DIR_UPLOADS, cleanFileName);
      if (fs.existsSync(filePath)) {
        return res.download(filePath, cleanFileName, (err) => {
          if (err) {
            console.error("❌ Error during file transmission:", err);
          }
        });
      }
      return res.status(404).json({ error: 'File not found' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Serve uploaded files statically so they can be downloaded back as fallback
  app.use('/uploads', express.static(DIR_UPLOADS));

  // Fallback to alias /vault paths in case old records reference them
  app.use('/vault/mr-templates', express.static(DIR_UPLOADS));
  app.use('/vault/preparer-drafts', express.static(DIR_UPLOADS));
  app.use('/vault/reviewer-verified', express.static(DIR_UPLOADS));
  app.use('/vault/final-approved', express.static(DIR_UPLOADS));

  // ----------------------------------------------------
  // LOCAL PERSISTENT STORAGE CONTROLLER PATHS
  // ----------------------------------------------------

  // API to load database state
  app.get("/api/data", (req, res) => {
    try {
      if (fs.existsSync(FILE_DB)) {
        const content = fs.readFileSync(FILE_DB, 'utf-8');
        const parsed = JSON.parse(content);
        return res.json({
          users: parsed.users || [],
          documents: parsed.documents || [],
          auditLogs: parsed.auditLogs || [],
          dcrnRequests: parsed.dcrnRequests || []
        });
      }
      // Return empty shell so client's fallback INITIAL_USERS can bootstrap and sync
      return res.json({ users: [], documents: [], auditLogs: [], dcrnRequests: [] });
    } catch (err: any) {
      console.error("Error reading db.json", err);
      res.status(500).json({ error: "Failed to read database state" });
    }
  });

  // API to save/sync database state
  app.post("/api/sync", (req, res) => {
    try {
      const { users, documents, auditLogs, dcrnRequests } = req.body;
      const model = {
        users: users || [],
        documents: documents || [],
        auditLogs: auditLogs || [],
        dcrnRequests: dcrnRequests || []
      };
      fs.writeFileSync(FILE_DB, JSON.stringify(model, null, 2), 'utf-8');
      res.json({ success: true });
    } catch (err: any) {
      console.error("Error writing db.json", err);
      res.status(500).json({ error: "Failed to sync database state" });
    }
  });

  // API to upload binary files (supports both base64 transport and standard FormData/multipart)
  app.post(['/uploads', '/api/upload'], upload.any(), (req, res) => {
    try {
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const file = req.files[0];
        const cleanFileName = path.basename(file.originalname);
        const destinationPath = path.join(DIR_UPLOADS, cleanFileName);
        const fileSizeInKb = (file.size / 1024).toFixed(0);
        const fileSizeFormatted = `${fileSizeInKb} KB`;

        // Ensure directory exists synchronously before moving
        if (!fs.existsSync(DIR_UPLOADS)) {
          fs.mkdirSync(DIR_UPLOADS, { recursive: true });
        }

        const sourcePath = path.resolve(file.path);
        const destPath = path.resolve(destinationPath);
        if (sourcePath !== destPath) {
          fs.copyFileSync(file.path, destinationPath);
          fs.unlinkSync(file.path);
        }
        console.log(`[LAN-Server] Saved file from multipart upload: ${destinationPath} (${fileSizeFormatted})`);

        return res.json({
          success: true,
          filename: cleanFileName,
          fileName: cleanFileName,
          url: `/uploads/${cleanFileName}`,
          fileSize: fileSizeFormatted
        });
      }

      // If no multipart files, check if it's base64 in body
      const { fileName, base64Data } = req.body || {};
      if (fileName && base64Data) {
        // Sanitize file name to prevent directory traversal
        const cleanFileName = path.basename(fileName);
        const destinationPath = path.join(DIR_UPLOADS, cleanFileName);

        // Convert base64 data back to physical file buffer
        const fileBuffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(destinationPath, fileBuffer);

        // Calculate simulated filesize representation
        const fileSizeInKb = (fileBuffer.length / 1024).toFixed(0);
        const fileSizeFormatted = `${fileSizeInKb} KB`;

        console.log(`[LAN-Server] Saved file locally from base64: ${destinationPath} (${fileSizeFormatted})`);

        return res.json({
          success: true,
          filename: cleanFileName,
          fileName: cleanFileName,
          url: `/uploads/${cleanFileName}`,
          fileSize: fileSizeFormatted
        });
      }

      return res.status(400).json({ error: 'No file received by backend.' });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || "Failed to save file on LAN host server disk" });
    }
  });

  // ----------------------------------------------------
  // VITE CLIENT DEV MIDDLEWARE & PRODUCTION INDEX ROUTING
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to port 3000 on network scope '0.0.0.0' for LAN pingability
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=======================================================`);
    console.log(`  eQMS OFFLINE LAN OFFICE SERVER RUNNING SUCCESSFULLY  `);
    console.log(`  Local Access: http://localhost:${PORT}               `);
    console.log(`  LAN IP Broadcaster: http://0.0.0.0:${PORT}            `);
    console.log(`=======================================================`);
  });
}

startServer();
