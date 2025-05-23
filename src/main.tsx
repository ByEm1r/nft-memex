import { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { useStore } from './store';

function Root() {
  const { loadInitialData } = useStore();
  const ws = useRef(null);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Function to establish WebSocket connection
  const setupWebSocket = () => {
    const token = 'KPKtZvI1vC4a';
    const wsUrl = `wss://nft.memextoken.org:24678/?token=${token}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected in main.tsx');
    };

    ws.current.onmessage = (event) => {
      console.log('Received in main.tsx:', event.data);
    };

    ws.current.onclose = (event) => {
      console.log('WebSocket disconnected in main.tsx', event.code, event.reason);
      // Suppress error 1006 display
      if (event.code !== 1006) {
        console.log('WebSocket disconnected in main.tsx', event.code, event.reason);
      }
      // Attempt to reconnect after a delay
      setTimeout(setupWebSocket, 3000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error in main.tsx:', error);
    };
  };

  useEffect(() => {
    loadInitialData();
    setupWebSocket(); // Call WebSocket setup

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Root />
    </StrictMode>
);
