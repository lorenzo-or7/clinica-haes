import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { asset } from '../data/clinic';
import { supportsObserver, useInViewOnce } from '../lib/hooks';
import { Reveal } from './ui/Reveal';
import { Parallax } from './ui/Motion';
import { ArrowRight } from './ui/Icons';

/**
 * Pausa editorial entre tratamentos e catálogo: texto e botão de um lado, recorte da foto
 * da parede do outro, com o símbolo inteiro e livre de texto. A foto se revela pela lateral
 * uma única vez; com movimento reduzido aparece direto.
 */
export function WideCta() {
  const reduce = useReducedMotion();
  const animate = !reduce && supportsObserver();
  const mediaRef = useRef<HTMLElement>(null);
  // revelação única; o hook revela mesmo se o observador falhar
  const seen = useInViewOnce(mediaRef, 0.3);
  const revealed = !animate || seen;

  const image = (
    <img
      src={asset('photos/parede-recorte.webp')}
      alt="Símbolo da HAES em metal na parede da clínica"
      width={900}
      height={720}
      loading="lazy"
      decoding="async"
    />
  );

  return (
    <section className="invite-band" aria-labelledby="invite-band-title">
      <div className="container invite-band__grid">
        <Reveal className="invite-band__copy" y={24}>
          <p className="eyebrow">Pré-agendamento</p>
          <h2 id="invite-band-title">Uma conversa é o primeiro passo.</h2>
          <p className="invite-band__text">
            Diga o que você procura e, se quiser, indique uma data. A equipe confirma pelo WhatsApp.
          </p>
          <a className="btn btn--primary" href="#pre-agendamento">
            Solicitar avaliação
            <ArrowRight />
          </a>
        </Reveal>

        <figure ref={mediaRef} className={`invite-band__media ${revealed ? 'is-revealed' : ''}`}>
          <div className="invite-band__reveal">
            <Parallax amount={8}>{image}</Parallax>
          </div>
        </figure>
      </div>
    </section>
  );
}
