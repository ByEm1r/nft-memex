// server.js - Render uyumlu, HTTPS sertifikasız (Render zaten HTTPS sunar)
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer as createViteServer } from 'vite';
import { WebSocketServer } from 'ws';
import { createServer as createHttpServer } from 'http';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Supabase bağlantısı
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Basit admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'PlanC' && password === 'Ceyhun8387@') {
    res.json({ success: true, token: 'memex-admin-token' });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === 'Bearer memex-admin-token') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
};

// Supabase API endpoint'leri
app.get('/api/nfts', async (req, res) => {
  const { data, error } = await supabase.from('nfts').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/orders', async (req, res) => {
  const { data, error } = await supabase.from('orders').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/orders', async (req, res) => {
  const { error } = await supabase.from('orders').insert([req.body]);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

app.get('/api/settings', async (req, res) => {
  const { data, error } = await supabase.from('settings').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/settings', isAuthenticated, async (req, res) => {
  const { key, updates } = req.body;
  const { error } = await supabase.from('settings').update(updates).eq('key', key);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// HTTP server
const httpServer = createHttpServer(app);

// WebSocket (sadece HTTP sunucusu üzerinde çalışır)
const wss = new WebSocketServer({ server: httpServer });
wss.on('connection', (ws) => {
  console.log('WebSocket connected');
  ws.on('message', (msg) => {
    console.log('Received:', msg.toString());
    ws.send(`Echo: ${msg}`);
  });
  ws.on('close', () => console.log('WebSocket disconnected'));
  ws.on('error', (err) => console.error('WebSocket error:', err));
});

// Vite (middleware)
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa'
});
app.use(vite.middlewares);

// Yayına alınca statik dosyaları servis et
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  app.get('*', (req, res) => res.sendFile(join(__dirname, 'dist', 'index.html')));
}

// Sunucuyu başlat
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
