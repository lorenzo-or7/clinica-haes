import { useCallback, useEffect, useRef, useState } from 'react';
import { asset, featuredTreatments, treatmentCategories, type Treatment } from '../data/clinic';
import { Reveal } from './ui/Reveal';
import { ArrowLeft, ArrowRight, ArrowUpRight, Close } from './ui/Icons';

type Props = {
  /** Preenche o tratamento no pré-agendamento e leva até o formulário. */
  onRequest: (treatment: string) => void;
};

/**
 * Gravuras próprias (assets-fornecidos: clareamento, toxina, preenchimento, catalogo).
 * Decorativas: o card já nomeia o tratamento. Recorte individual por object-position.
 */
const ART: Record<string, { file: string; tone: 'green' | 'ivory'; position: string }> = {
  clareamento: { file: 'clareamento', tone: 'green', position: '70% 46%' },
  toxina: { file: 'toxina', tone: 'ivory', position: '74% 40%' },
  preenchimento: { file: 'preenchimento', tone: 'green', position: '76% 42%' },
};

const artSrcSet = (file: string) => `${asset(`arts/${file}-720.webp`)} 720w, ${asset(`arts/${file}-1200.webp`)} 1200w`;

function Art({ file, position }: { file: string; position: string }) {
  return (
    <img
      className="tcard__art"
      src={asset(`arts/${file}-720.webp`)}
      srcSet={artSrcSet(file)}
      sizes="(min-width: 640px) 330px, 82vw"
      alt=""
      width={1312}
      height={1199}
      loading="lazy"
      decoding="async"
      style={{ objectPosition: position }}
    />
  );
}

/**
 * Destaques em trilho horizontal (hierarquia da referência: título + link lateral, cards com
 * painel visual e barra de nome com seta, setas abaixo). Sem fotos de procedimento
 * autorizadas: o painel é uma composição tipográfica com o símbolo HAES.
 */
export function Treatments({ onRequest }: Props) {
  const [current, setCurrent] = useState<Treatment | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (current && !dialog.open) dialog.showModal();
    if (!current && dialog.open) dialog.close();
  }, [current]);

  const updateEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setEdges({
      start: rail.scrollLeft <= 4,
      end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    updateEdges();
    rail.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      rail.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [updateEdges]);

  const scrollByCard = (dir: 1 | -1) => {
    const rail = railRef.current;
    const card = rail?.querySelector('li');
    if (!rail || !card) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    rail.scrollBy({ left: dir * (card.getBoundingClientRect().width + 16), behavior: reduce ? 'auto' : 'smooth' });
  };

  const open = (t: Treatment, button: HTMLButtonElement) => {
    triggerRef.current = button;
    setCurrent(t);
  };

  const handleClose = () => {
    setCurrent(null);
    triggerRef.current?.focus();
  };

  const request = () => {
    if (!current) return;
    const name = current.name;
    triggerRef.current = null;
    setCurrent(null);
    onRequest(name);
  };

  return (
    <section id="tratamentos" className="section treatments" aria-labelledby="treatments-title">
      <div className="container">
        <Reveal className="split-head">
          <div className="split-head__main">
            <p className="eyebrow">Tratamentos</p>
            <h2 id="treatments-title">Cuidado para o sorriso e para você.</h2>
            <p className="split-head__text">
              Odontologia e estética facial na mesma clínica, sempre a partir de uma avaliação individual.
            </p>
          </div>
          <a className="text-link split-head__link" href="#catalogo">
            Ver todos os tratamentos
            <ArrowRight width={18} height={18} />
          </a>
        </Reveal>
      </div>

      <Reveal className="rail-wrap" y={32}>
        <ul className="rail" ref={railRef} aria-label="Tratamentos em destaque">
          {featuredTreatments.map((t) => (
            <li key={t.id} className="tcard">
              <button
                type="button"
                className="tcard__button"
                aria-haspopup="dialog"
                onClick={(e) => open(t, e.currentTarget)}
              >
                <span className={`tcard__panel tcard__panel--${ART[t.id]?.tone ?? 'green'}`} aria-hidden="true">
                  {ART[t.id] && <Art file={ART[t.id].file} position={ART[t.id].position} />}
                  <span className="tcard__category">{t.category}</span>
                  <span className="tcard__word">{t.name.split(' ')[0]}</span>
                </span>
                <span className="tcard__bar">
                  <span className="tcard__name">{t.name}</span>
                  <span className="sr-only">: sobre o tratamento</span>
                  <span className="tcard__arrow" aria-hidden="true">
                    <ArrowUpRight width={18} height={18} />
                  </span>
                </span>
              </button>
            </li>
          ))}
          <li className="tcard tcard--more">
            <a className="tcard__button" href="#catalogo">
              <span className="tcard__panel tcard__panel--green tcard__panel--count">
                <Art file="catalogo" position="80% 30%" />
                <span className="tcard__count">{treatmentCategories.length}</span>
                <span className="tcard__count-label">categorias de tratamento</span>
              </span>
              <span className="tcard__bar">
                <span className="tcard__name">Ver todos os tratamentos</span>
                <span className="tcard__arrow" aria-hidden="true">
                  <ArrowRight width={18} height={18} />
                </span>
              </span>
            </a>
          </li>
        </ul>
        <div className="container rail-controls">
          <button
            type="button"
            className="round-btn"
            aria-label="Tratamento anterior"
            onClick={() => scrollByCard(-1)}
            disabled={edges.start}
          >
            <ArrowLeft width={18} height={18} />
          </button>
          <button
            type="button"
            className="round-btn"
            aria-label="Próximo tratamento"
            onClick={() => scrollByCard(1)}
            disabled={edges.end}
          >
            <ArrowRight width={18} height={18} />
          </button>
        </div>
      </Reveal>

      <dialog
        ref={dialogRef}
        className="treatment-dialog themed"
        aria-labelledby="treatment-dialog-title"
        onClose={handleClose}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        {current && (
          <div className="treatment-dialog__body">
            <button
              type="button"
              className="treatment-dialog__close"
              aria-label="Fechar"
              onClick={() => dialogRef.current?.close()}
            >
              <Close />
            </button>
            <p className="eyebrow">{current.category}</p>
            <h3 id="treatment-dialog-title">{current.name}</h3>
            <p className="treatment-dialog__text">{current.summary}</p>
            <p className="treatment-dialog__note">
              A indicação é sempre individual e definida em consulta, depois de uma avaliação com a equipe da HAES.
            </p>
            <div className="treatment-dialog__actions">
              <button type="button" className="btn btn--primary" onClick={request}>
                Solicitar avaliação
                <ArrowRight />
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => dialogRef.current?.close()}>
                Voltar
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
