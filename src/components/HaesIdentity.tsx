/**
 * A identidade HAES: um capítulo próprio, ligado à rolagem nativa (sem fixar a tela).
 *
 * Palco fixo (position: sticky) dentro de uma seção alta: a rolagem nativa continua, mas
 * enquanto o palco está fixo ela só avança a animação. Sequência (progresso --p, 0→1):
 *   1. desenho  (0,00–0,34): o símbolo é traçado folha a folha;
 *   2. C        (0,38–0,54): o restante esmaece, o C acende e um "C" gigante surge ao fundo;
 *   3. H        (0,56–0,72): o mesmo com o H;
 *   4. HAES     (0,76–0,92): o símbolo inteiro fica dourado, com halo e um anel que se expande.
 *
 * Fidelidade: todas as camadas recortam o contorno do símbolo vetorizado a partir do raster
 * oficial (src/data/symbolPath.ts), para ficar nítido em telas grandes e de alta densidade.
 * Os traços abaixo só definem a ORDEM em que o símbolo aparece: são guias largos sobre o
 * desenho original, não uma vetorização da marca. Os trechos C e H seguem a prancha
 * "Letra C / Letra H" e ainda pedem aprovação da clínica.
 */
import { useId, useRef, type CSSProperties } from 'react';
import { asset, brand } from '../data/clinic';
import { useScrollVar } from '../lib/hooks';
import { SYMBOL_PATH } from '../data/symbolPath';

/** Guias de traçado (coordenadas do PNG 395×250), na ordem do desenho. */
const STROKES = [
  'M199 8 Q 252 80 200 197', // folha central, lado direito
  'M199 8 Q 165 40 162 80', // folha central, lado esquerdo
  'M62 63 Q 170 75 200 197', // folha superior esquerda, arco interno
  'M335 65 Q 330 175 207 201', // folha superior direita, arco interno
  'M62 63 Q 60 115 87 143', // folha superior esquerda, arco externo
  'M335 65 Q 290 62 257 90', // folha superior direita, arco externo
  'M5 200 Q 110 128 200 200', // folha inferior esquerda, arco superior
  'M200 200 Q 290 280 390 202', // folha inferior direita, arco inferior
  'M5 201 Q 78 268 172 222', // folha inferior esquerda, arco inferior (C)
  'M318 164 Q 360 170 390 202', // folha inferior direita, arco superior
  'M188 115 L233 115', // traço interno da folha central
  'M130 147 L163 115', // traço interno superior esquerdo
  'M253 133 L287 165', // traço interno superior direito
  'M113 164 L113 212', // traço interno inferior esquerdo
  'M283 192 L283 240', // traço interno inferior direito
];

const C_PATH = 'M 5 201 Q 78 268 172 222';
const H_PATH = 'M 62 169 Q 112 149 160 171 M 113 164 L 113 212 M 57 231 Q 98 247 136 233';

const PHASES = [
  { n: '01', letter: 'C', text: 'O C de Clínica' },
  { n: '02', letter: 'H', text: 'O H de HAES' },
  { n: '03', letter: 'HAES', text: 'Um só símbolo' },
];

