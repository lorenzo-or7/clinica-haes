import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { googlePlace, reviews } from '../data/clinic';
import { Reveal } from './ui/Reveal';
import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from './ui/Icons';

/**
 * Avaliações em bloco editorial compacto: um depoimento por vez, autor e controles logo
 * abaixo, nota e link do Google no topo. Sem foto e sem alturas mínimas: o espaço reservado
 * é só o da maior citação (as citações ocupam a mesma célula da grade).
 */
export function Reviews() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = reviews.length;
  const go = (d: number) => setIndex((i) => (i + d + count) % count);
  const current = reviews[index];

  return (
    <section id="avaliacoes" className="section section--tight reviews2" aria-labelledby="reviews-title">
      <div className="container reviews2__wrap">
        <Reveal className="reviews2__head" y={20}>
          <div>
            <p className="eyebrow">Avaliações</p>
            <h2 id="reviews-title">O que dizem sobre a HAES.</h2>
          </div>
          <div className="reviews2__score">
            <p className="reviews2__rating">
              <span className="reviews2__stars" role="img" aria-label={`Nota ${googlePlace.rating} de 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} width={15} height={15} />
                ))}
              </span>
              <span>
                <strong>{googlePlace.rating}</strong> no Google · {googlePlace.reviews} avaliações
              </span>
            </p>
            <a className="text-link" href={googlePlace.url} target="_blank" rel="noopener noreferrer">
              Ver avaliações no Google
              <span className="sr-only"> (abre em nova aba)</span>
              <ArrowUpRight width={16} height={16} />
            </a>
          </div>
        </Reveal>

        <Reveal className="reviews2__card" y={24} delay={0.08}>
          <span className="reviews2__mark" aria-hidden="true">
            “
          </span>
          <div className="reviews2__stage">
            {/* reserva só a altura da maior citação, sem saltos na troca */}
            {reviews.map((r) => (
              <figure key={r.author} className="reviews2__ghost" aria-hidden="true">
                <blockquote>
                  <p>{r.text}</p>
                </blockquote>
                <figcaption>— {r.author}</figcaption>
              </figure>
            ))}
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={current.author}
                className="reviews2__quote"
                aria-live="polite"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <blockquote>
                  <p>{current.text}</p>
                </blockquote>
                <figcaption>— {current.author}</figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="reviews2__controls">
            <p className="reviews2__count" aria-hidden="true">
              {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </p>
            <button type="button" className="round-btn" aria-label="Depoimento anterior" onClick={() => go(-1)}>
              <ArrowLeft width={18} height={18} />
            </button>
            <button type="button" className="round-btn" aria-label="Próximo depoimento" onClick={() => go(1)}>
              <ArrowRight width={18} height={18} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
