import { useRef } from 'react';
import { motion, useReducedMotion, useTransform } from 'motion/react';
import { useSectionProgress } from '../lib/hooks';
import { photos } from '../data/clinic';
import { Photo } from './ui/Photo';
import { Reveal } from './ui/Reveal';
import { ArrowRight } from './ui/Icons';

/**
 * CTA fotográfico de largura ampla (papel do bloco equivalente da referência).
 * Entrada por fade-up do conteúdo, como observado. O deslocamento leve da foto com a
 * rolagem é uma aproximação: o parallax da referência não foi medido.
 */
export function WideCta() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const scrollYProgress = useSectionProgress(ref, 'pass');
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section className="wide-cta" aria-labelledby="wide-cta-title">
      <div className="wide-cta__frame" ref={ref}>
        <motion.div className="wide-cta__media" style={reduce ? undefined : { y }}>
          <Photo photo={photos.simboloParede} decorative sizes="100vw" style={{ objectPosition: '40% 46%' }} />
        </motion.div>
        <div className="wide-cta__shade" aria-hidden="true" />
        <Reveal className="wide-cta__content" y={30} duration={0.9}>
          <p className="wide-cta__eyebrow">Pré-agendamento</p>
          <h2 id="wide-cta-title">
            Seu próximo cuidado <em>começa aqui.</em>
          </h2>
          <p className="wide-cta__text">Escolha o assunto, indique uma data se quiser e envie pelo WhatsApp.</p>
          <a className="btn btn--light" href="#pre-agendamento">
            Solicitar avaliação
            <ArrowRight />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
