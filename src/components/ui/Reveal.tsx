import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { supportsObserver } from '../../lib/hooks';

const EASE = [0.22, 1, 0.36, 1] as const;

type Tag = 'div' | 'li' | 'article' | 'figure';

type RevealProps = {
  children: ReactNode;
  as?: Tag;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  amount?: number;
};

/**
 * Entrada única ao entrar na viewport. Com movimento reduzido ou sem
 * IntersectionObserver, o conteúdo aparece direto (nunca fica invisível).
 */
/* Padrão observado na referência: bloco inteiro, y ~30 px, ~900 ms, desaceleração. */
export function Reveal({ children, as = 'div', className, delay = 0, duration = 0.9, y = 32, amount = 0.15 }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce || !supportsObserver()) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

type LinesProps = {
  lines: ReactNode[];
  /** 'mount' anima ao carregar (hero); 'view' ao entrar na viewport. */
  trigger?: 'mount' | 'view';
  duration?: number;
  stagger?: number;
  y?: number;
  delay?: number;
};

/**
 * Título revelado linha a linha. O texto continua no DOM, uma vez só,
 * para leitores de tela; as linhas são apenas spans de bloco.
 */
export function Lines({ lines, trigger = 'view', duration = 0.6, stagger = 0.1, y = 24, delay = 0 }: LinesProps) {
  const reduce = useReducedMotion();
  const animated = !reduce && (trigger === 'mount' || supportsObserver());

  return (
    <>
      {lines.map((line, i) => {
        const space = i < lines.length - 1 ? ' ' : null;
        if (!animated) {
          return (
            <span className="line" key={i}>
              {line}
              {space}
            </span>
          );
        }
        const transition = { duration, delay: delay + i * stagger, ease: EASE };
        const motionProps =
          trigger === 'mount'
            ? { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 } }
            : {
                initial: { opacity: 0, y },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.6 },
              };
        return (
          <motion.span className="line" key={i} {...motionProps} transition={transition}>
            {line}
            {space}
          </motion.span>
        );
      })}
    </>
  );
}
