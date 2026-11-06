import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { clinic, faq, firstVisitSteps, photos } from '../data/clinic';
import { Photo } from './ui/Photo';
import { Reveal } from './ui/Reveal';
import { ArrowRight, ChevronDown } from './ui/Icons';

/**
 * FAQ (perguntas de um lado) + convite visual para conversar (do outro), como na referência.
 * O convite reaproveita os três passos da primeira visita, em versão compacta.
 */
export function FAQ() {
  return (
    <section id="duvidas" className="section faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <Reveal className="faq__list">
          <p className="eyebrow">Dúvidas</p>
          <h2 id="faq-title">Antes da sua primeira visita.</h2>
          <p className="faq__intro">O que costumam perguntar antes de marcar uma avaliação.</p>
          <div className="accordion">
            {faq.map((item, i) => (
              <AccordionItem key={item.q} question={item.q} answer={item.a} defaultOpen={i === 0} />
            ))}
          </div>
        </Reveal>

        <Reveal className="invite" y={32}>
          <div className="invite__media" aria-hidden="true">
            <Photo photo={photos.recepcao} decorative sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
          <div className="invite__shade" aria-hidden="true" />
          <div className="invite__content">
            <p className="invite__meta">
              WhatsApp {clinic.whatsapp.display} · Seg. a sex., 08h às 18h
            </p>
            <h3 className="invite__title">Vamos conversar sobre sua avaliação?</h3>
            <ol className="invite__steps">
              {firstVisitSteps.map((s, i) => (
                <li key={s.title}>
                  <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </li>
              ))}
            </ol>
            <a className="btn btn--light" href="#pre-agendamento">
              Ir para o pré-agendamento
              <ArrowRight />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AccordionItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const reduce = useReducedMotion();
  const id = useId();
  const buttonId = `${id}-btn`;
  const panelId = `${id}-panel`;

  return (
    <div className={`accordion__item ${open ? 'is-open' : ''}`}>
      <h3 className="accordion__heading">
        <button
          id={buttonId}
          type="button"
          className="accordion__button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{question}</span>
          <ChevronDown className="chevron" />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="accordion__panel"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
