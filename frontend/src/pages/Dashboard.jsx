import { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import BulkUpload from '../components/dashboard/BulkUpload';
import ResultsTable from '../components/dashboard/ResultsTable';
import InsightPanel from '../components/dashboard/InsightPanel';
import Overview from '../components/dashboard/Overview';
import SinglePrediction from '../components/dashboard/SinglePrediction';
import Settings from '../components/dashboard/Settings';
import { AnimatePresence, motion } from 'framer-motion';

export default function Dashboard({ onBack, onLogout, user, onProfileUpdate }) {
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'batch' | 'single' | 'settings'
    const [viewState, setViewState] = useState('upload'); // 'upload' | 'results'
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [results, setResults] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleUploadComplete = (data) => {
        setResults(data);
        setViewState('results');
        setRefreshKey(prev => prev + 1);
    };

    const handleDataCleared = () => {
        setResults(null);
        setViewState('upload');
        setRefreshKey(prev => prev + 1);
    };

    const handleBackToUpload = () => {
        setViewState('upload');
    };

    return (
        <div className="flex h-screen bg-navy-deep text-white overflow-hidden font-sans">
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                    setActiveTab(tab);
                    setViewState('upload');
                    setSelectedCustomer(null);
                }} 
                onBack={onBack} 
                onLogout={onLogout}
                onDataCleared={handleDataCleared}
            />

            <main className="flex-1 relative overflow-hidden flex flex-col">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[100px]" />
                </div>

                {/* Navbar/Top bar */}
                <div className="relative z-20 px-8 h-16 flex justify-between items-center border-b border-white/5 bg-navy-deep/60 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-neon-cyan/20 flex items-center justify-center text-neon-cyan border border-neon-cyan/30 text-xs font-bold uppercase shadow-[0_0_15px_rgba(100,255,218,0.1)]">
                            {user?.username?.substring(0, 2) || 'JD'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-white font-semibold leading-tight">
                                {user?.username || 'Analista'}
                            </span>
                            <span className="text-[10px] text-neon-cyan/70 font-mono tracking-wider uppercase">
                                Autenticado
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="text-gray-400 hover:text-alert-red transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-alert-red/10 border border-transparent hover:border-alert-red/20"
                    >
                        Cerrar Sesión
                    </button>
                </div>

                {/* Content Area */}
                <div className="relative z-10 flex-1 p-8 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'dashboard' && <Overview refreshKey={refreshKey} />}

                            {activeTab === 'batch' && (
                                <>
                                    <header className="mb-8 flex items-center justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                                Carga Masiva de Clientes
                                                {viewState === 'results' && (
                                                    <span className="text-sm font-normal text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                                        Resultados del Análisis
                                                    </span>
                                                )}
                                            </h1>
                                            <p className="text-gray-400 mt-1">
                                                {viewState === 'upload'
                                                    ? 'Arrastra tu dataset para predecir el riesgo de fuga.'
                                                    : 'Visualizando predicciones procesadas recientemente.'}
                                            </p>
                                        </div>

                                        {viewState === 'results' && (
                                            <button
                                                onClick={handleBackToUpload}
                                                className="text-neon-cyan hover:text-white underline text-sm"
                                            >
                                                Procesar Nuevo Archivo
                                            </button>
                                        )}
                                    </header>

                                    <div className="w-full max-w-7xl mx-auto">
                                        {viewState === 'upload' ? (
                                            <BulkUpload onUploadComplete={handleUploadComplete} />
                                        ) : (
                                            <ResultsTable 
                                                data={results?.items} 
                                                onSelectCustomer={setSelectedCustomer} 
                                            />
                                        )}
                                    </div>
                                </>
                            )}

                            {activeTab === 'single' && (
                                <SinglePrediction onPredictionSuccess={() => setRefreshKey(prev => prev + 1)} />
                            )}

                            {activeTab === 'settings' && (
                                <Settings user={user} onProfileUpdate={onProfileUpdate} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Insight Panel Sidebar */}
                <AnimatePresence>
                    {selectedCustomer && (
                        <InsightPanel
                            customer={selectedCustomer}
                            onClose={() => setSelectedCustomer(null)}
                        />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

