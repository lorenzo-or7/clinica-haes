import { useMemo, useRef, useState, type FormEvent } from 'react';
import { GENERAL_EVALUATION, treatmentOptions, whatsappUrl } from '../data/clinic';
import { formatBR, type ISODate } from '../lib/date';
import { HaesSymbol } from './HaesSymbol';
import { ThemedCalendar } from './ThemedCalendar';
import { WhatsApp } from './ui/Icons';

type Props = {
  treatment: string;
  onTreatmentChange: (value: string) => void;
};

/** Mensagem natural, só com os campos preenchidos. */
export function buildMessage(name: string, treatment: string, date: ISODate | null) {
  const lines = ['Olá! Gostaria de solicitar uma avaliação na Clínica HAES.'];
  const cleanName = name.trim().replace(/\s+/g, ' ');
  if (cleanName) lines.push(`Meu nome é ${cleanName}.`);
  if (treatment && treatment !== GENERAL_EVALUATION) lines.push(`Tenho interesse em: ${treatment}.`);
  if (date) lines.push(`Minha preferência de data é ${formatBR(date)}. Poderiam confirmar a disponibilidade?`);
  return lines.join('\n');
}

export function PreAppointment({ treatment, onTreatmentChange }: Props) {
  const [name, setName] = useState('');
  const [date, setDate] = useState<ISODate | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const href = useMemo(() => whatsappUrl(buildMessage(name, treatment, date)), [name, treatment, date]);

  // Enter dentro do formulário aciona o mesmo link (gesto do usuário, sem bloqueio de pop-up)
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    linkRef.current?.click();
  };

  return (
    <section id="pre-agendamento" className="section booking" aria-labelledby="booking-title">
      <div className="container booking__grid">
        <div className="booking__intro">
          <p className="eyebrow">Pré-agendamento</p>
          <h2 id="booking-title" tabIndex={-1}>
            Pré-agende sua avaliação.
          </h2>
          <p className="lead">
            Escolha um assunto e, se quiser, uma data de preferência. Todos os campos são opcionais.
          </p>
          <HaesSymbol className="booking__symbol" />
        </div>

        <form className="booking__form themed" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="booking-name">
              Nome <span className="field__optional">(opcional)</span>
            </label>
            <input
              id="booking-name"
              className="field__input themed"
              type="text"
              name="nome"
              autoComplete="given-name"
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como podemos chamar você?"
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="booking-treatment">
              Tratamento <span className="field__optional">(opcional)</span>
            </label>
            <div className="field__select-wrap">
              <select
                id="booking-treatment"
                className="field__input field__select themed"
                name="tratamento"
                value={treatment}
                onChange={(e) => onTreatmentChange(e.target.value)}
              >
                {treatmentOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ThemedCalendar value={date} onChange={setDate} />

          <div className="booking__submit">
            <a
              ref={linkRef}
              className="btn btn--primary booking__cta"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsApp />
              Pré-agendar pelo WhatsApp
              <span className="sr-only"> (abre uma conversa no WhatsApp em nova aba)</span>
            </a>
            <p className="booking__note">
              Você revisa a mensagem antes de enviar. O horário só fica reservado depois da confirmação da equipe.
              Não compartilhe aqui informações de saúde.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
