import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const DB_FILE = path.join(process.cwd(), 'leads_db.json');

// Initialize DB file
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to receive lead data (The backend answer!)
  app.post('/api/leads', (req, res) => {
    const { candidateName, fatherName, targetExam, phoneNumber, pledgeDate } = req.body;
    
    const newLead = {
      id: Date.now().toString(),
      candidateName,
      fatherName,
      targetExam,
      phoneNumber,
      pledgeDate,
      createdAt: new Date().toISOString()
    };

    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      data.push(newLead);
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

      console.log('🎉 -----------------------------');
      console.log('🎉 NEW HOT LEAD SAVED TO DB:');
      console.log(`👤 Name: ${candidateName} | 🎯 Exam: ${targetExam}`);
      console.log('🎉 -----------------------------');
      
      res.json({ success: true, message: 'Lead saved successfully!' });
    } catch (err) {
      console.error('Failed to save lead:', err);
      res.status(500).json({ success: false, message: 'Server error saving lead.' });
    }
  });

  // Admin route to view leads (SECURED)
  app.get('/api/leads', (req, res) => {
    const password = req.headers['x-admin-password'];
    
    if (password !== 'admin247') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      res.json({ success: true, leads: data });
    } catch (err) {
      console.error('Failed to read leads:', err);
      res.status(500).json({ success: false, message: 'Server error reading leads.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production bundle
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
