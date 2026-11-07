import { useCallback, useEffect, useRef, useState } from 'react';
import { brand, clinic, navLinks, whatsappUrl } from '../data/clinic';
import { type Theme } from '../lib/hooks';
import { ThemeSwitch } from './ThemeSwitch';
import { HaesLogo } from './ui/Brand';
import { Close, Menu, WhatsApp } from './ui/Icons';

/** true enquanto a navbar está sobre o hero fotográfico. */
function useOverHero() {
  const [over, setOver] = useState(true);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.getElementById('inicio');
      setOver(!!hero && hero.getBoundingClientRect().bottom > 110);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return over;
}

/** Seção visível no centro da tela, para o sublinhado discreto do link ativo. */
const SPY: Record<string, string> = {
  clinica: '#clinica',
  tratamentos: '#tratamentos',
  catalogo: '#tratamentos',
  equipe: '#equipe',
  localizacao: '#localizacao',
};

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const current = Object.keys(SPY).find((id) => seen.get(id));
        setActive(current ? SPY[current] : null);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    Object.keys(SPY).forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

type Props = {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Navbar({ theme, onThemeChange }: Props) {
  const overHero = useOverHero();
  const activeHref = useActiveSection();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    // o gatilho continua montado: o foco volta direto, sem depender de requestAnimationFrame
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // Foco, Escape e bloqueio de rolagem do painel móvel
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    document.body.classList.add('is-locked');
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      const scope = [triggerRef.current, ...items].filter(Boolean) as HTMLElement[];
      const first = scope[0];
      const last = scope[scope.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
    };
  }, [open, close]);

  // Fecha o painel se a tela passar para o layout desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1100px)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <header className={`nav ${overHero && !open ? 'nav--over' : 'nav--solid'} ${open ? 'nav--open' : ''}`}>
      <div className="nav__bar">
        <div className="nav__start">
          <button
            ref={triggerRef}
            type="button"
            className="nav__menu-btn"
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => (open ? close() : setOpen(true))}
          >
            {open ? <Close width={22} height={22} /> : <Menu width={22} height={22} />}
          </button>
          <nav className="nav__links" aria-label="Principal">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={activeHref === link.href ? 'is-active' : undefined}
                    aria-current={activeHref === link.href ? 'location' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <a className="nav__brand" href="#inicio" aria-label="Clínica HAES — início" onClick={() => close(false)}>
          <HaesLogo logo={brand.logoNav} alt="" className="nav__logo" />
        </a>

        <div className="nav__actions">
          <ThemeSwitch theme={theme} onChange={onThemeChange} className="nav__switch" />
          <a className="btn btn--small nav__cta" href="#pre-agendamento">
            Pré-agendar
          </a>
          <a
            className="nav__icon-link"
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Conversar pelo WhatsApp ${clinic.whatsapp.display} (abre em nova aba)`}
          >
            <WhatsApp width={20} height={20} />
          </a>
        </div>
      </div>

      {open && (
        <div
          id="menu-movel"
          ref={panelRef}
          className="nav__panel themed"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <nav aria-label="Menu principal">
            <ul className="nav__panel-links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={() => close(false)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav__panel-foot">
            <div className="nav__panel-theme">
              <span>Tema</span>
              <ThemeSwitch theme={theme} onChange={onThemeChange} />
            </div>
            <a className="btn btn--primary" href="#pre-agendamento" onClick={() => close(false)}>
              Pré-agendar
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
