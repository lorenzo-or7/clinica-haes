import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { clinic, photos, reviews } from '../data/clinic';
import { Photo } from './ui/Photo';
import { Reveal } from './ui/Reveal';
import { ArrowLeft, ArrowRight, Star } from './ui/Icons';

/**
 * Depoimentos em composição editorial: foto do ambiente à esquerda (não é o autor),
 * citação ampla à direita com controles discretos. Todas as citações ocupam a mesma célula
 * de grade, então a altura do painel é a da maior e não salta na troca.
 */
export function Reviews() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = reviews.length;
  const go = (d: number) => setIndex((i) => (i + d + count) % count);
  const current = reviews[index];

  return (
    <section id="avaliacoes" className="section reviews" aria-labelledby="reviews-title">
      <div className="container">
        <Reveal className="center-head">
          <p className="eyebrow eyebrow--center">Avaliações</p>
          <h2 id="reviews-title">O que dizem sobre a HAES.</h2>
          <p className="reviews__rating">
            <span className="reviews__stars" role="img" aria-label={`Nota ${clinic.rating} de 5`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} width={16} height={16} />
              ))}
            </span>
            <span>
              <strong>{clinic.rating}</strong> nas avaliações de pacientes
            </span>
          </p>
        </Reveal>

        <Reveal className="reviews__layout" y={32}>
          <div className="reviews__photo">
            <Photo photo={photos.detalhes} decorative sizes="(min-width: 900px) 34vw, 100vw" />
          </div>
          <div className="reviews__panel">
            <span className="reviews__mark" aria-hidden="true">
              “
            </span>
            <div className="reviews__stage" aria-live="polite">
              {/* espaço reservado pela maior citação */}
              {reviews.map((r) => (
                <figure key={r.author} className="reviews__ghost" aria-hidden="true">
                  <blockquote>
                    <p>{r.text}</p>
                  </blockquote>
                  <figcaption>— {r.author}</figcaption>
                </figure>
              ))}
              <AnimatePresence mode="wait" initial={false}>
                <motion.figure
                  key={current.author}
                  className="reviews__quote"
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <blockquote>
                    <p>{current.text}</p>
                  </blockquote>
                  <figcaption>— {current.author}</figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
            <div className="reviews__controls">
              <button type="button" className="round-btn" aria-label="Depoimento anterior" onClick={() => go(-1)}>
                <ArrowLeft width={18} height={18} />
              </button>
              <p className="reviews__count" aria-hidden="true">
                {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </p>
              <button type="button" className="round-btn" aria-label="Próximo depoimento" onClick={() => go(1)}>
                <ArrowRight width={18} height={18} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
