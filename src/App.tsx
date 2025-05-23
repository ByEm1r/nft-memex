import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { Purchase } from './pages/Purchase';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { useStore } from './store';

function App() {
  const { loadInitialData } = useStore();
  const ws = useRef<WebSocket | null>(null);
  const pingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadInitialData();

    const token = 'KPKtZvI1vC4a';
    const isProd = window.location.protocol === 'https:';
    const wsUrl = isProd
        ? `wss://nft.memextoken.org/?token=${token}`
        : `ws://localhost:3001/?token=${token}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('✅ WebSocket connected');
      pingInterval.current = setInterval(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ type: 'ping' }));
        }
      }, 25000);
    };

    ws.current.onclose = () => {
      console.warn('❌ WebSocket disconnected');
      clearInterval(pingInterval.current!);
    };

    ws.current.onerror = (event) => {
      console.warn('⚠️ WebSocket error:', event);
    };

    return () => {
      ws.current?.close();
      if (pingInterval.current) clearInterval(pingInterval.current);
    };
  }, []);

  return (
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-900">
          <div className="container mx-auto px-4 flex-grow">
            <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
              <Header />
              <main className="py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/planc" element={<Admin />} />
                  <Route path="/purchase/:id" element={<Purchase />} />
                </Routes>
              </main>
            </div>
          </div>
          <Footer />
          <ScrollToTop />
        </div>
      </Router>
  );
}

export default App;
