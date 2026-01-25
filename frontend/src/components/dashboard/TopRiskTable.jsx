import { motion } from 'framer-motion';
import { AlertCircle, User, Calendar, DollarSign, Clock } from 'lucide-react';
import { clsx } from 'clsx';

export default function TopRiskTable({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="p-10 text-center text-gray-500 italic bg-navy-deep/40 rounded-3xl border border-white/5">
                No hay clientes detectados en riesgo actualmente.
            </div>
        );
    }

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return 'N/A';
        }
    };

    return (
        <div className="bg-navy-deep/60 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-gray-400 text-[10px] uppercase font-mono tracking-widest">
                        <tr>
                            <th className="p-5 border-b border-white/10">Cliente</th>
                            <th className="p-5 border-b border-white/10">Nivel Riesgo</th>
                            <th className="p-5 border-b border-white/10">Probabilidad</th>
                            <th className="p-5 border-b border-white/10">Antigüedad</th>
                            <th className="p-5 border-b border-white/10">Uso Mensual</th>
                            <th className="p-5 border-b border-white/10">Fecha Detectado</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {data.map((client, idx) => (
                            <motion.tr
                                key={client.id || idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="hover:bg-white/5 transition-colors border-b border-white/5 group"
                            >
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-neon-cyan/20 group-hover:text-neon-cyan transition-colors">
                                            <User size={14} />
                                        </div>
                                        <span className="font-mono text-white/90">ID-{client.id || 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <span className={clsx(
                                        "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                                        client.riskLevel === 'alto' ? "bg-alert-red/20 text-alert-red border border-alert-red/30" :
                                        client.riskLevel === 'medio' ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30" :
                                        "bg-green-500/20 text-green-500 border border-green-500/30"
                                    )}>
                                        {client.riskLevel}
                                    </span>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full max-w-[60px] overflow-hidden">
                                            <div 
                                                className={clsx(
                                                    "h-full rounded-full transition-all duration-1000",
                                                    client.probabilidad > 0.66 ? "bg-alert-red" : "bg-yellow-500"
                                                )}
                                                style={{ width: `${client.probabilidad * 100}%` }}
                                            />
                                        </div>
                                        <span className="font-mono text-xs text-white">{(client.probabilidad * 100).toFixed(1)}%</span>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <Clock size={14} className="text-gray-500" />
                                        <span>{client.tiempoContratoMeses} meses</span>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-1.5 text-neon-cyan">
                                        <DollarSign size={14} />
                                        <span className="font-mono uppercase text-sm">${client.usoMensual?.toFixed(1)}</span>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                        <Calendar size={12} />
                                        <span>{formatDate(client.createdAt)}</span>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
