import { useState, type CSSProperties } from 'react';
import { asset, type PhotoSource } from '../../data/clinic';

type Props = {
  photo: PhotoSource;
  className?: string;
  style?: CSSProperties;
  /** Hero: carregamento prioritário. Demais: lazy. */
  priority?: boolean;
  sizes?: string;
  /** Imagem puramente decorativa (texto equivalente já está ao lado). */
  decorative?: boolean;
};

/**
 * Foto real com srcset WebP e JPEG de fallback. Se nenhum arquivo carregar,
 * mostra um bloco neutro com as mesmas dimensões (nunca uma fotografia substituta).
 */
export function Photo({ photo, className, style, priority, sizes, decorative }: Props) {
  const [index, setIndex] = useState(0);
  const missing = index >= photo.sources.length;

  if (missing) {
    return (
      <div
        className={`photo-fallback ${className ?? ''}`}
        style={style}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : `${photo.alt} (imagem indisponível)`}
        aria-hidden={decorative || undefined}
      >
        <span>{photo.pending}</span>
      </div>
    );
  }

  const srcSet =
    index === 0 && photo.srcset ? photo.srcset.map(([p, w]) => `${asset(p)} ${w}w`).join(', ') : undefined;

  return (
    <img
      className={className}
      src={asset(photo.sources[index])}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={decorative ? '' : photo.alt}
      width={photo.width}
      height={photo.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      style={{ objectPosition: photo.position, ...style }}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}
