import { clsx } from 'clsx';
import { Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResultsTable({ data, onSelectCustomer }) {
    const displayData = data || [];

    return (
        <div className="bg-navy-deep/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
            <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 text-gray-400 text-sm uppercase font-mono tracking-wider">
                    <tr>
                        <th className="p-4 border-b border-white/10">Index</th>
                        <th className="p-4 border-b border-white/10">Previsión</th>
                        <th className="p-4 border-b border-white/10">Riesgo Churn</th>
                        <th className="p-4 border-b border-white/10">Timestamp</th>
                        <th className="p-4 border-b border-white/10">Acción</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {displayData.map((row, idx) => {
                        const churnProb = row.probabilidad || 0;
                        const isHighRisk = churnProb > 0.75;
                        const isSafe = churnProb < 0.25;

                        return (
                            <motion.tr
                                key={idx}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hover:bg-white/5 transition-colors border-b border-white/5"
                            >
                                <td className="p-4 font-mono text-white/80">#{idx + 1}</td>
                                <td className="p-4 text-gray-300">{row.prevision}</td>
                                <td className="p-4">
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit",
                                        isHighRisk ? "bg-alert-red/20 text-alert-red border border-alert-red/30" :
                                            isSafe ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20" :
                                                "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                    )}>
                                        {isHighRisk && <AlertCircle size={12} />}
                                        {isSafe && <CheckCircle size={12} />}
                                        {(churnProb * 100).toFixed(1)}%
                                    </span>
                                </td>
                                <td className="p-4 text-gray-400">
                                    {row.timestamp ? new Date(row.timestamp).toLocaleTimeString() : '-'}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => onSelectCustomer(row)}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-neon-cyan hover:text-navy-deep text-gray-400 transition-all"
                                        title="Ver Insight"
                                    >
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </motion.tr>
                        );
                    })}
                </tbody>
            </table>
            {displayData.length === 0 && (
                <div className="p-10 text-center text-gray-500 italic">
                    No hay datos para mostrar.
                </div>
            )}
        </div>
    );
}
