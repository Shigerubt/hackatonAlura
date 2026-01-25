import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertTriangle, ShieldCheck, RefreshCw, BarChart2, PieChart } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import TopRiskTable from './TopRiskTable';

export default function Overview({ refreshKey }) {
    const [stats, setStats] = useState(null);
    const [topRisk, setTopRisk] = useState([]);
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

    const fetchTopRisk = async () => {
        try {
            const response = await apiFetch('/churn/predictions/top-risk');
            const data = await response.json();
            setTopRisk(data);
        } catch (err) {
            console.error('Error al cargar top risk:', err);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchTopRisk();
    }, [refreshKey]);

    const riskData = [
        { name: 'Bajo', value: stats?.por_riesgo?.bajo || 0, color: '#10b981' },
        { name: 'Medio', value: stats?.por_riesgo?.medio || 0, color: '#f59e0b' },
        { name: 'Alto', value: stats?.por_riesgo?.alto || 0, color: '#ef4444' }
    ];

    const churnVsContinueData = [
        { name: 'Continúan', value: (stats?.total_predicciones || 0) - (stats?.cancelaciones || 0), color: '#64ffda' },
        { name: 'V. a Cancelar', value: stats?.cancelaciones || 0, color: '#f87171' }
    ];

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
                        <BarChart2 size={20} className="text-neon-cyan" />
                        Distribución de Riesgo
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={riskData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#94a3b8" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="#94a3b8" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <Tooltip 
                                    cursor={{fill: '#ffffff05'}}
                                    contentStyle={{ 
                                        backgroundColor: '#0a192f', 
                                        border: '1px solid #ffffff10',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {riskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-navy-deep/60 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <PieChart size={20} className="text-alert-red" />
                        Churn vs Continúan
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={churnVsContinueData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    stroke="#94a3b8" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <Tooltip 
                                    cursor={{fill: '#ffffff05'}}
                                    contentStyle={{ 
                                        backgroundColor: '#0a192f', 
                                        border: '1px solid #ffffff10',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                                    {churnVsContinueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="mt-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <AlertTriangle size={20} className="text-yellow-500" />
                            Top 20 Clientes con Mayor Riesgo
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">Clientes priorizados por probabilidad de cancelación inmediata.</p>
                    </div>
                </div>
                
                <TopRiskTable data={topRisk} />
            </div>

            <div className="bg-navy-deep/60 border border-white/10 p-8 rounded-3xl backdrop-blur-md mt-10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-neon-cyan rounded-full" />
                    Información del Modelo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="p-4 bg-black/20 border border-white/5 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-neon-cyan/5 flex items-center justify-center text-neon-cyan">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-tighter">Estado del Motor</p>
                            <p className="text-white font-mono text-sm leading-tight">Activo y Protegido</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">V2.1 Pipeline</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        El motor de ChurnAlert utiliza un modelo de Random Forest entrenado con el dataset Telco. 
                        Las predicciones actuales se basan en el análisis de 19 variables de comportamiento y contrato.
                    </p>
                </div>
            </div>
        </div>
    );
}
