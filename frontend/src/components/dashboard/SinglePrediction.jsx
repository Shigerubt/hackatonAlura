import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Send, User, CreditCard, Activity, Globe, Zap, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { apiFetch } from '../../utils/api';
import InsightPanel from './InsightPanel';

export default function SinglePrediction({ onPredictionSuccess }) {
    const [formData, setFormData] = useState({
        gender: 'Male',
        SeniorCitizen: 0,
        Partner: 'No',
        Dependents: 'No',
        tenure: 1,
        PhoneService: 'No',
        MultipleLines: 'No',
        InternetService: 'DSL',
        OnlineSecurity: 'No',
        OnlineBackup: 'No',
        DeviceProtection: 'No',
        TechSupport: 'No',
        StreamingTV: 'No',
        StreamingMovies: 'No',
        Contract: 'Month-to-month',
        PaperlessBilling: 'No',
        PaymentMethod: 'Electronic check',
        MonthlyCharges: 50.0,
        TotalCharges: 50.0
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showInsight, setShowInsight] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'SeniorCitizen' || name === 'tenure' ? parseInt(value) : 
                    name === 'MonthlyCharges' || name === 'TotalCharges' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPrediction(null);

        try {
            const response = await apiFetch('/churn/predict', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error en la predicción');
            
            setPrediction(data);
            setShowInsight(true);
            if (onPredictionSuccess) onPredictionSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const sections = [
        {
            title: 'Perfil del Cliente',
            icon: User,
            fields: [
                { name: 'gender', label: 'Género', type: 'select', options: ['Male', 'Female'] },
                { name: 'SeniorCitizen', label: 'Adulto Mayor', type: 'select', options: [{ l: 'Si', v: 1 }, { l: 'No', v: 0 }] },
                { name: 'Partner', label: 'Tiene Pareja', type: 'select', options: ['Yes', 'No'] },
                { name: 'Dependents', label: 'Tiene Dependientes', type: 'select', options: ['Yes', 'No'] }
            ]
        },
        {
            title: 'Contrato y Pagos',
            icon: CreditCard,
            fields: [
                { name: 'tenure', label: 'Antigüedad (Meses)', type: 'number' },
                { name: 'Contract', label: 'Tipo Contrato', type: 'select', options: ['Month-to-month', 'One year', 'Two year'] },
                { name: 'PaperlessBilling', label: 'Factura Digital', type: 'select', options: ['Yes', 'No'] },
                { name: 'PaymentMethod', label: 'Metodo de Pago', type: 'select', options: ['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)'] }
            ]
        },
        {
            title: 'Servicios de Internet',
            icon: Globe,
            fields: [
                { name: 'InternetService', label: 'Servicio Internet', type: 'select', options: ['DSL', 'Fiber optic', 'No'] },
                { name: 'OnlineSecurity', label: 'Seguridad Online', type: 'select', options: ['Yes', 'No', 'No internet service'] },
                { name: 'OnlineBackup', label: 'Backup Online', type: 'select', options: ['Yes', 'No', 'No internet service'] },
                { name: 'DeviceProtection', label: 'Protección Dispositivo', type: 'select', options: ['Yes', 'No', 'No internet service'] }
            ]
        },
        {
            title: 'Servicios Adicionales',
            icon: Zap,
            fields: [
                { name: 'TechSupport', label: 'Soporte Técnico', type: 'select', options: ['Yes', 'No', 'No internet service'] },
                { name: 'StreamingTV', label: 'Streaming TV', type: 'select', options: ['Yes', 'No', 'No internet service'] },
                { name: 'StreamingMovies', label: 'Streaming Películas', type: 'select', options: ['Yes', 'No', 'No internet service'] },
                { name: 'PhoneService', label: 'Servicio Telefónico', type: 'select', options: ['Yes', 'No'] }
            ]
        }
    ];

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold mb-2">Análisis Individual</h2>
                <p className="text-gray-400">Ingresa las variables del cliente para un diagnóstico en tiempo real.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-navy-deep/40 border border-white/5 p-6 rounded-2xl backdrop-blur-sm"
                        >
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-3 text-neon-cyan">
                                <section.icon size={20} />
                                {section.title}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {section.fields.map(field => (
                                    <div key={field.name} className="space-y-1.5">
                                        <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">{field.label}</label>
                                        {field.type === 'select' ? (
                                            <select
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-neon-cyan transition-all appearance-none cursor-pointer"
                                            >
                                                {field.options.map(opt => (
                                                    <option key={typeof opt === 'object' ? opt.v : opt} value={typeof opt === 'object' ? opt.v : opt}>
                                                        {typeof opt === 'object' ? opt.l : opt}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type="number"
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-neon-cyan transition-all"
                                                min="0"
                                                step={field.name.includes('Charges') ? "0.01" : "1"}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-navy-deep/60 border border-white/10 p-8 rounded-2xl backdrop-blur-md">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-neon-cyan">
                        <Activity size={20} /> Cargos Financieros
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Cargos Mensuales</label>
                            <input
                                type="range"
                                name="MonthlyCharges"
                                min="18"
                                max="120"
                                step="0.5"
                                value={formData.MonthlyCharges}
                                onChange={handleChange}
                                className="w-full accent-neon-cyan"
                            />
                            <div className="flex justify-between text-xs font-mono text-neon-cyan">
                                <span>$18.00</span>
                                <span>${formData.MonthlyCharges.toFixed(2)}</span>
                                <span>$120.00</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Cargos Totales Estimados</label>
                            <input
                                type="number"
                                name="TotalCharges"
                                value={formData.TotalCharges}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-neon-cyan transition-all"
                                step="0.01"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    {error && (
                        <p className="text-alert-red text-sm flex items-center gap-2 bg-alert-red/10 px-4 py-2 rounded-lg border border-alert-red/20 animate-shake">
                            <AlertCircle size={16} /> {error}
                        </p>
                    )}
                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full max-w-sm py-4 rounded-xl text-lg flex items-center justify-center gap-3 group"
                    >
                        {loading ? 'Consultando IA...' : 'Ejecutar Predicción'}
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                </div>
            </form>

            <AnimatePresence>
                {showInsight && (
                    <InsightPanel 
                        customer={prediction} 
                        onClose={() => {
                            setShowInsight(false);
                            setPrediction(null);
                        }} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
