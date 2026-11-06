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
