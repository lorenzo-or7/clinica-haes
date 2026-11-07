import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { attributes } from '../data/clinic';
import { Access, Clock, Pin, Tooth } from './ui/Icons';

const ICONS = { tooth: Tooth, pin: Pin, clock: Clock, access: Access } as const;

function Items({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="strip__list" aria-hidden={hidden || undefined}>
      {attributes.map((a) => {
        const Icon = ICONS[a.icon];
        return (
          <li key={a.label} className="strip__item">
            <span className="strip__icon">
              <Icon width={18} height={18} />
            </span>
            {a.label}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Faixa de atributos confirmados, conectada à base do hero por uma superfície de cantos
 * superiores amplos. Desliza a ~30 px/s (como observado), pausa no hover/foco e fica
 * estática com movimento reduzido.
 */
export function AttributesStrip() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [onScreen, setOnScreen] = useState(true);

  // a faixa só desliza enquanto está na tela
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`strip ${reduce ? 'strip--static' : ''} ${onScreen ? '' : 'strip--paused'}`}
      aria-label="Sobre o atendimento"
    >
      <div className="strip__viewport">
        <div className="strip__track">
          <Items />
          {!reduce && <Items hidden />}
          {!reduce && <Items hidden />}
        </div>
      </div>
    </section>
  );
}
