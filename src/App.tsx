import { useCallback, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { GENERAL_EVALUATION, treatmentOptions } from './data/clinic';
import { useTheme } from './lib/hooks';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AttributesStrip } from './components/AttributesStrip';
import { ClinicStory } from './components/ClinicStory';
import { Treatments } from './components/Treatments';
import { WideCta } from './components/WideCta';
import { Catalog } from './components/Catalog';
import { Gallery } from './components/Gallery';
import { HaesIdentity } from './components/HaesIdentity';
import { Team } from './components/Team';
import { Reviews } from './components/Reviews';
import { FAQ } from './components/FAQ';
import { Location } from './components/Location';
import { PreAppointment } from './components/PreAppointment';
import { Footer } from './components/Footer';

export default function App() {
  const [theme, setTheme] = useTheme();
  const [treatment, setTreatment] = useState(GENERAL_EVALUATION);

  // CTA do painel de tratamento: preenche o formulário e leva ao pré-agendamento
  const requestTreatment = useCallback((name: string) => {
    // "Clareamento" (catálogo) corresponde à opção "Clareamento dental" do formulário
    const option = treatmentOptions.find((o) => o === name) ?? treatmentOptions.find((o) => o.startsWith(name)) ?? GENERAL_EVALUATION;
    setTreatment(option);
    requestAnimationFrame(() => {
      const target = document.getElementById('pre-agendamento');
      if (!target) return;
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      document.getElementById('booking-treatment')?.focus({ preventScroll: true });
    });
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Navbar theme={theme} onThemeChange={setTheme} />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <AttributesStrip />
        <ClinicStory />
        <Treatments onRequest={requestTreatment} />
        <WideCta />
        <Catalog onRequest={requestTreatment} />
        <HaesIdentity />
        <Reviews />
        <Team />
        <FAQ />
        <Gallery />
        <Location />
        <PreAppointment treatment={treatment} onTreatmentChange={setTreatment} />
      </main>
      <Footer />
    </MotionConfig>
  );
}
