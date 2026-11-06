import { clinic, mapsRouteUrl, photos, whatsappUrl } from '../data/clinic';
import { Photo } from './ui/Photo';
import { Reveal } from './ui/Reveal';
import { ArrowUpRight, WhatsApp } from './ui/Icons';

export function Location() {
  const { address } = clinic;
  return (
    <section id="localizacao" className="section location" aria-labelledby="location-title">
      <div className="container location__grid">
        <Reveal className="location__media" duration={0.55}>
          <div className="location__photo photo">
            <Photo photo={photos.fachada} sizes="(min-width: 960px) 55vw, 100vw" />
          </div>
        </Reveal>

        <div className="location__info">
          <header className="section-head">
            <p className="eyebrow">Localização</p>
            <h2 id="location-title">Onde estamos.</h2>
          </header>

          <address className="location__address">
            {address.street}
            <br />
            {address.district}
            <br />
            {address.city} — {address.state}, {address.zip}
          </address>

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

          <div className="location__actions">
            <a className="btn btn--primary" href={mapsRouteUrl} target="_blank" rel="noopener noreferrer">
              Como chegar
              <span className="sr-only"> (abre o Google Maps em nova aba)</span>
              <ArrowUpRight />
            </a>
            <a className="btn btn--ghost" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              <WhatsApp />
              {clinic.whatsapp.display}
              <span className="sr-only"> — conversar pelo WhatsApp (abre em nova aba)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
