import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, User, ShieldCheck, Mail, LogIn } from 'lucide-react';
import { Button } from '../components/ui/Button';
import logo from '../assets/Churn Alert Shield.png';

export default function LoginPage({ onLogin, onBack }) {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const endpoint = isRegister ? '/auth/register' : '/auth/login';
        
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
            
            const bodyData = isRegister ? {
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                role: "USER"
            } : {
                email: formData.email,
                password: formData.password
            };

            const response = await fetch(`${apiUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error("Validation failed: Verifique que el email sea válido y la contraseña tenga al menos 8 caracteres.");
                }
                if (response.status === 401 || response.status === 403 || data.message === 'Invalid credentials') {
                    throw new Error("Credenciales inválidas: El correo o la contraseña no son correctos.");
                }
                throw new Error(data.message || 'Error en la solicitud');
            }

            if (isRegister) {
                setIsRegister(false);
                setError('Registro exitoso. ¡Bienvenido! Por favor ingresa con tu cuenta.');
            } else {
                localStorage.setItem('token', data.token);
                onLogin(data.token);
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message === 'Failed to fetch' ? 'No se pudo conectar con el servidor. ¿Está el backend encendido?' : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center bg-navy-deep px-4">
            <button
                onClick={onBack}
                className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors z-20"
            >
                <ArrowRight className="rotate-180 w-4 h-4" />
                Volver al inicio
            </button>
            
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-alert-red/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-4 object-contain drop-shadow-[0_0_15px_rgba(100,255,218,0.3)]" />
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {isRegister ? 'Crear Cuenta' : 'Bienvenido'}
                    </h1>
                    <p className="text-gray-400">
                        {isRegister ? 'Únete a la elite de análisis predictivo' : 'Ingresa tus credenciales de analista'}
                    </p>
                </div>

                {error && (
                    <div className={`p-4 rounded-lg mb-6 text-sm flex items-start gap-3 ${error.includes('exitoso') ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'bg-alert-red/10 text-alert-red border border-alert-red/20'}`}>
                        {error.includes('exitoso') ? <ShieldCheck size={18} className="shrink-0 mt-0.5" /> : <LogIn size={18} className="shrink-0 mt-0.5" />}
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {isRegister && (
                        <div className="space-y-1">
                            <div className="relative group">
                                <User className="absolute left-3 top-3 text-gray-500 group-focus-within:text-neon-cyan transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Nombre Completo"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:border-neon-cyan outline-none transition-all"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 ml-2">Ej: Hugo Arias</p>
                        </div>
                    )}

                    <div className="space-y-1">
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 text-gray-500 group-focus-within:text-neon-cyan transition-colors" size={20} />
                            <input
                                type="email"
                                placeholder="Correo Institucional"
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:border-neon-cyan outline-none transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <p className="text-[10px] text-gray-500 ml-2">Usar el formato: admin@local</p>
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 text-gray-500 group-focus-within:text-neon-cyan transition-colors" size={20} />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:border-neon-cyan outline-none transition-all"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        {isRegister && <p className="text-[10px] text-cyan-500/70 ml-2 font-medium">🛡️ Seguridad: Mínimo 8 caracteres, incluye mayúsculas y números.</p>}
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-4 rounded-xl flex items-center justify-center gap-2 group mt-6"
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : isRegister ? 'Registrarse' : 'Ingresar al Sistema'}
                        {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError(null);
                        }}
                        className="text-gray-400 hover:text-neon-cyan transition-colors text-sm font-medium"
                    >
                        {isRegister ? '¿Ya tienes cuenta? Ingresa aquí' : '¿No eres analista registrado? Crea tu cuenta'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
