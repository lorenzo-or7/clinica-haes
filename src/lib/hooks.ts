import { useCallback, useEffect, useState, useSyncExternalStore, type RefObject } from 'react';
import { useMotionValue } from 'motion/react';

export type Theme = 'light' | 'dark';
const THEME_KEY = 'haes-theme';

const readTheme = (): Theme =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

/** Tema: claro no primeiro acesso, escolha explícita persistida em localStorage. */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', next === 'dark' ? '#17271D' : '#F8F5EC');
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // armazenamento indisponível (modo privado, bloqueio): o tema vale só nesta visita
    }
  }, []);

  return [theme, setTheme] as const;
}

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false),
    () => false,
  );
}

export function useScrolledPast(px: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setPast(window.scrollY > px);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [px]);
  return past;
}

export const supportsObserver = () => typeof window !== 'undefined' && 'IntersectionObserver' in window;

/**
 * Progresso 0→1 de um elemento alto atravessando a viewport (início no topo → fim no rodapé).
 * Calculado com getBoundingClientRect num listener de rolagem + rAF e gravado num MotionValue:
 * sem setState por frame e sem depender de ScrollTimeline nativo.
 */
export function useSectionProgress(ref: RefObject<HTMLElement | null>, mode: 'pin' | 'pass' = 'pin') {
  const progress = useMotionValue(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let value: number;
      if (mode === 'pass') {
        // 'pass': 0 quando o topo entra pela base, 1 quando a base sai pelo topo
        value = (vh - rect.top) / (vh + rect.height);
      } else {
        const range = rect.height - vh;
        value = range > 0 ? -rect.top / range : rect.top <= 0 ? 1 : 0;
      }
      value = Math.min(1, Math.max(0, value));
      progress.set(value);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [ref, progress]);
  return progress;
}

/**
 * Escreve o progresso de rolagem de um elemento numa variável CSS (padrão --p, 0→1).
 * p = 0 quando o topo do elemento está em start×altura da viewport; p = 1 quando a base
 * chega a end×altura. Atualização síncrona no evento de rolagem (sem rAF, sem setState) e
 * só quando o valor muda: fora da tela o valor fica parado em 0 ou 1 e nada é escrito.
 */
export function useScrollVar(
  ref: RefObject<HTMLElement | null>,
  { start = 1, end = 0, name = '--p', enabled = true }: { start?: number; end?: number; name?: string; enabled?: boolean } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let last = -1;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = (start - end) * vh + rect.height;
      const raw = span > 0 ? (start * vh - rect.top) / span : 1;
      const p = Math.round(Math.min(1, Math.max(0, raw)) * 1000) / 1000;
      if (p !== last) {
        last = p;
        el.style.setProperty(name, String(p));
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [ref, start, end, name, enabled]);
}

/**
 * true depois que o elemento entra na viewport (uma vez). Sem IntersectionObserver,
 * ou se o observador não responder em 4 s depois de o elemento já estar visível,
 * retorna true: o conteúdo nunca fica permanentemente escondido.
 */
export function useInViewOnce(ref: RefObject<HTMLElement | null>, threshold = 0.25) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    // rede de segurança: se o elemento já está na tela e o observador falhar, revela mesmo assim
    const safety = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) setSeen(true);
    }, 4000);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, [ref, threshold]);
  return seen;
}
