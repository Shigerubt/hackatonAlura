import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, TrendingDown, Target, Zap } from 'lucide-react';
import insightBot from '../../assets/insight-bot.png';

export default function InsightPanel({ customer, onClose }) {
    if (!customer) return null;

    const churnProb = customer.probabilidad || 0;
    const isHighRisk = churnProb > 0.75;

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-[400px] bg-[#0A192F]/95 backdrop-blur-xl border-l border-white/10 z-50 p-6 shadow-2xl overflow-y-auto"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
            >
                <X size={20} />
            </button>

            <div className="mt-8 flex flex-col items-center text-center">
                <div className="relative mb-6">
                    <img src={insightBot} className="w-24 h-24 object-contain drop-shadow-[0_0_20px_rgba(100,255,218,0.3)]" alt="Bot" />
                    <div className="absolute -bottom-2 right-0 bg-neon-cyan text-navy-deep text-[10px] font-bold px-2 py-0.5 rounded-full">
                        AI AGENT
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">Análisis de Cliente</h2>
                <p className="font-mono text-neon-cyan">{customer.prevision}</p>
            </div>

            <div className="mt-8 space-y-6">
                {/* Risk Meter */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-gray-400 text-sm mb-2 font-medium uppercase">Probabilidad de Fuga</h3>
                    <div className="flex items-end gap-2">
                        <span className={`text-4xl font-bold ${isHighRisk ? 'text-alert-red' : 'text-neon-cyan'}`}>
                            {(churnProb * 100).toFixed(1)}%
                        </span>
                        <span className="text-sm text-gray-500 mb-1">Score Calculado</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${isHighRisk ? 'bg-alert-red' : 'bg-neon-cyan'}`}
                            style={{ width: `${churnProb * 100}%` }}
                        />
                    </div>
                </div>

                {/* Factors */}
                <div>
                    <h3 className="text-gray-400 text-sm mb-4 font-medium uppercase flex items-center gap-2">
                        <Target size={16} className="text-neon-cyan" /> Factores Críticos
                    </h3>
                    {customer.topFeatures && customer.topFeatures.length > 0 ? (
                        <ul className="space-y-3">
                            {customer.topFeatures.map((feature, idx) => (
                                <li key={idx} className="p-3 rounded bg-white/5 text-sm flex gap-3 text-gray-300">
                                    <TrendingDown className="text-alert-red shrink-0" size={18} />
                                    <span>
                                        <strong className="text-white">Impacto detectado:</strong> {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No hay factores específicos detallados por el modelo.</p>
                    )}
                </div>

                {/* Recommendation */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-transparent border border-neon-cyan/20">
                    <h3 className="text-neon-cyan font-bold mb-2 flex items-center gap-2">
                        <Bot size={18} /> Recomendación Insight-Bot
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {isHighRisk 
                            ? "Se recomienda intervención inmediata. Ofrecer plan de retención personalizado basado en el historial de uso."
                            : "Mantener monitoreo estándar. El cliente muestra una salud de cuenta estable por el momento."
                        }
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
