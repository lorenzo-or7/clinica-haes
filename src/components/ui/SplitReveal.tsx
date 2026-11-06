import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type Part = { text: string; italic?: boolean };

type Props = {
  parts: Part[];
  /** Muda a cada troca de slide para repetir a revelação. */
  replayKey: string;
  stagger?: number;
  duration?: number;
  blur?: number;
  y?: number;
};

/**
 * Revelação caractere por caractere com blur, como observado no hero da referência.
 * Leitores de tela recebem o texto inteiro uma vez (sr-only); os caracteres animados
 * ficam aria-hidden. Cada palavra é um bloco inline sem quebra interna.
 */
export function SplitReveal({ parts, replayKey, stagger = 0.036, duration = 0.5, blur = 6, y = 18 }: Props) {
  const reduce = useReducedMotion();
  const full = parts.map((p) => p.text).join(' ');

  let index = 0;
  const visual: ReactNode[] = [];
  parts.forEach((part, pi) => {
    const words = part.text.split(' ');
    const wordNodes: ReactNode[] = [];
    words.forEach((word, wi) => {
      const chars = Array.from(word).map((ch, ci) => {
        const i = index++;
        if (reduce) return <span key={ci}>{ch}</span>;
        return (
          <motion.span
            key={ci}
            className="split__char"
            initial={{ opacity: 0, filter: `blur(${blur}px)`, y }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration, delay: i * stagger, ease: [0.22, 1, 0.36, 1] }}
          >
            {ch}
          </motion.span>
        );
      });
      wordNodes.push(
        <span className="split__word" key={`${pi}-${wi}`}>
          {chars}
        </span>,
      );
      // espaço fora do bloco inline: não colapsa e permite a quebra entre palavras
      if (wi < words.length - 1) wordNodes.push(' ');
    });
    visual.push(
      part.italic ? (
        <em key={pi}>{wordNodes}</em>
      ) : (
        <span key={pi}>{wordNodes}</span>
      ),
    );
    if (pi < parts.length - 1) visual.push(' ');
  });

  return (
    <>
      <span className="sr-only">{full}</span>
      <span aria-hidden="true" key={replayKey} className="split">
        {visual}
      </span>
    </>
  );
}
