import { clinic, googlePlace, mapsRouteUrl, photos, whatsappUrl } from '../data/clinic';
import { Photo } from './ui/Photo';
import { Reveal } from './ui/Reveal';
import { MaskReveal, Parallax } from './ui/Motion';
import { ArrowUpRight, WhatsApp } from './ui/Icons';

/**
 * Localização: endereço e "Como chegar" primeiro; mapa (pin conferido na ficha do Google)
 * e foto real da entrada lado a lado no desktop; horários e acessibilidade na mesma seção.
 */
export function Location() {
  const { address } = clinic;
  return (
    <section id="localizacao" className="section location" aria-labelledby="location-title">
      <div className="container loc">
        <Reveal className="loc__intro">
          <p className="eyebrow">Localização</p>
          <h2 id="location-title">Onde estamos.</h2>
          <address className="location__address">
            {address.street}
            <br />
            {address.district}
            <br />
            {address.city} — {address.state}, {address.zip}
          </address>
          <div className="location__actions">
            <a className="btn btn--primary" href={mapsRouteUrl} target="_blank" rel="noopener noreferrer">
              Como chegar
              <span className="sr-only"> (rota no Google Maps, abre em nova aba)</span>
              <ArrowUpRight />
            </a>
            <a className="btn btn--ghost" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              <WhatsApp />
              {clinic.whatsapp.display}
              <span className="sr-only"> — conversar pelo WhatsApp (abre em nova aba)</span>
            </a>
          </div>
        </Reveal>

        <Reveal className="loc__media" y={28}>
          <div className="loc__map">
            <iframe
              src={googlePlace.embed}
              title="Mapa: Clínica HAES na Rua Aluízio de Azevedo, 18, Jardim Monte Líbano, Campo Grande"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              width={640}
              height={512}
            />
          </div>
          <MaskReveal className="loc__photo" from="right" delay={120}>
            <Parallax amount={6}>
              <Photo photo={photos.fachada} sizes="(min-width: 960px) 40vw, 100vw" />
            </Parallax>
          </MaskReveal>
        </Reveal>

        <Reveal className="loc__info" y={20}>
          <div className="location__block">
            <h3 className="location__label">Horários</h3>
            <dl className="hours">
              {clinic.hours.map((h) => (
                <div key={h.days} className="hours__row">
                  <dt>{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="location__block">
            <h3 className="location__label">Bom saber</h3>
            <ul className="amenities">
              {clinic.amenities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
