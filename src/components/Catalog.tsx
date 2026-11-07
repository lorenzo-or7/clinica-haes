import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MaskReveal } from './ui/Motion';

const ITEM = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const } },
};
import { asset, catalogGroups, type CatalogGroup } from '../data/clinic';
import { useMediaQuery } from '../lib/hooks';
import { Reveal } from './ui/Reveal';
import { ArrowRight, ChevronDown } from './ui/Icons';

type Props = {
  onRequest: (treatment: string) => void;
};

/**
 * Catálogo como guia ilustrado: as 10 categorias em quatro caminhos.
 * Desktop: índice editorial (abas acessíveis) + painel com gravura e lista do grupo.
 * Celular: cada caminho abre no próprio lugar (acordeão).
 * Cada tratamento preenche o formulário e leva até ele.
 */
export function Catalog({ onRequest }: Props) {
  const wide = useMediaQuery('(min-width: 900px)');
  return (
    <section id="catalogo" className="section catalog" aria-labelledby="catalog-title">
      <div className="container">
        <Reveal className="catalog__head">
          <p className="eyebrow">Tratamentos</p>
          <h2 id="catalog-title">O que você quer cuidar?</h2>
          <p>Escolha um caminho e toque no tratamento para levar o assunto direto ao pré-agendamento.</p>
        </Reveal>
        <Reveal y={24}>{wide ? <GuideTabs onRequest={onRequest} /> : <GuideAccordion onRequest={onRequest} />}</Reveal>
      </div>
    </section>
  );
}

function GroupArt({ group, className }: { group: CatalogGroup; className?: string }) {
  return (
    <img
      className={className}
      src={asset(`arts/${group.art}-880.webp`)}
      srcSet={`${asset(`arts/${group.art}-880.webp`)} 880w, ${asset(`arts/${group.art}-1600.webp`)} 1600w`}
      sizes="(min-width: 900px) 52vw, 100vw"
      width={1774}
      height={887}
      alt=""
      loading="lazy"
      decoding="async"
      style={{ objectPosition: group.artPosition }}
    />
  );
}

function ItemList({ group, onRequest }: { group: CatalogGroup; onRequest: (t: string) => void }) {
  return (
    <ul className="guide__items">
      {group.items.map((item) => (
        <li key={item.name}>
          <button type="button" className="guide__item" onClick={() => onRequest(item.name)}>
            <span className="guide__item-text">
              <span className="guide__item-name">{item.name}</span>
              <span className="guide__item-info">{item.info}</span>
            </span>
            <span className="sr-only">: solicitar avaliação</span>
            <span className="guide__arrow" aria-hidden="true">
              <ArrowRight width={18} height={18} />
            </span>
          </button>
          {item.options && (
            <ul className="guide__options" aria-label={`Opções de ${item.name}`}>
              {item.options.map((opt) => (
                <li key={opt}>
                  <button type="button" className="guide__option" onClick={() => onRequest(opt)}>
                    {opt}
                    <span className="sr-only">: solicitar avaliação</span>
                    <ArrowRight width={14} height={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

function GuideTabs({ onRequest }: Props) {
  const reduce = useReducedMotion();
  const uid = useId();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const group = catalogGroups[active];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = catalogGroups.length - 1;
    const map: Record<string, number> = {
      ArrowDown: i === last ? 0 : i + 1,
      ArrowRight: i === last ? 0 : i + 1,
      ArrowUp: i === 0 ? last : i - 1,
      ArrowLeft: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    };
    if (e.key in map) {
      e.preventDefault();
      setActive(map[e.key]);
      tabs.current[map[e.key]]?.focus();
    }
  };

  return (
    <div className="guide">
      <div className="guide__index" role="tablist" aria-label="Caminhos de tratamento" aria-orientation="vertical">
        {catalogGroups.map((g, i) => (
          <button
            key={g.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${g.id}`}
            aria-selected={i === active}
            aria-controls={`${uid}-panel`}
            tabIndex={i === active ? 0 : -1}
            className={`guide__tab ${i === active ? 'is-active' : ''}`}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span className="guide__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="guide__tab-title">{g.title}</span>
            <span className="guide__tab-count">
              {g.items.length} {g.items.length === 1 ? 'tratamento' : 'tratamentos'}
            </span>
          </button>
        ))}
      </div>

      <div
        className="guide__panel"
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${group.id}`}
        tabIndex={0}
      >
        {/* gravuras empilhadas: a troca é um crossfade, sem recarregar nem piscar */}
        <MaskReveal className="guide__art" from="bottom">
          {catalogGroups.map((g, i) => (
            <div key={g.id} className={`guide__art-layer ${i === active ? 'is-active' : ''}`} aria-hidden="true">
              <GroupArt group={g} />
            </div>
          ))}
        </MaskReveal>
        {/* título, frase e tratamentos entram juntos, em sequência curta, sem esperar saída */}
        <motion.div
          key={group.id}
          className="guide__body"
          initial={reduce ? false : 'hidden'}
          animate="shown"
          variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.04 } } }}
        >
          <motion.h3 className="guide__title" variants={ITEM}>
            {group.title}
          </motion.h3>
          <motion.p className="guide__lead" variants={ITEM}>
            {group.lead}
          </motion.p>
          <motion.div variants={ITEM}>
            <ItemList group={group} onRequest={onRequest} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function GuideAccordion({ onRequest }: Props) {
  const uid = useId();
  const [open, setOpen] = useState<string | null>(catalogGroups[0].id);
  return (
    <div className="guide-acc">
      {catalogGroups.map((g, i) => {
        const isOpen = open === g.id;
        return (
          <div key={g.id} className={`guide-acc__item ${isOpen ? 'is-open' : ''}`}>
            <h3 className="guide-acc__heading">
              <button
                type="button"
                id={`${uid}-${g.id}-btn`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-${g.id}-panel`}
                className="guide-acc__button"
                onClick={() => setOpen(isOpen ? null : g.id)}
              >
                <span className="guide__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="guide-acc__title">{g.title}</span>
                <ChevronDown className="chevron" />
              </button>
            </h3>
            <div
              id={`${uid}-${g.id}-panel`}
              role="region"
              aria-labelledby={`${uid}-${g.id}-btn`}
              className="guide-acc__panel"
              hidden={!isOpen}
            >
              <div className="guide-acc__art">
                <GroupArt group={g} />
              </div>
              <p className="guide__lead">{g.lead}</p>
              <ItemList group={g} onRequest={onRequest} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
