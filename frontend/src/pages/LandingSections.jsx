import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TrendingUp, Users, Github, Linkedin } from 'lucide-react';

function FlagIcon({ code, size = 16 }) {
    const style = { fontSize: size, lineHeight: 1 };
    const map = { GT: '🇬🇹', MX: '🇲🇽', PE: '🇵🇪', CO: '🇨🇴' };
    const emoji = map[code] || '🏁';
    return <span style={style} aria-label={`${code} flag`}>{emoji}</span>;
}

export function OperatingBrainSection() {
    return (
        <section className="py-16 px-6 max-w-7xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-3">Cerebro Operativo</h2>
                <p className="text-gray-400">Arquitectura desacoplada para predicciones confiables y rápidas.</p>
            </div>
        </section>
    );
}

export function ApiIntegrationSection() {
    return (
        <section className="py-16 px-6 max-w-7xl mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-3">Integración de API</h2>
                <p className="text-gray-400">Backend Spring + DS Flask con documentación Swagger.</p>
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
                <Card className="flex flex-col items-center p-8 bg-white/5 border-white/10">
                    <TrendingUp size={32} className="text-neon-cyan mb-4" />
                    <div className="text-4xl font-bold text-white mb-2">+22%</div>
                    <div className="text-gray-400 font-medium">Retención de Clientes</div>
                </Card>
                <Card className="flex flex-col items-center p-8 bg-white/5 border-white/10">
                    <Users size={32} className="text-green-400 mb-4" />
                    <div className="text-4xl font-bold text-white mb-2">3.5x</div>
                    <div className="text-gray-400 font-medium">ROI Estimado (Year 1)</div>
                </Card>
                <Card className="flex flex-col items-center p-8 bg-white/5 border-white/10">
                    <Users size={32} className="text-alert-red mb-4" />
                    <div className="text-4xl font-bold text-white mb-2">-45%</div>
                    <div className="text-gray-400 font-medium">Tasa de Deserción</div>
                </Card>
            </div>
        </section>
    );
}

export function TeamSection() {
    const team = [
        { name: 'Hugo Arias', role: 'Project Manager & Backend Lead', flagCode: 'GT', img: '/profile-pictures/Hugo.jpg', github: 'https://github.com/shigerubt', linkedin: 'https://www.linkedin.com/in/shigerubt/' },
        { name: 'Agueda J. Guzman', role: 'Backend Manager', flagCode: 'MX', img: '/profile-pictures/Agueda.jpeg', linkedin: 'https://www.linkedin.com/in/agueda-talavera-42a2a42a5/' },
        { name: 'Jhon A. Alonzo Huamán', role: 'DS Strategy Manager', flagCode: 'PE', img: '/profile-pictures/Jhon.jpeg', linkedin: 'https://www.linkedin.com/in/jalonzoh/' },
        { name: 'Heriberto Turpo Quiro', role: 'Data Scientist', flagCode: 'PE', img: '/profile-pictures/Heriberto.jpg', linkedin: 'https://www.linkedin.com/in/heriberto-turpo-quiro/' },
        { name: 'Gabriel Franco', role: 'Pitch Speaker', flagCode: 'CO', img: '/profile-pictures/Gabriel.jpeg', linkedin: 'https://www.linkedin.com/in/lgab/' },
        { name: 'Roxana Z. Bautista', role: 'Backend Engineer', flagCode: 'MX', img: '/profile-pictures/Roxi.jpeg', linkedin: 'https://www.linkedin.com/in/roxana-zaricell-bautista-lopez-651a5526b/' },
        { name: 'Vanessa S. Angulo', role: 'Backend Engineer', flagCode: 'MX', img: '/profile-pictures/Vane.jpeg', linkedin: 'https://www.linkedin.com/in/vanessaangulose/' },
        { name: 'Kevin S. Morales', role: 'Backend Engineer', flagCode: 'CO', img: '/profile-pictures/Kevin.jpeg', linkedin: 'https://www.linkedin.com/in/kevin-morales-6431b72a2' }
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
                                                <Card key={idx} className="group p-6 text-center border-white/5">
                                                        <div className="w-20 h-20 mx-auto rounded-full bg-white/5 mb-6 flex items-center justify-center overflow-hidden border border-white/10">
                                                                {member.img ? (
                                                                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <Users className="text-gray-500" size={28} />
                                                                )}
                                                        </div>
                            <h3 className="text-sm font-bold text-white leading-tight h-10 flex items-center justify-center gap-2">
                                <span>{member.name}</span>
                                {member.flagCode && <span className="inline-flex items-center"><FlagIcon code={member.flagCode} size={14} /></span>}
                            </h3>
                            <p className="text-[10px] text-neon-cyan mt-1 mb-4 uppercase tracking-widest font-mono">
                                {member.role}
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

export function InsideTheMachineSection() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <section className="relative px-6">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <Button variant="glass" className="text-sm px-4 py-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? 'Ocultar Detalles' : 'Ver Detalles'}
                </Button>
                {isOpen && (
                    <div className="mt-6 p-6 border border-white/10 rounded bg-white/5 w-full max-w-5xl">
                        <p className="text-gray-300">Arquitectura, flujo de datos y decisiones clave del proyecto.</p>
                    </div>
                )}
            </div>
        </section>
    );
}

export function CtaSection() {
    return (
        <section className="py-16 px-6 text-center">
            <Button className="px-8 py-3">Comenzar Ahora</Button>
        </section>
    );
}
 
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
