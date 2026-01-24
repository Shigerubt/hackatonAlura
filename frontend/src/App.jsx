import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import { apiFetch } from './utils/api';

import './index.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard' | 'login'

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await apiFetch('/users/profile');
                    if (response.ok) {
                        const data = await response.json();
                        setUser(data);
                        setIsAuthenticated(true);
                    } else {
                        throw new Error('Sesión inválida');
                    }
                } catch (err) {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
        };
        checkAuth();
    }, []);

    const handleLaunch = () => {
        if (isAuthenticated) {
            setCurrentView('dashboard');
        } else {
            setCurrentView('login');
        }
    };

    const handleLogin = async (token) => {
        try {
            const response = await apiFetch('/users/profile');
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setIsAuthenticated(true);
                setCurrentView('dashboard');
            } else {
                throw new Error('Error al obtener perfil');
            }
        } catch (err) {
            console.error('Login profile fetch failed:', err);
            // Si el token es válido pero el perfil falla (ej. red), al menos permitimos entrar si el token existe
            setIsAuthenticated(true);
            setCurrentView('dashboard');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        setCurrentView('landing');
    };

    return (
        <div className="antialiased min-h-screen bg-navy-deep text-white selection:bg-neon-cyan selection:text-navy-deep font-sans">
            {currentView === 'landing' && (
                <LandingPage onLaunch={handleLaunch} />
            )}
            {currentView === 'login' && (
                <LoginPage onLogin={handleLogin} onBack={() => setCurrentView('landing')} />
            )}
            {currentView === 'dashboard' && (
                <Dashboard 
                    user={user}
                    onBack={() => setCurrentView('landing')} 
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
}

export default App;
