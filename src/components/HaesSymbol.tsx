/**
 * Símbolo HAES animado.
 *
 * Situação atual: não há SVG oficial. O símbolo usa o raster oficial (haes-simbolo.png,
 * fundo convertido em alpha real) como máscara CSS, pintado com o dourado do tema atual.
 * Entrada única ao chegar a ~30% da viewport: fade discreto de 2s, sem deformar o desenho
 * e sem traçar curvas novas (nenhuma vetorização inventada).
 *
 * Quando o SVG oficial existir, defina brand.symbolSvg em src/data/clinic.ts: o componente
 * passa a desenhar os traços com stroke-dasharray/stroke-dashoffset (ou máscara circular se
 * o arquivo for de formas preenchidas).
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import { asset, brand } from '../data/clinic';
import { supportsObserver } from '../lib/hooks';

const SHAPES = 'path, circle, ellipse, line, polyline, polygon, rect';

/** Remove scripts e handlers; aplica currentColor para herdar o dourado do tema. */
function prepareSvg(text: string): SVGSVGElement | null {
  if (!text.includes('<svg')) return null;
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  if (!svg || doc.querySelector('parsererror')) return null;
  svg.querySelectorAll('script, foreignObject').forEach((n) => n.remove());
  svg.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith('on') || /javascript:/i.test(attr.value)) el.removeAttribute(attr.name);
    }
  });
  svg.querySelectorAll(SHAPES).forEach((el) => {
    if (el.getAttribute('fill') !== 'none') el.setAttribute('fill', 'currentColor');
    const stroke = el.getAttribute('stroke');
    if (stroke && stroke !== 'none') el.setAttribute('stroke', 'currentColor');
  });
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  return document.importNode(svg, true) as unknown as SVGSVGElement;
}

export function HaesSymbol({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const svgHostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [svgReady, setSvgReady] = useState(false);

  // Entrada única a ~30% de visibilidade
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (reduce || !supportsObserver()) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  // SVG oficial (apenas se configurado)
  useEffect(() => {
    if (!brand.symbolSvg) return;
    let cancelled = false;
    fetch(asset(brand.symbolSvg))
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((text) => {
        const svg = prepareSvg(text);
        if (cancelled || !svg || !svgHostRef.current) return;
        svgHostRef.current.replaceChildren(svg);
        setSvgReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!svgReady) return;
    const svg = svgHostRef.current?.querySelector('svg');
    if (!svg || svg.dataset.drawn === 'true') return;
    const shapes = Array.from(svg.querySelectorAll<SVGGeometryElement>(SHAPES));
    const stroked = shapes.filter((s) => {
      const stroke = getComputedStyle(s).stroke;
      return stroke && stroke !== 'none' && typeof s.getTotalLength === 'function';
    });
    const filled = shapes.length > 0 && stroked.length === 0;
    svg.dataset.mode = filled ? 'mask' : 'stroke';
    if (reduce) {
      svg.dataset.drawn = 'true';
      return;
    }
    if (!filled) {
      stroked.forEach((s) => {
        const len = Math.ceil(s.getTotalLength());
        s.style.strokeDasharray = `${len}`;
        s.style.strokeDashoffset = `${len}`;
      });
    }
    if (!visible) return;
    svg.getBoundingClientRect();
    const frame = requestAnimationFrame(() => {
      svg.dataset.drawn = 'true';
      if (!filled) stroked.forEach((s) => (s.style.strokeDashoffset = '0'));
    });
    return () => cancelAnimationFrame(frame);
  }, [svgReady, visible, reduce]);

  const maskStyle = {
    // URL absoluta: url() dentro de variável CSS seria resolvida em relação à folha de estilo (static/)
    '--symbol-mask': `url("${new URL(asset(brand.symbol.src), document.baseURI).href}")`,
    aspectRatio: `${brand.symbol.width} / ${brand.symbol.height}`,
  } as CSSProperties;

  return (
    <div ref={rootRef} className={`haes-symbol ${visible ? 'is-visible' : ''} ${className ?? ''}`} aria-hidden="true">
      {brand.symbolSvg ? (
        <div ref={svgHostRef} className="haes-symbol__svg" />
      ) : (
        <span className="haes-symbol__raster" style={maskStyle} />
      )}
    </div>
  );
}
