import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
  WEEKDAYS,
  addDays,
  addMonths,
  formatBR,
  formatLong,
  formatMonth,
  isSelectable,
  monthGrid,
  monthStart,
  sameMonth,
  todayInClinic,
  weekdayMon,
  type ISODate,
} from '../lib/date';
import { useMediaQuery } from '../lib/hooks';
import { Calendar, ChevronLeft, ChevronRight, Close } from './ui/Icons';

type Props = {
  value: ISODate | null;
  onChange: (value: ISODate | null) => void;
  /** Quantos meses à frente podem ser navegados. */
  monthsAhead?: number;
};

/**
 * Calendário próprio em pt-BR (sem seletor nativo do navegador).
 * Grade com roving tabindex: setas, Home/End, PageUp/PageDown (Shift = ano), Enter/Espaço, Escape.
 * Dias passados e fins de semana ficam indisponíveis; dias úteis futuros são só preferência.
 */
export function ThemedCalendar({ value, onChange, monthsAhead = 12 }: Props) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const readoutId = `${uid}-readout`;
  const monthId = `${uid}-month`;
  const popoverId = `${uid}-popover`;

  const today = useMemo(() => todayInClinic(), []);
  const minMonth = monthStart(today);
  const maxMonth = addMonths(minMonth, monthsAhead);

  const [open, setOpen] = useState(false);
  /** Celular: painel inferior modal (máx. ~85svh), com fechamento explícito. */
  const sheet = useMediaQuery('(max-width: 640px)');
  const popoverRef = useRef<HTMLDivElement>(null);
  const [focusDate, setFocusDate] = useState<ISODate>(value ?? today);
  const [moveFocus, setMoveFocus] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLTableElement>(null);

  const clamp = useCallback(
    (iso: ISODate) => {
      if (iso < minMonth) return minMonth;
      const lastDay = addDays(addMonths(maxMonth, 1), -1);
      if (iso > lastDay) return lastDay;
      return iso;
    },
    [minMonth, maxMonth],
  );

  const firstSelectable = useCallback(() => {
    let d = today;
    while (!isSelectable(d, today)) d = addDays(d, 1);
    return d;
  }, [today]);

  const openCalendar = () => {
    setFocusDate(value ?? firstSelectable());
    setMoveFocus(true);
    setOpen(true);
  };

  const closeCalendar = useCallback((restore = true) => {
    setOpen(false);
    if (restore) triggerRef.current?.focus();
  }, []);

  // Move o foco para o dia ativo quando a navegação vem do teclado
  useLayoutEffect(() => {
    if (!open || !moveFocus) return;
    gridRef.current?.querySelector<HTMLElement>(`[data-iso="${focusDate}"]`)?.focus();
    setMoveFocus(false);
  }, [open, moveFocus, focusDate]);

  // Clique fora fecha sem roubar o foco
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) closeCalendar(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open, closeCalendar]);

  const select = (iso: ISODate) => {
    if (!isSelectable(iso, today)) return;
    onChange(iso);
    closeCalendar();
  };

  const go = (iso: ISODate) => {
    setFocusDate(clamp(iso));
    setMoveFocus(true);
  };

  const onGridKey = (e: KeyboardEvent<HTMLTableElement>) => {
    const keyMap: Record<string, () => ISODate> = {
      ArrowLeft: () => addDays(focusDate, -1),
      ArrowRight: () => addDays(focusDate, 1),
      ArrowUp: () => addDays(focusDate, -7),
      ArrowDown: () => addDays(focusDate, 7),
      Home: () => addDays(focusDate, -weekdayMon(focusDate)),
      End: () => addDays(focusDate, 6 - weekdayMon(focusDate)),
      PageUp: () => addMonths(focusDate, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focusDate, e.shiftKey ? 12 : 1),
    };
    if (keyMap[e.key]) {
      e.preventDefault();
      go(keyMap[e.key]());
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(focusDate);
    }
  };

  const onDialogKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeCalendar();
      return;
    }
    // Painel inferior é modal: Tab circula dentro dele
    if (sheet && e.key === 'Tab' && popoverRef.current) {
      const items = Array.from(
        popoverRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex="0"]'),
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // Bloqueia a rolagem da página enquanto o painel inferior está aberto
  useEffect(() => {
    if (!open || !sheet) return;
    document.body.classList.add('is-locked');
    return () => document.body.classList.remove('is-locked');
  }, [open, sheet]);

  const changeMonth = (delta: number) => setFocusDate((d) => clamp(addMonths(d, delta)));

  const weeks = monthGrid(focusDate);
  const canPrev = !sameMonth(focusDate, minMonth);
  const canNext = !sameMonth(focusDate, maxMonth);

  return (
    <div
      className="datefield"
      ref={wrapRef}
      onBlur={(e) => {
        // Tab para fora do calendário fecha o painel (relatedTarget nulo = foco perdido por botão desabilitado)
        const next = e.relatedTarget as Node | null;
        if (open && next && !e.currentTarget.contains(next)) closeCalendar(false);
      }}
    >
      <span id={labelId} className="field__label">
        Data de preferência <span className="field__optional">(opcional)</span>
      </span>

      <div className="datefield__row">
        <button
          ref={triggerRef}
          type="button"
          className={`datefield__trigger themed ${value ? 'has-value' : ''}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popoverId : undefined}
          aria-labelledby={`${labelId} ${uid}-trigger-text`}
          aria-describedby={readoutId}
          onClick={() => (open ? closeCalendar() : openCalendar())}
        >
          <Calendar width={20} height={20} />
          <span id={`${uid}-trigger-text`}>{value ? formatBR(value) : 'Escolher data'}</span>
        </button>
        {value && (
          <button
            type="button"
            className="datefield__clear"
            onClick={() => {
              onChange(null);
              triggerRef.current?.focus();
            }}
          >
            <Close width={16} height={16} />
            Limpar data
          </button>
        )}
      </div>

      <p id={readoutId} className="datefield__readout" aria-live="polite">
        {value
          ? `Preferência: ${formatLong(value)}. A equipe confirma a disponibilidade.`
          : 'Nenhuma data escolhida. Você pode enviar sem data.'}
      </p>

      {open && sheet && <div className="calendar-backdrop" aria-hidden="true" onClick={() => closeCalendar()} />}
      {open && (
        <div
          id={popoverId}
          ref={popoverRef}
          className={`calendar themed ${sheet ? 'calendar--sheet' : ''}`}
          role="dialog"
          aria-modal={sheet ? 'true' : 'false'}
          aria-labelledby={monthId}
          onKeyDown={onDialogKey}
        >
          {sheet && (
            <div className="calendar__sheet-top">
              <span className="calendar__grabber" aria-hidden="true" />
              <p className="calendar__sheet-title">Data de preferência</p>
              <button type="button" className="calendar__close" onClick={() => closeCalendar()}>
                <Close width={18} height={18} />
                Fechar
              </button>
            </div>
          )}
          <div className="calendar__head">
            <button
              type="button"
              className="calendar__nav"
              onClick={() => changeMonth(-1)}
              disabled={!canPrev}
              aria-label="Mês anterior"
            >
              <ChevronLeft />
            </button>
            <p id={monthId} className="calendar__month" aria-live="polite">
              {formatMonth(focusDate)}
            </p>
            <button
              type="button"
              className="calendar__nav"
              onClick={() => changeMonth(1)}
              disabled={!canNext}
              aria-label="Próximo mês"
            >
              <ChevronRight />
            </button>
          </div>

          <table className="calendar__grid" role="grid" aria-labelledby={monthId} ref={gridRef} onKeyDown={onGridKey}>
            <thead>
              <tr>
                {WEEKDAYS.map((w) => (
                  <th key={w.short} scope="col" abbr={w.long}>
                    {w.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, wi) => (
                <tr key={wi}>
                  {week.map((iso, di) => {
                    if (!iso) return <td key={di} className="calendar__empty" />;
                    const available = isSelectable(iso, today);
                    const selected = iso === value;
                    return (
                      <td
                        key={iso}
                        role="gridcell"
                        data-iso={iso}
                        tabIndex={iso === focusDate ? 0 : -1}
                        aria-selected={selected}
                        aria-disabled={!available || undefined}
                        aria-current={iso === today ? 'date' : undefined}
                        aria-label={`${formatLong(iso)}${available ? '' : ', indisponível'}`}
                        className={[
                          'calendar__day',
                          available ? '' : 'is-disabled',
                          selected ? 'is-selected' : '',
                          iso === today ? 'is-today' : '',
                        ].join(' ')}
                        onClick={() => {
                          setFocusDate(iso);
                          select(iso);
                        }}
                      >
                        <span aria-hidden="true">{Number(iso.slice(8))}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="calendar__hint">Dias úteis indicam preferência, não vaga reservada.</p>
        </div>
      )}
    </div>
  );
}
