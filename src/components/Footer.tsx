import { asset, brand, clinic, mapsRouteUrl, navLinks, whatsappUrl } from '../data/clinic';
import { HaesLogo } from './ui/Brand';
import { Clock, Instagram, Pin, WhatsApp } from './ui/Icons';

/**
 * Rodapé na composição da referência: cantos superiores amplos, linha de contatos com ícone,
 * colunas de links e assinatura. Fundo #17271D nos dois temas. Sem newsletter, blog ou link morto.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const { address } = clinic;
  return (
    <footer className="footer">
      <div className="container">
        <ul className="footer__contacts">
          <li>
            <span className="footer__icon" aria-hidden="true">
              <Pin width={18} height={18} />
            </span>
            <div>
              <h2 className="footer__label">Endereço</h2>
              <a href={mapsRouteUrl} target="_blank" rel="noopener noreferrer">
                {address.street}, {address.district}
                <br />
                {address.city} — {address.state}, {address.zip}
                <span className="sr-only"> (rota no Google Maps, abre em nova aba)</span>
              </a>
            </div>
          </li>
          <li>
            <span className="footer__icon" aria-hidden="true">
              <Clock width={18} height={18} />
            </span>
            <div>
              <h2 className="footer__label">Horários</h2>
              <p>
                {clinic.hours[0].days}, {clinic.hours[0].time}
                <br />
                {clinic.hours[1].days}: {clinic.hours[1].time.toLowerCase()}
              </p>
            </div>
          </li>
          <li>
            <span className="footer__icon" aria-hidden="true">
              <WhatsApp width={18} height={18} />
            </span>
            <div>
              <h2 className="footer__label">WhatsApp</h2>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                {clinic.whatsapp.display}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </div>
          </li>
          <li>
            <span className="footer__icon" aria-hidden="true">
              <Instagram width={18} height={18} />
            </span>
            <div>
              <h2 className="footer__label">Instagram</h2>
              <a href={clinic.instagram} target="_blank" rel="noopener noreferrer">
                @clinicahaes
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </div>
          </li>
        </ul>

        <div className="footer__main">
          <div className="footer__brand">
            <HaesLogo
              logo={brand.logo}
              alt="Clínica HAES — Odontologia e Saúde"
              className="footer__logo"
              mode="dark-surface"
            />
            <p>Odontologia e estética facial em Campo Grande, MS. Atendimento com hora marcada.</p>
          </div>
          <nav className="footer__col" aria-label="Seções do site">
            <h2 className="footer__title">Navegue</h2>
            <ul>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="footer__col" aria-label="Atendimento">
            <h2 className="footer__title">Atendimento</h2>
            <ul>
              <li>
                <a href="#catalogo">Tratamentos</a>
              </li>
              <li>
                <a href="#avaliacoes">Avaliações</a>
              </li>
              <li>
                <a href="#duvidas">Dúvidas</a>
              </li>
              <li>
                <a href="#pre-agendamento">Pré-agendamento</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <p className="footer__meta">
            © {year} Clínica HAES · Protótipo demonstrativo desenvolvido por Or7
          </p>
          <a className="footer__or7" href="https://lorenzo-or7.github.io/" target="_blank" rel="noopener noreferrer">
            <img
              className="footer__or7-img"
              src={asset(brand.or7.src)}
              alt="Or7 — portfólio de Lorenzo"
              width={brand.or7.width}
              height={brand.or7.height}
              loading="lazy"
              decoding="async"
            />
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
