import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { asset, brand, heroSlides } from '../data/clinic';
import { Photo } from './ui/Photo';
import { SplitReveal } from './ui/SplitReveal';
import { ArrowLeft, ArrowRight, Pause, Play } from './ui/Icons';

const INTERVAL = 9000;

/**
 * Hero fotográfico em três cenas (composição da referência: foto em tela cheia, conteúdo
 * central, navbar sobreposta, controles na base).
 * Autoplay pausa com foco dentro, aba oculta, interação manual e movimento reduzido.
 * Slides inativos ficam inert/aria-hidden; o anúncio só é educado depois de navegação manual.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [focusInside, setFocusInside] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const count = heroSlides.length;
  const slide = heroSlides[active];

  const go = useCallback(
    (to: number, manual = false) => {
      setActive(((to % count) + count) % count);
      setCycle((c) => c + 1);
      if (manual) setPlaying(false);
    },
    [count],
  );

  useEffect(() => {
    const onVis = () => setPageHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const autoplay = playing && !reduce && !focusInside && !pageHidden;
  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(() => go(active + 1), INTERVAL);
    return () => window.clearTimeout(id);
  }, [autoplay, active, go]);

  // Swipe opcional no toque
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') pointer.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const start = pointer.current;
    pointer.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) > 50 && Math.abs(e.clientY - start.y) < 60) go(active + (dx < 0 ? 1 : -1), true);
  };

  const symbolStyle = {
    '--symbol-mask': `url("${new URL(asset(brand.symbol.src), document.baseURI).href}")`,
  } as CSSProperties;

  return (
    <section
      id="inicio"
      className="hero"
      aria-roledescription="carrossel"
      aria-label="Apresentação da Clínica HAES"
      onFocus={() => setFocusInside(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusInside(false);
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <h1 className="sr-only">Clínica HAES: odontologia e estética facial em Campo Grande, MS</h1>

      <div className="hero__slides">
        {heroSlides.map((s, i) => {
          const isActive = i === active;
          const vars = { '--pos-d': s.position.desktop, '--pos-m': s.position.mobile } as CSSProperties;
          return (
            <div
              key={s.id}
              className={`hero__slide ${isActive ? 'is-active' : ''} ${s.companion ? 'hero__slide--split' : ''}`}
              aria-hidden={!isActive}
              style={vars}
            >
              {/* key com o ciclo reinicia a aproximação a cada entrada */}
              <div className="hero__media" key={isActive ? `${s.id}-${cycle}` : s.id}>
                {s.companion && (
                  <div className="hero__panel hero__panel--companion">
                    <Photo photo={s.companion} decorative sizes="(min-width: 900px) 58vw, 1px" />
                  </div>
                )}
                <div className="hero__panel">
                  <Photo
                    photo={s.photo}
                    decorative={!isActive}
                    priority={i === 0}
                    sizes={s.companion ? '(min-width: 900px) 42vw, 100vw' : '100vw'}
                    style={{ objectPosition: 'var(--pos)' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div className="hero__shade" aria-hidden="true" />
        <span className="hero__symbol" style={symbolStyle} aria-hidden="true" />
      </div>

      <div className="hero__content container">
        <div aria-live={playing && !reduce ? 'off' : 'polite'} aria-atomic="true" className="hero__copy">
          <p className="hero__eyebrow">Clínica HAES · Campo Grande</p>
          <p className="hero__title">
            <SplitReveal
              replayKey={`${slide.id}-${cycle}`}
              parts={[{ text: slide.title }, ...(slide.italic ? [{ text: slide.italic, italic: true }] : [])]}
            />
          </p>
          {reduce ? (
            <p className="hero__support">{slide.support}</p>
          ) : (
            <motion.p
              key={`${slide.id}-${cycle}-support`}
              className="hero__support"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {slide.support}
            </motion.p>
          )}
        </div>
        {/* CTA permanece visível durante as trocas */}
        <a className="btn btn--light hero__cta" href={slide.cta.href}>
          {slide.cta.label}
          <ArrowRight />
        </a>
      </div>

      <div className="hero__controls" role="group" aria-label="Controles da apresentação">
        <button type="button" className="hero__ctrl" aria-label="Cena anterior" onClick={() => go(active - 1, true)}>
          <ArrowLeft width={18} height={18} />
        </button>
        <div className="hero__dots">
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`hero__dot ${i === active ? 'is-active' : ''}`}
              aria-label={`Cena ${i + 1} de ${count}`}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => go(i, true)}
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
        <button type="button" className="hero__ctrl" aria-label="Próxima cena" onClick={() => go(active + 1, true)}>
          <ArrowRight width={18} height={18} />
        </button>
        {!reduce && (
          <button
            type="button"
            className="hero__ctrl"
            aria-label={playing ? 'Pausar apresentação' : 'Reproduzir apresentação'}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause width={16} height={16} /> : <Play width={16} height={16} />}
          </button>
        )}
      </div>
    </section>
  );
}
