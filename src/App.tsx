import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { Purchase } from './pages/Purchase';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
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
