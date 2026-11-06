import { useEffect, useRef, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import { asset, brand, scenes } from '../data/clinic';
import { useMediaQuery, supportsObserver } from '../lib/hooks';
import { Photo } from './ui/Photo';
import { Reveal } from './ui/Reveal';
import { ArrowRight } from './ui/Icons';

const pad = (n: number) => String(n).padStart(2, '0');
const total = pad(scenes.length);
const N = scenes.length;
/** Meia largura da janela de transição entre cenas (fração do progresso da seção). */
const T = 0.045;

const facts = [
  'Rua Aluízio de Azevedo, 18 · Jardim Monte Líbano',
  'Atendimento com hora marcada, de segunda a sexta',
  'Entrada e estacionamento acessíveis',
];

/**
 * Apresentação editorial da clínica + visita recepção → café → símbolo.
 * Desktop com altura suficiente: palco sticky; texto e foto trocam juntos pelo progresso real
 * da rolagem (MotionValues, sem setState por frame). Celular, telas baixas e movimento
 * reduzido: cenas compactas em fluxo normal.
 */
export function ClinicStory() {
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 1024px) and (min-height: 700px)');
  const pinned = wide && !reduce && supportsObserver();

  return (
    <section id="clinica" className="clinic" aria-labelledby="clinic-title">
      {pinned ? <PinnedClinic /> : <StackedClinic />}
    </section>
  );
}

function Intro({ compact }: { compact?: boolean }) {
  return (
    <>
      <p className="eyebrow">A clínica</p>
      <h2 id="clinic-title" className={compact ? 'clinic__title clinic__title--compact' : 'clinic__title'}>
        Conheça a Clínica HAES.
      </h2>
    </>
  );
}

function Facts() {
  return (
    <>
      <ul className="clinic__facts">
        {facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <a className="btn btn--primary clinic__cta" href="#localizacao">
        Como chegar
        <ArrowRight />
      </a>
    </>
  );
}

function Badge() {
  const style = {
    '--symbol-mask': `url("${new URL(asset(brand.symbol.src), document.baseURI).href}")`,
  } as CSSProperties;
  return (
    <div className="clinic__badge" aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <defs>
          <path id="badge-circle" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" />
        </defs>
        <text>
          <textPath href="#badge-circle" startOffset="0">
            CLÍNICA HAES · ODONTOLOGIA E SAÚDE ·
          </textPath>
        </text>
      </svg>
      <span className="clinic__badge-symbol" style={style} />
    </div>
  );
}

function boundaries(i: number) {
  return { start: i / N, end: (i + 1) / N };
}

/**
 * Faixas de cada cena (fração do progresso da seção). Viram variáveis CSS: o CSS calcula
 * opacidade, deslocamento, escala, máscara e selo a partir de uma única variável --p.
 */
const VARS = scenes.map((_, i) => {
  const { start, end } = boundaries(i);
  const first = i === 0;
  const last = i === N - 1;
  // texto: entra [in0,in1], sai [out0,out1]; a saída termina antes da entrada seguinte
  const in0 = first ? -1 : start + 0.01;
  const in1 = first ? -0.5 : start + T;
  const out0 = last ? 2 : end - T;
  const out1 = last ? 3 : end - 0.01;
  // foto: nova foto por cima, mesmo limite do texto
  const pin0 = first ? -1 : start - 0.01;
  const pin1 = first ? -0.5 : start + T;
  const s0 = Math.max(0, start - T);
  const s1 = Math.min(1, end);
  return {
    '--in0': in0,
    '--ink': 1 / (in1 - in0),
    '--out1': out1,
    '--outk': 1 / (out1 - out0),
    '--pin0': pin0,
    '--pink': 1 / (pin1 - pin0),
    '--s0': s0,
    '--sk': 1 / (s1 - s0),
    '--b0': start,
    '--bk': 1 / (end - start),
    zIndex: i + 1,
  } as CSSProperties;
});

function PinnedClinic() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Progresso real da seção → --p (uma escrita por evento, sem re-renderização)
  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    let active = -1;
    const update = () => {
      const rect = track.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, range > 0 ? -rect.top / range : 0));
      stage.style.setProperty('--p', p.toFixed(4));
      const next = Math.min(N - 1, Math.floor(p * N));
      if (next !== active) {
        active = next;
        stage.querySelectorAll<HTMLElement>('[data-scene]').forEach((el) => {
          el.setAttribute('aria-hidden', String(Number(el.dataset.scene) !== next));
        });
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="clinic__track" ref={trackRef}>
      <div className="clinic__stage container" ref={stageRef} style={{ '--p': 0 } as CSSProperties}>
        <div className="clinic__copy">
          <Intro />
          <div className="clinic__scenes">
            {scenes.map((s, i) => (
              <div key={s.id} className="clinic__scene" style={VARS[i]} data-scene={i} aria-hidden={i !== 0}>
                <p className="clinic__index">
                  {pad(i + 1)} / {total}
                </p>
                <h3>{s.title}</h3>
                <p className="clinic__text">{s.text}</p>
              </div>
            ))}
          </div>
          <Facts />
        </div>

        <div className="clinic__visual">
          <div className="clinic__frame">
            {scenes.map((s, i) => (
              <div key={s.id} className="clinic__photo" style={VARS[i]} data-scene={i} aria-hidden={i !== 0}>
                <Photo photo={s.photo} sizes="(min-width: 1024px) 46vw, 100vw" />
              </div>
            ))}
            <div className="clinic__captions" aria-hidden="true">
              {scenes.map((s, i) => (
                <p key={s.id} className="clinic__caption" style={VARS[i]}>
                  <span className="clinic__caption-index">
                    {pad(i + 1)} / {total}
                  </span>
                  {s.caption}
                </p>
              ))}
            </div>
          </div>
          <Badge />
          <div className="clinic__progress" aria-hidden="true">
            {scenes.map((s, i) => (
              <span key={s.id} className="clinic__bar" style={VARS[i]}>
                <span />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StackedClinic() {
  return (
    <div className="container clinic__stacked">
      <Reveal className="clinic__stacked-intro" y={24} duration={0.7}>
        <Intro compact />
      </Reveal>
      <ol className="clinic__list">
        {scenes.map((s, i) => (
          <Reveal as="li" key={s.id} className="clinic__item" y={16} duration={0.45}>
            <div className="clinic__item-photo">
              <Photo photo={s.photo} sizes="(min-width: 640px) 45vw, 100vw" />
              <span className="clinic__item-caption" aria-hidden="true">
                {s.caption}
              </span>
            </div>
            <div className="clinic__item-text">
              <p className="clinic__index" aria-hidden="true">
                {pad(i + 1)} / {total}
              </p>
              <h3>{s.title}</h3>
              <p className="clinic__text">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
      <div className="clinic__stacked-facts">
        <Facts />
      </div>
    </div>
  );
}
