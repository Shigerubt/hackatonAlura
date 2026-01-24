import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { apiFetch } from '../../utils/api';

export default function Overview({ refreshKey }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Se agrega un parámetro t para evitar el cache del navegador coincidiendo con un reinicio manual
            const response = await apiFetch(`/churn/stats?t=${new Date().getTime()}`);
            const data = await response.json();
            setStats(data);
        } catch (err) {
            setError('Error al conectar con la API de estadísticas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [refreshKey]);

    const cards = [
        { 
            label: 'Total Analizados', 
            value: stats?.total_predicciones || 0, 
            icon: Users, 
            color: 'text-neon-cyan',
            desc: 'Clientes procesados por el sistema'
        },
        { 
            label: 'Tasa de Churn', 
            value: `${((stats?.tasa_churn || 0) * 100).toFixed(1)}%`, 
            icon: TrendingUp, 
            color: 'text-alert-red',
            desc: 'Promedio de fuga predicha'
        },
        { 
            label: 'Riesgo Alto', 
            value: stats?.por_riesgo?.alto || 0, 
            icon: AlertTriangle, 
            color: 'text-yellow-500', 
            desc: 'Casos urgentes detectados'
        },
        { 
            label: 'Riesgo Bajo/Seguro', 
            value: (stats?.por_riesgo?.bajo || 0) + (stats?.por_riesgo?.medio || 0), 
            icon: ShieldCheck, 
            color: 'text-green-400', 
            desc: 'Clientes con salud estable'
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                        Métricas de Salud del Cliente
                    </h2>
                    <p className="text-gray-400">Datos agregados de todas las predicciones realizadas.</p>
                </div>
                <button 
                    onClick={fetchStats}
                    className="p-3 bg-white/5 rounded-full hover:bg-neon-cyan/10 transition-colors group"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin text-neon-cyan' : 'text-gray-400'} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-navy-deep/40 border border-white/5 p-6 rounded-2xl backdrop-blur-sm relative group hover:border-white/10 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${card.color}`}>
                                <card.icon size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">
                            {loading ? '...' : card.value}
                        </h3>
                        <p className="text-gray-400 text-sm font-medium">{card.label}</p>
                        <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest">{card.desc}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                <div className="bg-navy-deep/60 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <div className="w-1 h-6 bg-neon-cyan rounded-full" />
                        Distribución por Geografía
                    </h3>
                    <div className="space-y-6">
                        {stats?.geografias ? Object.entries(stats.geografias).map(([geo, count]) => (
                            <div key={geo} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-300">{geo}</span>
                                    <span className="text-white font-mono">{count} pred.</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(count / stats.total_predicciones) * 100}%` }}
                                        className="h-full bg-neon-cyan" 
                                    />
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 italic text-center py-10">Aún no hay datos geográficos...</p>
                        )}
                    </div>
                </div>

                <div className="bg-navy-deep/60 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <div className="w-1 h-6 bg-alert-red rounded-full" />
                        Resumen de Entrenamiento
                    </h3>
                    <div className="p-4 bg-black/20 border border-white/5 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-neon-cyan/5 flex items-center justify-center text-neon-cyan">
                            <RefreshCw size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-tighter">Última Predicción</p>
                            <p className="text-white font-mono text-sm">{stats?.ultima_prediccion ? new Date(stats.ultima_prediccion).toLocaleString() : 'N/A'}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-6 leading-relaxed">
                        El motor de ChurnAlert utiliza un modelo de Random Forest entrenado con el dataset Telco. Las predicciones actuales se basan en la versión 2.1 del pipeline.
                    </p>
                </div>
            </div>
        </div>
    );
}
