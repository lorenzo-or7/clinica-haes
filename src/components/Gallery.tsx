import { clinic, gallery } from '../data/clinic';
import { Photo } from './ui/Photo';
import { Reveal } from './ui/Reveal';
import { ArrowUpRight, Instagram } from './ui/Icons';

/**
 * Galeria de detalhes reais da HAES (função da faixa social da referência).
 * Não simula feed conectado nem curtidas: é uma seleção estática com link para o Instagram.
 */
export function Gallery() {
  return (
    <section id="galeria" className="section section--tight gallery" aria-labelledby="gallery-title">
      <div className="container">
        <Reveal className="center-head">
          <p className="eyebrow eyebrow--center">Galeria</p>
          <h2 id="gallery-title">A HAES em detalhes.</h2>
          <a className="text-link" href={clinic.instagram} target="_blank" rel="noopener noreferrer">
            <Instagram />
            Acompanhe @clinicahaes
            <span className="sr-only"> (abre o Instagram em nova aba)</span>
            <ArrowUpRight width={16} height={16} />
          </a>
        </Reveal>
      </div>
      <Reveal y={28}>
        <ul className="gallery__rail" aria-label="Fotos da clínica">
          {gallery.map((photo) => (
            <li key={photo.sources[0]} className="gallery__item">
              <Photo photo={photo} sizes="(min-width: 1100px) 20vw, (min-width: 640px) 34vw, 72vw" />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
