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
    { name: 'Hugo Arias', role: 'Project Manager & Backend Lead', flagCode: 'GT', github: 'https://github.com/shigerubt', linkedin: 'https://www.linkedin.com/in/shigerubt/' },
    { name: 'Agueda J. Guzman', role: 'Backend Manager', flagCode: 'MX', linkedin: 'https://www.linkedin.com/in/agueda-talavera-42a2a42a5/' },
    { name: 'Jhon A. Alonzo Huamán', role: 'DS Strategy Manager', flagCode: 'PE', linkedin: 'https://www.linkedin.com/in/jalonzoh/' },
    { name: 'Heriberto Turpo Quiro', role: 'Data Scientist', flagCode: 'PE', linkedin: 'https://www.linkedin.com/in/heriberto-turpo-quiro/' },
    { name: 'Gabriel Franco', role: 'Pitch Speaker', flagCode: 'CO', linkedin: 'https://www.linkedin.com/in/lgab/' },
    { name: 'Roxana Z. Bautista', role: 'Backend Engineer', flagCode: 'MX', linkedin: 'https://www.linkedin.com/in/roxana-zaricell-bautista-lopez-651a5526b/' },
    { name: 'Vanessa S. Angulo', role: 'Backend Engineer', flagCode: 'MX', linkedin: 'https://www.linkedin.com/in/vanessaangulose/' },
    { name: 'Kevin S. Morales', role: 'Backend Engineer', flagCode: 'CO', linkedin: 'https://www.linkedin.com/in/kevin-morales-6431b72a2' }
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
                <Users className="text-gray-500" size={28} />
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
