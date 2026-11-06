import { asset } from '../../data/clinic';

type LogoSet = { light: string; dark: string; width: number; height: number };

type Props = {
  logo: LogoSet;
  alt: string;
  className?: string;
  /** 'theme' troca a variante com o tema; 'dark-surface' usa sempre a versão de texto marfim. */
  mode?: 'theme' | 'dark-surface';
};

/**
 * Logo oficial HAES (raster com alpha real). No modo 'theme', as duas variantes ficam no DOM
 * e o CSS mostra a correta conforme [data-theme], sem piscar ao trocar de tema.
 */
export function HaesLogo({ logo, alt, className, mode = 'theme' }: Props) {
  if (mode === 'dark-surface') {
    return (
      <img
        className={className}
        src={asset(logo.dark)}
        alt={alt}
        width={logo.width}
        height={logo.height}
        decoding="async"
        loading="lazy"
      />
    );
  }
  return (
    <span
      className={`haes-logo ${className ?? ''}`}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
    >
      <img
        className="haes-logo__img haes-logo__img--light"
        src={asset(logo.light)}
        alt=""
        width={logo.width}
        height={logo.height}
        decoding="async"
      />
      <img
        className="haes-logo__img haes-logo__img--dark"
        src={asset(logo.dark)}
        alt=""
        width={logo.width}
        height={logo.height}
        decoding="async"
      />
    </span>
  );
}