export function HaesIdentity() {
  const ref = useRef<HTMLElement>(null);
  const uid = `haes-${useId().replace(/:/g, '')}`;
  // Seção alta com palco fixo (sticky): p = 0 quando o topo da seção encosta no topo da tela,
  // p = 1 quando a base chega à base da tela. Enquanto isso, a rolagem só avança a animação.
  useScrollVar(ref, { start: 0, end: 1 });
  const symbolUrl = new URL(asset(brand.symbol.src), document.baseURI).href;
  const glowStyle = { '--symbol-mask': `url("${symbolUrl}")` } as CSSProperties;

  return (
    <section ref={ref} id="identidade" className="idc" aria-labelledby={`${uid}-title`}>
      <div className="idc__pin">
      <div className="idc__ambient" aria-hidden="true" />

      <div className="container idc__grid">
        <div className="idc__copy">
          <p className="eyebrow idc__eyebrow">A identidade HAES</p>
          <h2 id={`${uid}-title`} className="idc__title">
            Uma identidade <em>em cada detalhe.</em>
          </h2>
          <p className="idc__text">
            As iniciais C e H se encontram em um símbolo orgânico, que traduz leveza e bem-estar.
          </p>
          <ol className="idc__phases" aria-hidden="true">
            {PHASES.map((ph, i) => (
              <li key={ph.n} className={`idc__phase idc__phase--${i + 1}`}>
                <span className="idc__phase-n">{ph.n}</span>
                <span className="idc__phase-letter">{ph.letter}</span>
                <span className="idc__phase-text">{ph.text}</span>
                <span className="idc__phase-bar">
                  <span />
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="idc__stage">
          {/* letras gigantes ao fundo, em contorno (decorativas) */}
          <span className="idc__ghost idc__ghost--c" aria-hidden="true">
            C
          </span>
          <span className="idc__ghost idc__ghost--h" aria-hidden="true">
            H
          </span>
          <span className="idc__ring" aria-hidden="true" />
          <span className="idc__glow" style={glowStyle} aria-hidden="true" />

          <svg
            viewBox="0 0 395 250"
            className="idc__symbol"
            role="img"
            aria-label="Símbolo da Clínica HAES, com as iniciais C e H integradas às folhas"
          >
            <defs>
              <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8f6e3d" />
                <stop offset="0.45" stopColor="#e6cf9c" />
                <stop offset="0.7" stopColor="#c7ad7e" />
                <stop offset="1" stopColor="#9c7b47" />
              </linearGradient>
              <filter id={`${uid}-soft`} x="-20%" y="-40%" width="140%" height="180%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              {/* contorno vetorial do símbolo: nítido em qualquer tamanho */}
              <mask id={`${uid}-alpha`} maskUnits="userSpaceOnUse" x="0" y="0" width="395" height="250">
                <path d={SYMBOL_PATH} fill="white" fillRule="evenodd" />
              </mask>
              <mask id={`${uid}-draw`} maskUnits="userSpaceOnUse" x="0" y="0" width="395" height="250">
                {STROKES.map((d, i) => (
                  <path
                    key={d}
                    d={d}
                    pathLength={1}
                    className="idc__stroke"
                    style={{ '--i': i } as CSSProperties}
                    fill="none"
                    stroke="white"
                    strokeWidth="19"
                    strokeLinecap="round"
                  />
                ))}
              </mask>
              <mask id={`${uid}-c`} maskUnits="userSpaceOnUse" x="0" y="0" width="395" height="250">
                <path d={C_PATH} fill="none" stroke="white" strokeWidth="18" strokeLinecap="round" />
              </mask>
              <mask id={`${uid}-h`} maskUnits="userSpaceOnUse" x="0" y="0" width="395" height="250">
                <path d={H_PATH} fill="none" stroke="white" strokeWidth="18" strokeLinecap="round" />
              </mask>
            </defs>
            {/* brilho só ao longo da letra em destaque (fora do recorte, para vazar suavemente) */}
            <g filter={`url(#${uid}-soft)`} aria-hidden="true">
              <path className="idc__aura idc__aura--c" d={C_PATH} fill="none" strokeWidth="16" strokeLinecap="round" />
              <path className="idc__aura idc__aura--h" d={H_PATH} fill="none" strokeWidth="16" strokeLinecap="round" />
            </g>
            <g mask={`url(#${uid}-alpha)`}>
              {/* silhueta completa, sempre presente (contraste discreto) */}
              <rect className="idc__base" width="395" height="250" />
              {/* traçado progressivo */}
              <g mask={`url(#${uid}-draw)`}>
                <rect className="idc__drawn" width="395" height="250" />
              </g>
              <rect className="idc__c" width="395" height="250" mask={`url(#${uid}-c)`} />
              <rect className="idc__h" width="395" height="250" mask={`url(#${uid}-h)`} />
              <rect className="idc__gold" width="395" height="250" fill={`url(#${uid}-gold)`} />
            </g>
          </svg>
        </div>
      </div>
      </div>
    </section>
  );
}
