import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useInViewOnce, useScrollVar } from '../../lib/hooks';

type MaskRevealProps = {
  children: ReactNode;
  className?: string;
  /** Lado de onde a imagem se revela. */
  from?: 'left' | 'right' | 'bottom';
  delay?: number;
};

/**
 * Revelação por máscara (clip-path) uma única vez ao entrar na tela.
 * O observador fica no contêiner, que nunca é recortado; com movimento reduzido,
 * sem JavaScript de observação ou se o observador falhar, a imagem aparece inteira.
 */
export function MaskReveal({ children, className, from = 'left', delay = 0 }: MaskRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInViewOnce(ref, 0.2);
  return (
    <div
      ref={ref}
      className={`mask-reveal mask-reveal--${from} ${seen ? 'is-in' : ''} ${className ?? ''}`}
      style={{ '--mr-delay': `${delay}ms` } as CSSProperties}
    >
      <div className="mask-reveal__inner">{children}</div>
    </div>
  );
}

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Deslocamento total em % da altura do contêiner (padrão 8; no celular o CSS reduz). */
  amount?: number;
};

/**
 * Parallax suave: a imagem, ampliada só o necessário para cobrir o deslocamento,
 * acompanha a rolagem por uma variável CSS. O enquadramento fica sempre dentro do contêiner.
 */
export function Parallax({ children, className, amount = 8 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollVar(ref, { start: 1, end: 0 });
  return (
    <div ref={ref} className={`parallax ${className ?? ''}`} style={{ '--amp': amount } as CSSProperties}>
      <div className="parallax__inner">{children}</div>
    </div>
  );
}
