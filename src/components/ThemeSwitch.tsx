import type { Theme } from '../lib/hooks';
import { Leaf, Moon, Sun } from './ui/Icons';

type Props = {
  theme: Theme;
  onChange: (theme: Theme) => void;
  className?: string;
};

/**
 * Botão 07 aprovado — "Folha deslizante".
 * Cápsula com sol e lua; a folha dourada desliza até a posição do tema ativo.
 */
export function ThemeSwitch({ theme, onChange, className }: Props) {
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Tema escuro"
      className={`theme-switch ${className ?? ''}`}
      data-state={dark ? 'dark' : 'light'}
      onClick={() => onChange(dark ? 'light' : 'dark')}
    >
      <span className="theme-switch__track" aria-hidden="true">
        <Sun className="theme-switch__icon theme-switch__icon--sun" width={16} height={16} />
        <Moon className="theme-switch__icon theme-switch__icon--moon" width={15} height={15} />
        <span className="theme-switch__thumb">
          <Leaf width={18} height={18} />
        </span>
      </span>
    </button>
  );
}
