import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { supabase } from '../supabaseClient'; // Supabase bağlantı dosyan

export const Header: React.FC = () => {
  const { isAuthenticated, logout } = useStore();
  const [hideAdminLogin, setHideAdminLogin] = useState(false);

    useEffect(() => {
        const fetchHideLogin = async () => {
            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'hideAdminLogin')
                .single();

            if (!error && data) {
                const val = data.value;
                setHideAdminLogin(val === true || val === 'true' || val === 1); // farklı tiplerde olabilir
            } else {
                setHideAdminLogin(false);
            }
        };

        fetchHideLogin();
    }, []);


  return (
    <header className="bg-gray-900 text-white py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="https://cdn.glitch.global/cdada319-8cc1-41a7-ab15-329ec6fc30a0/memexlogo.jpg?v=1718978744284"
            alt="MemeX NFT Logo"
            className="h-14 w-14 object-contain rounded-full"
            style={{ backgroundColor: 'white' }}
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            MemeX NFT
          </span>
        </Link>
        <nav className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/planc"
                className="bg-[rgb(17 24 39)] hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
              >
                Admin Panel
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            !hideAdminLogin && (
              <Link
                to="/login"
                className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors"
              >
                Admin Login
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
};
