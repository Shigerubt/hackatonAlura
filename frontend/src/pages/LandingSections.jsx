import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Terminal, Cpu, Database, Network, TrendingUp, Users, ArrowRight, Github, Linkedin, CalendarCheck, Code2, Lock, Zap, ChevronDown, Activity, Server, Scale, Mic } from 'lucide-react';
import { 
    SiPython, SiFlask, SiScikitlearn, SiPandas, SiOpenjdk, SiSpring, SiOpenapiinitiative, SiDocker, 
    SiReact, SiVite, SiTailwindcss, SiFramer, SiMysql, SiApachemaven, SiStreamlit, SiPostman, SiInsomnia, SiSwagger 
} from 'react-icons/si';
import insightBot from '../assets/insight-bot.png';

// Minimal SVG flags (approximate) for team nationality badges
function FlagIcon({ code, size = 16 }) {
    const w = size;
    const h = Math.round(size * 0.75);
    switch (code) {
        case 'GT': // Guatemala (blue-white-blue)
            return (
                <svg width={w} height={h} viewBox="0 0 3 2" aria-label="Guatemala flag">
                    <rect width="1" height="2" x="0" y="0" fill="#4997D0" />
                    <rect width="1" height="2" x="1" y="0" fill="#ffffff" />
                    <rect width="1" height="2" x="2" y="0" fill="#4997D0" />
                </svg>
            );
        case 'MX': // Mexico (green-white-red)
            return (
                <svg width={w} height={h} viewBox="0 0 3 2" aria-label="Mexico flag">
                    <rect width="1" height="2" x="0" y="0" fill="#006847" />
                    <rect width="1" height="2" x="1" y="0" fill="#ffffff" />
                    <rect width="1" height="2" x="2" y="0" fill="#CE1126" />
                </svg>
            );
        case 'PE': // Peru (red-white-red)
            return (
                <svg width={w} height={h} viewBox="0 0 3 2" aria-label="Peru flag">
                    <rect width="1" height="2" x="0" y="0" fill="#D91023" />
                    <rect width="1" height="2" x="1" y="0" fill="#ffffff" />
                    <rect width="1" height="2" x="2" y="0" fill="#D91023" />
                </svg>
            );
        case 'CO': // Colombia (yellow-blue-red)
            return (
                <svg width={w} height={h} viewBox="0 0 3 2" aria-label="Colombia flag">
                    <rect width="3" height="1" x="0" y="0" fill="#FCD116" />
                    <rect width="3" height="0.5" x="0" y="1" fill="#003893" />
                    <rect width="3" height="0.5" x="0" y="1.5" fill="#CE1126" />
                </svg>
            );
        default:
            return null;
    }
}

