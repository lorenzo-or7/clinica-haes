import { categoryInfo, treatmentCategories } from '../data/clinic';
import { Reveal } from './ui/Reveal';
import { ArrowRight } from './ui/Icons';

type Props = {
  onRequest: (treatment: string) => void;
};

/**
 * Catálogo compacto das dez categorias fornecidas. Sem preço, duração, popularidade ou
 * disponibilidade (não há dados). Cada linha leva ao pré-agendamento com o tratamento preenchido.
 */
export function Catalog({ onRequest }: Props) {
  return (
    <section id="catalogo" className="section section--tight catalog" aria-labelledby="catalog-title">
      <div className="container">
        <Reveal className="center-head">
          <p className="eyebrow eyebrow--center">Catálogo</p>
          <h2 id="catalog-title">Todos os tratamentos da HAES.</h2>
          <p>Toxina botulínica e preenchimento facial fazem parte da harmonização facial.</p>
        </Reveal>
        <Reveal y={24}>
          <ul className="catalog__list">
            {treatmentCategories.map((name, i) => (
              <li key={name}>
                <button type="button" className="catalog__row" onClick={() => onRequest(name)}>
                  <span className="catalog__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="catalog__main">
                    <span className="catalog__name">{name}</span>
                    <span className="catalog__info">
                      {categoryInfo[name] ?? 'Odontologia'}
                    </span>
                  </span>
                  <span className="sr-only">: solicitar avaliação</span>
                  <span className="catalog__arrow" aria-hidden="true">
                    <ArrowRight width={18} height={18} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
