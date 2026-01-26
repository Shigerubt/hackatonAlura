import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Lock, Trash2, Edit2, UserPlus, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { apiFetch } from '../../utils/api';

export default function Settings({ user, onProfileUpdate }) {
    const [activeSection, setActiveSection] = useState('profile'); // 'profile' | 'admin'
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    // Profile state
    const [profileData, setProfileData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Admin state
    const [usersList, setUsersList] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'USER'
    });

    const isAdmin = user?.roles === 'ADMIN';

    useEffect(() => {
        if (isAdmin && activeSection === 'admin') {
            fetchUsers();
        }
    }, [activeSection, isAdmin]);

    const fetchUsers = async () => {
        try {
            const res = await apiFetch('/users/all');
            if (res.ok) {
                const data = await res.json();
                setUsersList(data);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!validateEmail(profileData.email)) {
            setStatus({ type: 'error', message: 'Formato de correo inválido (ej: nombre@dominio.com)' });
            return;
        }

        setLoading(true);
        try {
            const res = await apiFetch('/users', {
                method: 'PUT',
                body: JSON.stringify({
                    fullName: profileData.fullName,
                    email: profileData.email
                })
            });

            if (res.ok) {
                const updated = await res.json();
                setStatus({ type: 'success', message: 'Perfil actualizado correctamente' });
                if (onProfileUpdate) onProfileUpdate(updated);
            } else {
                const err = await res.json();
                setStatus({ type: 'error', message: err.message || 'Error al actualizar perfil' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Error de conexión' });
        } finally {
            setLoading(false);
            setTimeout(() => setStatus({ type: '', message: '' }), 5000);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (profileData.newPassword !== profileData.confirmPassword) {
            setStatus({ type: 'error', message: 'Las contraseñas no coinciden' });
            return;
        }

        setLoading(true);
        try {
            const res = await apiFetch('/users/password', {
                method: 'PUT',
                body: JSON.stringify({
                    currentPassword: profileData.currentPassword,
                    newPassword: profileData.newPassword
                })
            });

            if (res.ok) {
                setStatus({ type: 'success', message: 'Contraseña actualizada' });
                setProfileData({ ...profileData, currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setStatus({ type: 'error', message: 'Error al actualizar contraseña' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Error de conexión' });
        } finally {
            setLoading(false);
            setTimeout(() => setStatus({ type: '', message: '' }), 5000);
        }
    };

    const handleDeleteUser = async (id) => {
        if (id === user.id) return;
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

        try {
            const res = await apiFetch(`/users/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsersList(usersList.filter(u => u.id !== id));
                setStatus({ type: 'success', message: 'Usuario eliminado' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Error al eliminar usuario' });
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!validateEmail(newUser.email)) {
            setStatus({ type: 'error', message: 'Formato de correo inválido' });
            return;
        }

        try {
            const res = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify(newUser)
            });
            if (res.ok) {
                fetchUsers();
                setShowRegisterModal(false);
                setNewUser({ fullName: '', email: '', password: '', role: 'USER' });
                setStatus({ type: 'success', message: 'Usuario creado exitosamente' });
            } else {
                const err = await res.json();
                setStatus({ type: 'error', message: err.message || 'Error al crear usuario' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Error de conexión' });
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <header className="mb-10 text-center">
                <h2 className="text-3xl font-bold mb-2">Configuración</h2>
                <p className="text-gray-400">Administra tu cuenta y los usuarios del sistema.</p>
            </header>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveSection('profile')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${activeSection === 'profile' ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' : 'text-gray-500 hover:text-white'}`}
                >
                    <User size={18} /> Mi Perfil
                </button>
                {isAdmin && (
                    <button
                        onClick={() => setActiveSection('admin')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${activeSection === 'admin' ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Shield size={18} /> Gestión de Usuarios
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {status.message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-alert-red/10 border-alert-red/20 text-alert-red'}`}
                    >
                        {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {status.message}
                    </motion.div>
                )}

                {activeSection === 'profile' ? (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        <Card title="Datos Personales">
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Nombre Completo</label>
                                    <input
                                        type="text"
                                        value={profileData.fullName}
                                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                        className="w-full bg-navy-deep border border-white/10 rounded-lg py-2 px-4 text-white focus:border-neon-cyan outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Correo Electrónico</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 text-gray-500" size={16} />
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            placeholder="nombre@dominio.com"
                                            className="w-full bg-navy-deep border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:border-neon-cyan outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500 italic">Ejemplo requerido: usuario@empresa.com</p>
                                </div>
                                <Button type="submit" loading={loading} className="w-full">
                                    Actualizar Perfil
                                </Button>
                            </form>
                        </Card>

                        <Card title="Seguridad">
                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Contraseña Actual</label>
                                    <input
                                        type="password"
                                        value={profileData.currentPassword}
                                        onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                                        className="w-full bg-navy-deep border border-white/10 rounded-lg py-2 px-4 text-white focus:border-neon-cyan outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        value={profileData.newPassword}
                                        onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                                        className="w-full bg-navy-deep border border-white/10 rounded-lg py-2 px-4 text-white focus:border-neon-cyan outline-none transition-all"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Confirmar Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        value={profileData.confirmPassword}
                                        onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                                        className="w-full bg-navy-deep border border-white/10 rounded-lg py-2 px-4 text-white focus:border-neon-cyan outline-none transition-all"
                                        required
                                    />
                                </div>
                                <Button type="submit" variant="glass" className="w-full">
                                    <Lock size={16} /> Cambiar Contraseña
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="admin"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="text-sm">
                                <span className="text-neon-cyan font-bold">{usersList.length}</span> Usuarios Registrados
                            </div>
                            <Button onClick={() => setShowRegisterModal(true)} variant="glass" className="py-2 px-4 text-sm">
                                <UserPlus size={16} /> Añadir Usuario
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-left text-xs text-gray-500 uppercase font-bold tracking-widest">
                                        <th className="px-6 py-3">Usuario</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Rol</th>
                                        <th className="px-6 py-3 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersList.map((u) => (
                                        <tr key={u.id} className="bg-navy-deep/60 border border-white/5 rounded-xl group hover:bg-navy-deep transition-all">
                                            <td className="px-6 py-4 rounded-l-xl font-medium text-white">{u.fullName}</td>
                                            <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${u.roles === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {u.roles}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 rounded-r-xl text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleDeleteUser(u.id)} disabled={u.id === user.id} className="p-2 text-gray-500 hover:text-alert-red disabled:opacity-30">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal for User Creation */}
            <AnimatePresence>
                {showRegisterModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-navy-deep border border-neon-cyan/30 rounded-2xl w-full max-w-md p-8"
                        >
                            <h3 className="text-xl font-bold mb-6">Añadir Nuevo Sentinel</h3>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 uppercase">Nombre</label>
                                    <input
                                        type="text"
                                        value={newUser.fullName}
                                        onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white outline-none focus:border-neon-cyan"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 uppercase">Email</label>
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white outline-none focus:border-neon-cyan"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 uppercase">Contraseña Inicial</label>
                                    <input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white outline-none focus:border-neon-cyan"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 uppercase">Rol Asignado</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white outline-none focus:border-neon-cyan"
                                    >
                                        <option value="USER" className="bg-navy-deep">Analista (USER)</option>
                                        <option value="ADMIN" className="bg-navy-deep">Administrador (ADMIN)</option>
                                    </select>
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <Button type="button" variant="glass" className="flex-1" onClick={() => setShowRegisterModal(false)}>Cancelar</Button>
                                    <Button type="submit" className="flex-1">Guardar</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