export function OperatingBrainSection() {
    return (
        <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    <div className="flex items-center gap-3 text-neon-cyan mb-3">
                        <Cpu size={22} />
                        <span className="font-mono text-xs tracking-widest uppercase">Cerebro Operativo</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">XGBoost para anticipar el abandono</h2>
                    <p className="text-gray-400 leading-relaxed">
                        Entrenado sobre 20 variables canónicas, el modelo XGBoost captura relaciones no lineales e interacciones clave como contrato, tenure y seguridad online.
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <Card className="p-4 bg-white/5 border-white/10">
                            <div className="text-2xl font-bold text-white">20</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Variables</div>
                        </Card>
                        <Card className="p-4 bg-white/5 border-white/10">
                            <div className="text-2xl font-bold text-white">ms</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Latencia baja</div>
                        </Card>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
                    <Card className="p-6 bg-[#0a0f1c] border-white/10 text-center">
                        <img src={insightBot} alt="Insight Bot" className="mx-auto w-48 h-48 object-contain" />
                        <p className="text-gray-400 text-sm mt-4">Inferencia rápida y explicable para decisiones de retención.</p>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}

export function ApiIntegrationSection() {
    return (
        <section className="py-20 px-6 border-t border-white/5 bg-[#070c16]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    <div className="flex items-center gap-3 text-blue-400 mb-3">
                        <Network size={22} />
                        <span className="font-mono text-xs tracking-widest uppercase">Integración API</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Gateway Spring Boot + DS Flask</h2>
                    <p className="text-gray-400 leading-relaxed">
                        Endpoints protegidos con JWT, documentación viva con Swagger/OpenAPI y soporte para lotes CSV. Lista para producción con healthchecks y métricas.
                    </p>
                    <div className="mt-6 flex gap-3">
                            {(() => {
                                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
                                const apiOrigin = apiUrl.replace(/\/api\/?$/, '');
                                const apiDocs = import.meta.env.VITE_API_DOCS_URL || `${apiOrigin}/swagger-ui/index.html`;
                                const dsDocs = import.meta.env.VITE_DS_DOCS_URL || 'http://localhost:8000/apidocs';
                                return (
                                    <>
                                        <a href={apiDocs} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 text-gray-300 hover:text-white hover:border-neon-cyan/50 bg-white/5">
                                            <SiSwagger className="text-green-400" /> Swagger UI
                                        </a>
                                        <a href={dsDocs} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 text-gray-300 hover:text-white hover:border-neon-cyan/50 bg-white/5">
                                            <SiOpenapiinitiative className="text-neon-cyan" /> DS Docs
                                        </a>
                                    </>
                                );
                            })()}
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
                    <Card className="p-6 bg-[#0a0f1c] border-white/10">
                        <ul className="text-sm text-gray-300 space-y-2 font-mono">
                            <li className="flex items-center gap-2"><Lock size={14} className="text-neon-cyan" /><span>JWT y reglas claras de autorización</span></li>
                            <li className="flex items-center gap-2"><Zap size={14} className="text-neon-cyan" /><span>Baja latencia, lotes 7k+</span></li>
                            <li className="flex items-center gap-2"><Server size={14} className="text-alert-red" /><span>Spring Boot + Flask</span></li>
                        </ul>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}

export function TeamSection() {
    const team = [
        { name: 'Hugo Arias', role: 'Project Manager & Backend Lead', img: '/profile-pictures/Hugo.jpg', github: 'https://github.com/shigerubt', linkedin: 'https://www.linkedin.com/in/shigerubt/', flagCode: 'GT' },
        { name: 'Agueda J. Guzman', role: 'Backend Manager', img: '/profile-pictures/Agueda.jpeg', linkedin: 'https://www.linkedin.com/in/agueda-talavera-42a2a42a5/', flagCode: 'MX' },
        { name: 'Jhon A. Alonzo Huamín', role: 'DS Strategy Manager', img: '/profile-pictures/Jhon.jpeg', linkedin: 'https://www.linkedin.com/in/jalonzoh/', flagCode: 'PE' },
        { name: 'Heriberto Turpo Quiro', role: 'Data Scientist', img: '/profile-pictures/Heriberto.jpg', linkedin: 'https://www.linkedin.com/in/heriberto-turpo-quiro/', flagCode: 'PE' },
        { name: 'Gabriel Franco', role: 'Pitch Speaker', img: '/profile-pictures/Gabriel.jpeg', linkedin: 'https://www.linkedin.com/in/lgab/', flagCode: 'CO' },
        { name: 'Roxana Z. Bautista', role: 'Backend Engineer', img: '/profile-pictures/Roxi.jpeg', linkedin: 'https://www.linkedin.com/in/roxana-zaricell-bautista-lopez-651a5526b/', flagCode: 'MX' },
        { name: 'Vanessa S. Angulo', role: 'Backend Engineer', img: '/profile-pictures/Vane.jpeg', linkedin: 'https://www.linkedin.com/in/vanessaangulose/', flagCode: 'MX' },
        { name: 'Kevin S. Morales', role: 'Backend Engineer', img: '/profile-pictures/Kevin.jpeg', linkedin: 'https://www.linkedin.com/in/kevin-morales-6431b72a2', flagCode: 'CO' },
    ];

    return (
        <section className="py-24 px-6 border-t border-white/5 bg-navy-deep">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Meet the Sentinels</h2>
                    <p className="text-gray-400">Arquitectos de la predicción y guardianes de la retención.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {team.map((member, idx) => (
                        <Card key={idx} className="group p-6 text-center border-white/5 hover:border-neon-cyan/50 transition-colors">
                            <div className="w-20 h-20 mx-auto rounded-full bg-white/5 mb-6 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-neon-cyan transition-colors relative">
                                {member.img ? (
                                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Users className="text-gray-500 group-hover:text-neon-cyan" size={28} />
                                )}
                                {member.role === 'Pitch Speaker' && (
                                    <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white/10 border border-neon-cyan/40 text-neon-cyan shadow">
                                        <Mic size={12} />
                                    </span>
                                )}
                            </div>
                            <h3 className="text-sm font-bold text-white leading-tight h-10 flex items-center justify-center gap-2">
                                <span>{member.name}</span>
                                {member.flagCode && (
                                    <span className="inline-flex items-center"><FlagIcon code={member.flagCode} size={14} /></span>
                                )}
                            </h3>
                            <p className="text-[10px] text-neon-cyan mt-1 mb-4 uppercase tracking-widest font-mono flex items-center justify-center gap-1">
                                {member.role === 'Pitch Speaker' && <Mic size={12} className="text-neon-cyan" />}
                                <span>{member.role === 'Pitch Speaker' ? 'Data Scientist • Pitch Speaker' : member.role}</span>
                            </p>
                            <div className="flex justify-center gap-4 text-gray-400">
                                {member.github && (
                                    <a href={member.github} target="_blank" rel="noopener noreferrer">
                                        <Github size={16} className="hover:text-white transition-colors" />
                                    </a>
                                )}
                                {member.linkedin && (
                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                        <Linkedin size={16} className="hover:text-white transition-colors" />
                                    </a>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

 

export function RoiSection() {
    return (
        <section className="py-24 px-6 max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                ¿Cuánto dinero estás <br />
                <span className="text-alert-red">dejando sobre la mesa?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                Nuestras simulaciones muestran un aumento del 22% en la retención durante el primer trimestre.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="flex flex-col items-center p-8 bg-gradient-to-b from-white/5 to-transparent border-white/10">
                    <div className="p-4 rounded-full bg-neon-cyan/10 text-neon-cyan mb-4">
                        <TrendingUp size={32} />
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">+22%</div>
                    <div className="text-gray-400 font-medium">Retención de Clientes</div>
                </Card>

                <Card className="flex flex-col items-center p-8 bg-gradient-to-b from-white/5 to-transparent border-white/10 transform scale-105 border-neon-cyan/30 shadow-[0_0_30px_rgba(100,255,218,0.1)]">
                    <div className="p-4 rounded-full bg-green-500/10 text-green-400 mb-4">
                        <Database size={32} />
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">3.5x</div>
                    <div className="text-gray-400 font-medium">ROI Estimado (Year 1)</div>
                </Card>

                <Card className="flex flex-col items-center p-8 bg-gradient-to-b from-white/5 to-transparent border-white/10">
                    <div className="p-4 rounded-full bg-alert-red/10 text-alert-red mb-4">
                        <Users size={32} />
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">-45%</div>
                    <div className="text-gray-400 font-medium">Tasa de Deserción</div>
                </Card>
            </div>
        </section>
    );
}

 

export function InsideTheMachineSection() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <section className="relative px-6">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* Sentinel Arrow */}


                {/* Collapsible Content */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="w-full overflow-hidden"
                        >
                            <div className="pt-20 pb-24 border-t border-white/10 mt-[-28px] relative bg-gradient-to-b from-navy-deep to-[#050b14]">
                                {/* Background Tech Pattern */}
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />

                                {/* Monday.com CTA at the top of collapsible content */}
                                <div className="max-w-5xl mx-auto pt-6">
                                    <div className="mb-8 flex justify-center">
                                        <a
                                            href="https://shigerubt.monday.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Organización del equipo en Monday Dev"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/10 text-gray-200 hover:text-white hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(100,255,218,0.2)] transition-colors bg-white/5"
                                        >
                                            <Network size={18} className="text-[#1F9E8A]" />
                                            <span className="text-sm font-medium">Organización del equipo en Monday Dev</span>
                                            <ArrowRight size={14} className="opacity-70" />
                                        </a>
                                    </div>
                                </div>

                                <div className="max-w-5xl mx-auto space-y-20">
                                    {/* Section 0: Introducción & Planteamiento */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center gap-3 text-neon-cyan mb-2">
                                                <Network size={24} />
                                                <span className="font-mono text-sm tracking-widest uppercase">Contexto del Proyecto</span>
                                            </div>
                                            <h3 className="text-3xl font-bold text-white">Introducción & Planteamiento</h3>
                                            <p className="text-gray-400 leading-relaxed">
                                                Las empresas pierden clientes sin señales claras. El objetivo de <span className="text-white font-semibold">Churn Alert</span> es anticipar el abandono y activar acciones de retención con datos confiables y tiempos de respuesta mínimos.
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="p-4 bg-white/5 rounded border border-white/10">
                                                    <div className="flex items-center gap-2 text-alert-red mb-1"><Activity size={16} /><span className="font-mono text-xs uppercase">Problema</span></div>
                                                    <p className="text-sm text-gray-300">Alta tasa de cancelación y señales dispersas; difícil detectar riesgo a tiempo.</p>
                                                </div>
                                                <div className="p-4 bg-white/5 rounded border border-white/10">
                                                    <div className="flex items-center gap-2 text-neon-cyan mb-1"><TrendingUp size={16} /><span className="font-mono text-xs uppercase">Objetivo</span></div>
                                                    <p className="text-sm text-gray-300">Predecir probabilidad de churn y clasificar riesgo para priorizar acciones.</p>
                                                </div>
                                                <div className="p-4 bg-white/5 rounded border border-white/10">
                                                    <div className="flex items-center gap-2 text-blue-400 mb-1"><Cpu size={16} /><span className="font-mono text-xs uppercase">Abordaje</span></div>
                                                    <p className="text-sm text-gray-300">Arquitectura desacoplada: DS en Python y API en Java; validación estricta y lotes CSV.</p>
                                                </div>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <Card className="bg-[#0a0f1c] p-6 border-white/10">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                                                        <span>project_overview.md</span>
                                                        <span className="ml-auto">v1.0</span>
                                                    </div>
                                                    <ul className="text-sm text-gray-300 space-y-2">
                                                        <li className="flex items-center gap-2"><Lock size={14} className="text-neon-cyan" /><span>Endpoints protegidos con JWT</span></li>
                                                        <li className="flex items-center gap-2"><Zap size={14} className="text-neon-cyan" /><span>Latencia baja y lote 7k+ registros</span></li>
                                                        <li className="flex items-center gap-2"><Server size={14} className="text-alert-red" /><span>API Spring Boot + DS Flask</span></li>
                                                    </ul>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    </div>

                                    {/* Section 1: Data Pipeline */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center gap-3 text-neon-cyan mb-2">
                                                <Scale size={24} />
                                                <span className="font-mono text-sm tracking-widest uppercase">Análisis Técnico del Modelo</span>
                                            </div>
                                            <h3 className="text-3xl font-bold text-white">XGBoost: Gradient Boosted Trees para Churn</h3>
                                            <p className="text-gray-400 leading-relaxed border-l-2 border-neon-cyan/20 pl-4">
                                                El modelo final de <span className="text-white font-semibold">Churn Alert</span> es <span className="text-white font-semibold">XGBoost</span>, un ensamble de árboles potenciados por gradiente que corrige iterativamente errores. Captura relaciones no lineales e interacciones entre variables como <span className="font-mono text-sm bg-white/5 px-1 rounded">Contract</span>, <span className="font-mono text-sm bg-white/5 px-1 rounded">tenure</span> y <span className="font-mono text-sm bg-white/5 px-1 rounded">OnlineSecurity</span>, ofreciendo alta precisión en datos tabulares.
                                            </p>
                                            <p className="text-gray-400 leading-relaxed">
                                                La regularización (L1/L2), la profundidad máxima y el <em>learning rate</em> controlan la complejidad y reducen el sobreajuste. La importancia de variables se reporta vía <em>gain</em> y <em>cover</em>, guiando decisiones sobre los principales impulsores del churn.
                                            </p>

                                            <div className="p-4 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                                                <p className="text-sm text-gray-300 italic">
                                                    <span className="text-neon-cyan font-bold not-italic mr-2">Simple:</span>
                                                    "Un comité de árboles donde cada nuevo árbol aprende de los errores del anterior; juntos votan una predicción más fuerte y precisa sobre el abandono."
                                                </p>
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <Card className="bg-[#0a0f1c] p-6 border-neon-cyan/20">
                                                <div className="space-y-4 font-mono text-xs">
                                                    <div className="flex justify-between text-gray-500 pb-2 border-b border-white/5">
                                                        <span>XGBOOST_IMPORTANCE (gain)</span>
                                                        <span>v3.0</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <div className="flex justify-between mb-1 text-gray-300"><span>Contract</span> <span>0.31</span></div>
                                                            <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[31%] bg-neon-cyan" /></div>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between mb-1 text-gray-300"><span>tenure</span> <span>0.27</span></div>
                                                            <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[27%] bg-blue-500" /></div>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between mb-1 text-gray-300"><span>OnlineSecurity</span> <span>0.18</span></div>
                                                            <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[18%] bg-purple-500" /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    </div>

                                    {/* Section 2: Backend & Organization */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 }}
                                            className="order-2 md:order-1"
                                        >
                                            <Card className="bg-[#0a0f1c] p-6 border-alert-red/20 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                                    <Activity size={100} className="text-alert-red" />
                                                </div>
                                                <div className="relative z-10 space-y-4">
                                                    <div className="flex items-center gap-3 mb-6">
                                                        <div className="p-3 bg-alert-red/10 rounded text-alert-red"><Server size={24} /></div>
                                                        <div>
                                                            <h4 className="text-white font-bold">Arquitectura Desacoplada</h4>
                                                            <p className="text-xs text-gray-500">Spring Boot API Gateway</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="p-3 bg-white/5 rounded text-center">
                                                            <div className="text-2xl font-bold text-white">7k+</div>
                                                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Registros/Lote</div>
                                                        </div>
                                                        <div className="p-3 bg-white/5 rounded text-center">
                                                            <div className="text-2xl font-bold text-white">6</div>
                                                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Sprints Totales</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="space-y-6 order-1 md:order-2"
                                        >
                                            <div className="flex items-center gap-3 text-alert-red mb-2">
                                                <Code2 size={24} />
                                                <span className="font-mono text-sm tracking-widest uppercase">La Forja del Backend</span>
                                            </div>
                                            <h3 className="text-3xl font-bold text-white">Sinergia Humana</h3>
                                            <p className="text-gray-400 leading-relaxed">
                                                El equipo de Backend construyó el puente de alta velocidad entre la predicción y tu negocio. Utilizando **Java y Spring Boot**, crearon una API capaz de recibir volúmenes masivos de datos. Este proyecto nació de una sinergia humana-artificial: utilizamos herramientas de IA de vanguardia para optimizar el código y asegurar que el sistema soporte cargas de más de 7,000 registros con latencia mínima.
                                            </p>

                                            <div className="space-y-2">
                                                <h4 className="text-white font-semibold flex items-center gap-2"><div className="w-1.5 h-1.5 bg-alert-red rounded-full" /> Organización Hackaton</h4>
                                                <p className="text-gray-400 text-sm">
                                                    "6 Sprints. 1 Meta. El equipo se organizó mediante una arquitectura desacoplada: mientras Data Science refinaba el cerebro (Python), Backend preparaba los nervios (Java API), permitiendo una integración nativa y escalable en tiempo récord."
                                                </p>
                                            </div>

                                            
                                        </motion.div>
                                    </div>

                                    {/* Section 3: Tecnologías del Proyecto (embebido) */}
                                    <div className="pt-6">
                                        <TechnologiesSection embedded />
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sentinel Arrow */}
                <div className="relative -mt-6 z-20">
                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        className="p-3 rounded-full bg-navy-deep border border-neon-cyan/30 text-neon-cyan shadow-[0_0_20px_rgba(100,255,218,0.3)] hover:shadow-[0_0_40px_rgba(100,255,218,0.5)] transition-shadow"
                    >
                        <ChevronDown size={32} />
                    </motion.button>
                </div>
            </div>
        </section>
    );
}

export function CtaSection() {
    return (
        <section className="py-32 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-navy-deep to-[#02050a]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                    Deja de adivinar por qué <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500">tus clientes se van.</span>
                </h2>
                <p className="text-xl text-gray-400 mb-12">
                    Tus clientes te están enviando señales de despedida. ¿Estás escuchando?
                    <br />
                    Churn Alert traduce el silencio de tus datos en acciones de rescate inmediatas.
                </p>

                <Button 
                    onClick={() => alert("¡Simulación finalizada! Agradecemos profundamente a Alura Latam y Oracle por la oportunidad otorgada en este Hackathon.")}
                    className="mx-auto text-xl px-12 py-6 h-auto shadow-[0_0_50px_rgba(100,255,218,0.2)] hover:shadow-[0_0_80px_rgba(100,255,218,0.4)]"
                >
                    <CalendarCheck className="mr-3" />
                    Reserva una Sesión Estratégica
                </Button>
            </div>
        </section>
    );
}

// Nueva sección: Tecnologías del Proyecto
export function TechnologiesSection({ embedded = false }) {
    const categories = [
        {
            name: 'Data Science',
            color: 'text-neon-cyan',
            icon: <Cpu size={18} />,
            items: [
                { t: 'Python 3.10+', d: 'Lenguaje base del microservicio DS; prototipa y despliega modelos rápidamente.', Icon: SiPython },
                { t: 'Flask 3', d: 'Microframework que expone el modelo vía HTTP con rutas ligeras y mantenibles.', Icon: SiFlask },
                { t: 'scikit-learn', d: 'Entrenamiento, métricas y pipelines reproducibles para datos tabulares.', Icon: SiScikitlearn },
                { t: 'pandas', d: 'Procesa y valida las 20 variables canónicas con operaciones vectorizadas.', Icon: SiPandas },
                { t: 'XGBoost', d: 'Modelo eficiente y preciso para clasificación con explicabilidad básica.' },
                { t: 'joblib', d: 'Serializa el pipeline para cargar en producción sin reentrenar.' },
            ],
        },
        {
            name: 'Backend',
            color: 'text-alert-red',
            icon: <Server size={18} />,
            items: [
                { t: 'Java 17', d: 'LTS estable y performante; base de la API con mejoras modernas de GC.', Icon: SiOpenjdk },
                { t: 'Spring Boot 3', d: 'Arranque rápido, configuración mínima y observabilidad integrada.', Icon: SiSpring },
                { t: 'Spring Security', d: 'Protege endpoints con JWT y reglas de autorización claras.', Icon: SiSpring },
                { t: 'Spring Data JPA', d: 'Persistencia con repositorios declarativos para auditoría de predicciones.', Icon: SiSpring },
                { t: 'Validation', d: 'Ergonomía para errores 400 claros y por campo en requests.', Icon: SiSpring },
                { t: 'OpenAPI (springdoc)', d: 'Swagger UI para documentación viva y pruebas manuales.', Icon: SiOpenapiinitiative },
                { t: 'Swagger UI', d: 'Explora y prueba endpoints desde el navegador con UI interactiva.', Icon: SiSwagger },
                { t: 'Commons CSV', d: 'Parseo robusto de lotes y evaluación por archivos CSV.' },
                { t: 'JJWT', d: 'Firma y verificación estándar de tokens para sesiones seguras.' },
                { t: 'Actuator', d: 'Healthchecks y métricas para monitoreo y readiness.', Icon: SiSpring },
                { t: 'H2 / MySQL', d: 'H2 acelera desarrollo; MySQL soporta despliegues productivos.', Icon: SiMysql },
            ],
        },
        {
            name: 'Frontend',
            color: 'text-blue-400',
            icon: <Code2 size={18} />,
            items: [
                { t: 'React 19', d: 'UI declarativa y componible; experiencia fluida para landing y demo.', Icon: SiReact },
                { t: 'Vite 7', d: 'Dev server veloz y build optimizado para despliegue.', Icon: SiVite },
                { t: 'Tailwind CSS 4', d: 'Diseño consistente y escalable sin salir de JSX.', Icon: SiTailwindcss },
                { t: 'Framer Motion', d: 'Animaciones suaves que refuerzan narrativa sin penalizar rendimiento.', Icon: SiFramer },
                { t: 'Recharts', d: 'Gráficas ligeras para métricas y tendencias de churn.' },
                { t: 'Lucide Icons', d: 'Iconografía clara y accesible que guía la interacción.' },
            ],
        },
        {
            name: 'Infra & Otros',
            color: 'text-gray-400',
            icon: <Network size={18} />,
            items: [
                { t: 'Docker', d: 'Empaqueta servicios y dependencias; mismo entorno de dev a prod.', Icon: SiDocker },
                { t: 'Docker Compose', d: 'Orquesta API, DS y dashboard con un solo comando.', Icon: SiDocker },
                { t: 'Maven Wrapper', d: 'Build reproducible del backend sin instalaciones previas.', Icon: SiApachemaven },
                { t: 'Streamlit', d: 'Dashboard para demos y pruebas de negocio en minutos.', Icon: SiStreamlit },
                { t: 'Postman', d: 'Colecciones que estandarizan QA y validaciones de endpoints.', Icon: SiPostman },
                { t: 'Insomnia', d: 'Cliente REST alternativo para pruebas rápidas y repetibles.', Icon: SiInsomnia },
            ],
        },
    ];

    const content = (
        <>
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                    <Terminal size={14} />
                    <span>Stack Técnico</span>
                </div>
                <h2 className="text-4xl font-bold text-white mt-4">Tecnologías del Proyecto</h2>
                <p className="text-gray-400 mt-2">Stack curado para velocidad, seguridad y mantenibilidad.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat, i) => (
                    <Card key={i} className="p-5 bg-[#0a0f1c] border-white/10 hover:border-neon-cyan/30 transition-colors">
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`p-2 rounded bg-white/5 ${cat.color}`}>{cat.icon}</div>
                            <h3 className="text-white font-semibold">{cat.name}</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-300">
                            {cat.items.map((it, j) => (
                                <li key={j} className="leading-snug flex items-start gap-2">
                                    {it.Icon ? (
                                        <span className="mt-[1px] text-gray-300 bg-white/5 rounded p-0.5"><it.Icon size={16} /></span>
                                    ) : (
                                        <span className="mt-1 w-1.5 h-1.5 bg-white/40 rounded-full inline-block" />
                                    )}
                                    <span><span className="text-white font-medium">{it.t}</span> — {it.d}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </div>
        </>
    );

    if (embedded) {
        return (
            <div className="pt-10">
                {content}
            </div>
        );
    }

    return (
        <section className="py-24 px-6 border-t border-white/5 bg-[#070c16]">
            <div className="max-w-7xl mx-auto">
                {content}
            </div>
        </section>
    );
}
