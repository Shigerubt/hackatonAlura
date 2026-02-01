import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';
import logo from '../assets/Churn Alert Shield.png';
import { OperatingBrainSection, ApiIntegrationSection, RoiSection, TeamSection, CtaSection, InsideTheMachineSection } from './LandingSections';

export default function LandingPage({ onLaunch }) {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col bg-navy-deep selection:bg-neon-cyan selection:text-navy-deep">
            {/* Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-alert-red/5 rounded-full blur-[100px]" />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="text-2xl font-bold tracking-tighter text-white">Churn<span className="text-neon-cyan">Alert</span></span>
                </a>
                <Button variant="glass" className="text-sm px-4 py-2" onClick={onLaunch}>Acceder</Button>
            </nav>

            <div className="relative z-10">
                {/* Hero Section */}
                <main className="flex flex-col items-center justify-center p-6 text-center max-w-6xl mx-auto mt-10 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                            Anticipa el Futuro <br /> de tus Clientes
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
                            Tus clientes te están enviando señales de despedida. ¿Estás escuchando?
                            <br />
                            Churn Alert traduce el silencio de tus datos en acciones de rescate inmediatas.
                        </p>

                        <Button onClick={onLaunch} className="mt-8 text-lg px-10 py-4 shadow-[0_0_30px_rgba(100,255,218,0.3)]">
                            Lanzar Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                </main>

                {/* New Feature Sections */}
                <OperatingBrainSection />
                <ApiIntegrationSection />
                <RoiSection />
                <TeamSection />
                <InsideTheMachineSection />
                <CtaSection />
            </div>

            <footer className="relative z-10 py-8 text-center text-gray-500 text-sm border-t border-white/5 mt-12">
                <p>© 2026 ChurnAlert. All rights reserved.</p>
            </footer>
        </div>
    );
}
