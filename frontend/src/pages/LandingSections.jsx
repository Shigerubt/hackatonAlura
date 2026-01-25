import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Terminal, Cpu, Database, Network, TrendingUp, Users, ArrowRight, Github, Linkedin, CalendarCheck, Code2, Lock, Zap, ChevronDown, Activity, Server, Scale } from 'lucide-react';
import insightBot from '../assets/insight-bot.png';

// Import team images
import hugoImg from '../assets/team/Hugo.jpg';
import gabrielImg from '../assets/team/Gabriel.jpeg';
import roxiImg from '../assets/team/Roxi.jpeg';
import aguedaImg from '../assets/team/Agueda.jpeg';
import kevinImg from '../assets/team/Kevin.jpeg';
import jhonImg from '../assets/team/Jhon.jpeg';

export function OperatingBrainSection() {
    return (
        <section className="relative py-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-xs font-mono uppercase tracking-widest border border-neon-cyan/20">
                    <Cpu size={14} />
                    <span>Comando Central v1.00</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    El Cerebro Operativo: <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500">Insight-Bot</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                    No es solo un modelo de datos; es un agente que interpreta patrones de comportamiento humano.
                    Analiza variables de uso, pagos y satisfacción en milisegundos para entregarte una hoja de ruta de rescate.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Sistema Online</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" /> Procesando Datos</span>
                </div>
            </div>

            <div className="flex-1 relative flex justify-center">
                {/* Scanning Effect Container */}
                <div className="relative w-[300px] md:w-[400px] h-[400px]">
                    <motion.div
                        animate={{
                            boxShadow: ["0 0 20px rgba(100,255,218,0.2)", "0 0 50px rgba(100,255,218,0.4)", "0 0 20px rgba(100,255,218,0.2)"]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-gradient-to-b from-neon-cyan/5 to-transparent blur-3xl"
                    />
                    <img src={insightBot} alt="Insight Bot" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_30px_rgba(100,255,218,0.3)]" />

                    {/* Scanning Line */}
                    <motion.div
                        initial={{ top: "10%", opacity: 0 }}
                        animate={{ top: "90%", opacity: [0, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-neon-cyan shadow-[0_0_15px_#64ffda] z-20"
                    />

                    {/* Floating Data Particles */}
                    <div className="absolute top-1/2 left-[-20%] p-3 bg-navy-deep/90 border border-neon-cyan/30 rounded-lg backdrop-blur-md shadow-xl z-20">
                        <div className="text-xs text-neon-cyan font-mono">Risk: High</div>
                        <div className="text-[10px] text-gray-400">ID: 94821</div>
                    </div>
                    <div className="absolute bottom-[20%] right-[-10%] p-3 bg-navy-deep/90 border border-alert-red/30 rounded-lg backdrop-blur-md shadow-xl z-20">
                        <div className="text-xs text-alert-red font-mono">Churn: 92%</div>
                        <div className="text-[10px] text-gray-400">Alert Sent</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function ApiIntegrationSection() {
    return (
        <section className="bg-navy-deep/50 border-y border-white/5 py-24 px-6 md:px-0">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1 relative">
                    <div className="absolute inset-0 bg-neon-cyan/5 blur-3xl rounded-full" />
                    <Card className="relative bg-[#0a0f1c] border-white/10 p-0 overflow-hidden shadow-2xl">
                        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <div className="ml-2 text-xs text-gray-400 font-mono">api-integration.js</div>
                        </div>
                        <div className="p-6 font-mono text-sm text-gray-300 overflow-x-auto">
                            <pre>
                                <span className="text-purple-400">const</span> <span className="text-blue-400">churnAlert</span> = <span className="text-purple-400">new</span> <span className="text-yellow-400">Predictor</span>({'{'}
                                apiKey: <span className="text-green-400">"sk_live_..."</span>,
                                model: <span className="text-green-400">"v2.0-turbo"</span>
                                {'}'});

                                <span className="text-gray-500">// Real-time prediction</span>
                                <span className="text-purple-400">const</span> <span className="text-blue-400">risk</span> = <span className="text-purple-400">await</span> <span className="text-blue-400">churnAlert</span>.<span className="text-yellow-400">analyze</span>({'{'}
                                userId: <span className="text-green-400">"usr_123"</span>,
                                signals: [<span className="text-green-400">"late_payment"</span>, <span className="text-green-400">"ticket_volume"</span>]
                                {'}'});

                                <span className="text-blue-400">console</span>.<span className="text-yellow-400">log</span>(<span className="text-blue-400">risk</span>.score); <span className="text-gray-500">// 0.94</span>
                            </pre>
                        </div>
                    </Card>
                </div>

                <div className="order-1 md:order-2 space-y-8">
                    <h2 className="text-4xl font-bold text-white">
                        Poder Predictivo, <br />
                        <span className="text-gray-500">vía JSON.</span>
                    </h2>
                    <p className="text-lg text-gray-400">
                        Implementa nuestra API de forma nativa en tu CRM, ERP o App móvil.
                        Documentación robusta para integraciones en Java, Python y Node.js.
                        El cliente no tiene que cambiar su forma de trabajar.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-gray-300">
                            <div className="p-2 rounded bg-neon-cyan/10 text-neon-cyan"><Zap size={18} /></div>
                            <span>Latencia mínima (&#60;50ms)</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <div className="p-2 rounded bg-neon-cyan/10 text-neon-cyan"><Lock size={18} /></div>
                            <span>Seguridad end-to-end (AES-256)</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <div className="p-2 rounded bg-neon-cyan/10 text-neon-cyan"><Code2 size={18} /></div>
                            <span>Zero-downtime integration</span>
                        </li>
                    </ul>
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

export function TeamSection() {
    const team = [
        { 
            name: "Hugo Arias", 
            role: "Project Manager & Backend Lead", 
            image: hugoImg,
            linkedin: "https://www.linkedin.com/in/shigerubt/",
            github: "https://github.com/shigerubt"
        },
        { 
            name: "Agueda J. Guzman", 
            role: "Backend Manager", 
            image: aguedaImg,
            linkedin: "https://www.linkedin.com/in/agueda-guzman-talavera-42a2a242a5" 
        },
        { 
            name: "Jhon A. Alonzo Huamán", 
            role: "DS Strategy Manager", 
            image: jhonImg,
            linkedin: "https://www.linkedin.com/in/jalonzoh/" 
        },
        { 
            name: "Heriberto Turpo Quiro", 
            role: "Data Scientist", 
            linkedin: "https://www.linkedin.com/in/heriberto-turpo-quiro/" 
        },
        { 
            name: "Gabriel Franco", 
            role: "Data Scientist", 
            image: gabrielImg,
            linkedin: "https://www.linkedin.com/in/lgab/" 
        },
        { 
            name: "Roxana Z. Bautista", 
            role: "Backend Engineer", 
            image: roxiImg,
            linkedin: "https://www.linkedin.com/in/roxana-zaricell-bautista-lopez-651a5526b/" 
        },
        { 
            name: "Vanessa S. Angulo", 
            role: "Backend Engineer", 
            linkedin: "https://www.linkedin.com/in/vanessasangulose" 
        },
        { 
            name: "Kevin S. Morales", 
            role: "Backend Engineer", 
            image: kevinImg,
            linkedin: "https://www.linkedin.com/in/kevin-morales-6431b72a2" 
        },
    ];

    return (
        <section className="py-24 px-6 border-t border-white/5 bg-navy-deep">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Meet the Sentinels</h2>
                    <p className="text-gray-400">Los arquitectos detrás de la predicción y los guardianes de la retención.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {team.map((member, idx) => (
                        <Card key={idx} className="group p-6 text-center border-white/5 hover:border-neon-cyan/50 transition-colors">
                            <div className="w-20 h-20 mx-auto rounded-full bg-white/5 mb-6 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-neon-cyan transition-colors">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Users className="text-gray-500 group-hover:text-neon-cyan" size={28} />
                                )}
                            </div>
                            <h3 className="text-sm font-bold text-white leading-tight h-10 flex items-center justify-center">{member.name}</h3>
                            <p className="text-[10px] text-neon-cyan mt-1 mb-4 uppercase tracking-widest font-mono">{member.role}</p>
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

                                <div className="max-w-5xl mx-auto space-y-20">

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
                                            <h3 className="text-3xl font-bold text-white">Robust Scaling & Outlier Resilience</h3>
                                            <p className="text-gray-400 leading-relaxed border-l-2 border-neon-cyan/20 pl-4">
                                                La precisión de Churn Alert nace de un pipeline de datos sofisticado. Nuestro modelo integra un preprocesamiento avanzado que utiliza <span className="text-white font-semibold">Robust Scaling</span> para neutralizar el ruido en variables determinantes como <span className="font-mono text-sm bg-white/5 px-1 rounded">tenure</span> y <span className="font-mono text-sm bg-white/5 px-1 rounded">TotalCharges</span>.
                                            </p>
                                            <p className="text-gray-400 leading-relaxed">
                                                A diferencia de modelos estándar, nuestro modelo es resiliente a valores atípicos, permitiendo que la antigüedad del cliente y sus patrones de facturación se analicen con una escala de magnitud real. Esto garantiza que un pico inusual en los cargos mensuales no genere una falsa alarma, sino un análisis contextual preciso basado en el historial histórico del usuario.
                                            </p>

                                            <div className="p-4 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                                                <p className="text-sm text-gray-300 italic">
                                                    <span className="text-neon-cyan font-bold not-italic mr-2">Simple:</span>
                                                    "Imagina que el modelo es un detective experto que ha visto miles de casos de abandono. No mira un solo dato, sino que conecta los puntos: si un cliente cambia su frecuencia de uso y además tiene un retraso en pago, el detective levanta la bandera roja antes de que el cliente decida irse."
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
                                                        <span>FEATURE_IMPORTANCE_MAP</span>
                                                        <span>v2.1</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <div className="flex justify-between mb-1 text-gray-300"><span>TotalCharges</span> <span>0.98</span></div>
                                                            <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[98%] bg-neon-cyan" /></div>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between mb-1 text-gray-300"><span>Tenure</span> <span>0.85</span></div>
                                                            <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[85%] bg-blue-500" /></div>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between mb-1 text-gray-300"><span>MonthlyCharges</span> <span>0.72</span></div>
                                                            <div className="h-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[72%] bg-purple-500" /></div>
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

                <Button className="mx-auto text-xl px-12 py-6 h-auto shadow-[0_0_50px_rgba(100,255,218,0.2)] hover:shadow-[0_0_80px_rgba(100,255,218,0.4)]">
                    <CalendarCheck className="mr-3" />
                    Reserva una Sesión Estratégica
                </Button>
            </div>
        </section>
    );
}
