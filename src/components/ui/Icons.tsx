/* Ícones de traço simples, desenhados para o projeto. Todos decorativos (aria-hidden). */
import type { SVGProps } from 'react';

const base = (props: SVGProps<SVGSVGElement>) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...props,
});

export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const ChevronLeft = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const ChevronRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ChevronDown = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const Close = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const Menu = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);

export const Calendar = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
    <path d="M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01" strokeWidth={2.2} />
  </svg>
);

export const Sun = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </svg>
);

export const Moon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
);

export const Instagram = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.2 6.8h.01" strokeWidth={2.4} />
  </svg>
);

export const WhatsApp = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 20l1.2-3.6A8 8 0 1 1 8 19.1L4 20Z" />
    <path d="M9.2 8.6c.2-.4.5-.4.8-.4h.5c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .5-.1.6l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.2.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.5c0 .3 0 .6-.4.8-.6.4-1.5.5-2.3.2a8 8 0 0 1-4.4-4.4c-.3-.8-.2-1.7.2-2.3Z" />
  </svg>
);

export const Star = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ fill: 'currentColor', stroke: 'none', ...p })}>
    <path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1-4.5-4.2 6.1-.8L12 3Z" />
  </svg>
);

/**
 * Folha do seletor de tema (botão 07 aprovado).
 * Geometria derivada das folhas do símbolo oficial (raster): vesica com proporção ~2,24:1
 * (folha inferior: 190×85 px no arquivo de 1080 px) e o traço interno perpendicular a ~57%
 * do comprimento, como nas letras C/H do símbolo. Não é um path oficial: substituir pelo
 * desenho do SVG quando ele existir.
 */
export const Leaf = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ stroke: 'none', ...p })} viewBox="0 0 24 24">
    <g transform="rotate(-40 12 12)">
      <path d="M1 12A14.78 14.78 0 0 1 23 12A14.78 14.78 0 0 1 1 12Z" fill="currentColor" />
      <path
        d="M13.5 8.1V12.6"
        stroke="var(--leaf-vein, rgba(255,255,255,.7))"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export const ArrowLeft = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const Pause = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M9 6v12M15 6v12" />
  </svg>
);

export const Play = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
  </svg>
);

export const Tooth = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M7.5 3.5c-2.4 0-4 1.9-4 4.5 0 2.2 1 3.6 1.6 5.4.6 1.9.7 7.1 2.6 7.1 1.7 0 1.5-4.6 2.6-5.9.5-.6 1-.6 1.4 0 1.1 1.3.9 5.9 2.6 5.9 1.9 0 2-5.2 2.6-7.1.6-1.8 1.6-3.2 1.6-5.4 0-2.6-1.6-4.5-4-4.5-1.7 0-2.6.9-4.5.9s-2.8-.9-4.5-.9Z" />
  </svg>
);

export const Pin = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

export const Clock = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const Access = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="4.5" r="1.6" />
    <path d="M7 8.5h10M12 8.5v6m0 0-3.5 6M12 14.5l3.5 6" />
  </svg>
);
