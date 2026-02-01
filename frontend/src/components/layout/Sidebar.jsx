import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, UploadCloud, FileSearch, Settings, ChevronLeft, ChevronRight, LogOut, Trash2, AlertTriangle, X } from 'lucide-react';
import { clsx } from 'clsx';
import { apiFetch } from '../../utils/api';
import { Button } from '../ui/Button';

import logo from '../../assets/Churn Alert Shield.png';

export function Sidebar({ activeTab, setActiveTab, onBack, onLogout, onDataCleared }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleClearData = async () => {
        setIsClearing(true);
        try {
            const response = await apiFetch('/churn/predictions/clear', {
                method: 'DELETE'
            });
            if (response.ok) {
                setShowDeleteModal(false);
                if (onDataCleared) onDataCleared();
            } else {
                alert('No se pudieron borrar los datos de la base de datos.');
            }
        } catch (err) {
            console.error('Error clearing data:', err);
            alert('Error de conexión al servidor.');
        } finally {
            setIsClearing(false);
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'batch', label: 'Carga Masiva', icon: UploadCloud },
        { id: 'single', label: 'Predicción Única', icon: FileSearch },
        { id: 'playground', label: 'API Playground', icon: FileSearch },
        { id: 'settings', label: 'Configuración', icon: Settings },
    ];

    return (
        <motion.aside
            initial={{ width: 250 }}
            animate={{ width: isCollapsed ? 80 : 250 }}
            className="h-screen bg-navy-deep/80 backdrop-blur-xl border-r border-white/10 flex flex-col relative z-20"
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={onBack}
                        className="font-bold text-xl tracking-tighter text-white flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                        <span>Churn<span className="text-neon-cyan">Alert</span></span>
                    </motion.button>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden",
                                isActive
                                    ? "bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(100,255,218,0.1)]"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-neon-cyan"
                                />
                            )}

                            <Icon size={22} className={clsx(isActive && "drop-shadow-[0_0_5px_rgba(100,255,218,0.5)]")} />

                            {!isCollapsed && (
                                <span className="font-medium whitespace-nowrap">{item.label}</span>
                            )}

                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </button>
                    );
                })}
            </nav>

            {/* User / Footer */}
            <div className="p-4 border-t border-white/10 space-y-2">
                <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-alert-red/70 hover:text-alert-red hover:bg-alert-red/10 transition-colors text-sm group"
                >
                    <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                    {!isCollapsed && <span className="font-medium">Borrar Predicciones</span>}
                </button>
                
                <button 
                    onClick={onLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
                >
                    <LogOut size={20} />
                    {!isCollapsed && <span className="font-medium">Cerrar Sesión</span>}
                </button>
            </div>

            {/* Modal de Confirmación de Borrado */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isClearing && setShowDeleteModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-navy-deep border border-alert-red/30 w-full max-w-md p-8 rounded-3xl shadow-2xl"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-alert-red/10 rounded-2xl text-alert-red">
                                    <AlertTriangle size={32} />
                                </div>
                                <button 
                                    onClick={() => setShowDeleteModal(false)}
                                    className="p-1 hover:bg-white/5 rounded-lg transition-colors text-gray-400"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">
                                ¿Borrar todos los datos?
                            </h3>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Esta acción eliminará permanentemente todas las predicciones almacenadas y reseteará las métricas de salud del cliente en el dashboard. **Esta acción no se puede deshacer.**
                            </p>

                            <div className="flex gap-4">
                                <Button 
                                    className="flex-1 bg-white/5 hover:bg-white/10 border-white/10 text-white"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isClearing}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    variant="alert"
                                    className="flex-1"
                                    onClick={handleClearData}
                                    disabled={isClearing}
                                >
                                    {isClearing ? 'Borrando...' : 'Sí, Borrar Todo'}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.aside>
    );
}
