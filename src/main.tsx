import { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { useStore } from './store';

function Root() {
  const { loadInitialData } = useStore();
  const ws = useRef<WebSocket | null>(null);
  const pingInterval = useRef<NodeJS.Timeout | null>(null);

  // WebSocket setup function
  const setupWebSocket = () => {
    const token = 'KPKtZvI1vC4a';
    const isProd = window.location.protocol === 'https:';
    const wsUrl = isProd
        ? `wss://nft.memextoken.org/?token=${token}`
        : `ws://localhost:3001/?token=${token}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('✅ WebSocket connected');

      // Başarılı bağlantı sonrası ping başlat
      pingInterval.current = setInterval(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ type: 'ping' }));
        }
      }, 25000); // 25 saniyede bir ping gönder
    };

    ws.current.onmessage = (event) => {
      console.log('📩 Message:', event.data);
    };

    ws.current.onclose = (event) => {
      console.warn('❌ WebSocket disconnected', event.code, event.reason);
      clearInterval(pingInterval.current!);

      // Sadece beklenmeyen kesilmelerde yeniden bağlan
      if (event.code !== 1000) {
        setTimeout(setupWebSocket, 3000);
      }
    };

    ws.current.onerror = (event) => {
      console.warn('⚠️ WebSocket error:', event);
    };
  };

  useEffect(() => {
    loadInitialData();
    setupWebSocket();

    return () => {
      if (ws.current) ws.current.close();
      if (pingInterval.current) clearInterval(pingInterval.current);
    };
  }, []);

  return <App />;
}

const rootElement = document.getElementById('root');
if (rootElement && !rootElement._reactRootContainer) {
  const root = createRoot(rootElement);
  root.render(
      <StrictMode>
        <Root />
      </StrictMode>
  );
}


