# Clínica HAES — protótipo demonstrativo

Site de página única para apresentação comercial às proprietárias da Clínica HAES. Projeto de Lorenzo, Or7.

React + TypeScript + Vite, CSS com tokens e Motion para animações. Sem backend: o pré-agendamento monta uma mensagem e abre o WhatsApp da clínica.

## Versão 2: estrutura e movimento com referência Lumiera (06/11/2026)

Reformulação autorizada para aproximar estrutura, composição e comportamento da referência https://lumiera.framer.website/, com identidade, conteúdo e fotos da HAES. O mapeamento completo e os movimentos medidos estão em [REFERENCIA-LUMIERA.md](REFERENCIA-LUMIERA.md).

Ordem atual: hero fotográfico (3 cenas) → faixa de atributos → a clínica + visita sincronizada → trilho de tratamentos → CTA fotográfico largo → catálogo (10 categorias) → depoimentos → equipe → FAQ + convite → galeria → localização → pré-agendamento → rodapé.

### Adaptações de conteúdo (sem inventar dados)
- **Estatísticas da referência:** viraram atributos confirmados ("Odontologia e estética facial", "Campo Grande, MS", "Atendimento com hora marcada", "Entrada acessível").
- **Selo numérico ("14 anos"):** virou um selo circular com o símbolo HAES. Nenhuma data ou tempo de atuação.
- **Imprensa ("As Seen In"), blog e newsletter:** omitidos. A conversão fica no pré-agendamento pelo WhatsApp, e a orientação de contato fica no FAQ.
- **Galeria social:** 5 fotos reais e o link para @clinicahaes, sem simular feed nem curtidas.
- **Catálogo:** sem preço, duração, popularidade ou abas, porque não há esses dados. Cada linha leva ao formulário com o tratamento preenchido.

### Divergências conscientes
- **Tratamentos sem fotos de procedimento:** não há fotos autorizadas (as artes de campanha não vieram neste pacote). Os cards usam composição tipográfica com o símbolo, no lugar das fotos de serviço da referência.
- **Café no hero:** a foto (632×842) não suporta largura total. No desktop, a cena 2 tem dois painéis reais (detalhes do ambiente + café); no celular, só o café.
- **Resolução das fotos:** as fotos da HAES têm no máximo 1440 px. O hero em 1440 px fica no limite da nitidez, e por isso a aproximação de entrada é 1,1 → 1, não 1,2 → 1 como na referência.
- **Parallax do CTA largo:** é uma aproximação. Não medi esse efeito na referência.

### Verificação desta versão
- `npm run typecheck` e `npm run build` sem erros.
- No navegador do Claude, em 1440×900, 390×844 e 375×812, nos dois temas. Medido por script e conferido em capturas (em `capturas/`): animação do título em andamento (blur 6 → 0, y 18 → 0), troca a 9 s com o CTA visível, navbar translúcida → sólida, sincronia texto/foto da visita em 16 pontos do progresso, ausência de rolagem horizontal, painel inferior do calendário (altura, foco, Tab, Escape), menu móvel, catálogo → formulário, diálogo → formulário, mensagem do WhatsApp.
- **Limitação do ambiente:** neste painel, o evento `scroll` só chega no quadro seguinte. A sincronia da visita foi validada disparando o evento logo após cada posição, e as capturas podem mostrar o quadro anterior. Não testei Safari/iOS nem leitores de tela reais.

## Comandos

Requer Node.js 20.19+ (ou 22.12+).

```bash
npm install        # usa o package-lock.json
npm run dev        # servidor local em http://localhost:5173
npm run build      # gera a pasta dist/
npm run preview    # serve o dist/ localmente
npm run typecheck  # checagem de tipos
```

## Publicar no GitHub Pages (subdiretório)

O `vite.config.ts` usa `base: './'`, então o mesmo `dist/` funciona em `https://usuario.github.io/nome-do-repo/` ou na raiz.

1. Rode `npm run build`.
2. Publique o **conteúdo** de `dist/` de uma destas formas:
   - **Branch `gh-pages`:** copie o conteúdo de `dist/` para a raiz de uma branch `gh-pages` e, em *Settings → Pages*, escolha essa branch.
   - **GitHub Actions:** em *Settings → Pages → Source*, escolha *GitHub Actions* e use o fluxo oficial "Static HTML" apontando para `dist`.
3. O arquivo `.nojekyll` já vai junto no `dist/`.

## Estrutura

```
index.html                     tema antes da primeira pintura, meta noindex
public/assets/                 fotos, retratos, marcas e fontes (mapeamento em LEIA-ME.txt)
src/data/clinic.ts             contatos, horários, equipe, tratamentos, depoimentos, pendências
src/lib/                       datas no fuso de Campo Grande; tema, media queries, rolagem
src/components/                Navbar, ThemeSwitch, Hero, AttributesStrip, ClinicStory, Treatments,
                               WideCta, Catalog, Reviews, Team, FAQ, Gallery, Location,
                               PreAppointment, ThemedCalendar, HaesSymbol, Footer, ui/
src/components/reactbits/      Profile Card original do React Bits + licença
src/styles/                    tokens, tipografia, global, layout (navbar/rodapé), seções
```

## Materiais integrados

| Material | Uso no site |
|---|---|
| `recepcao.jpg` | Abertura e cena 1 da visita |
| `cafe.png` | Cena 2 (632×842, baixa resolução) |
| `simbolo-parede.jpg` | Cena 3 |
| `fachada.png` | Localização, recorte 5:4 com menos céu e asfalto (679 px de largura) |
| Retratos anexados | Danielle = retrato de estúdio; Marianne = retrato na clínica (identificação confirmada pelo responsável) |
| `logo-haes-marfim.jpg` | Logos da navbar e do rodapé, com alpha real; variante de texto marfim para fundos escuros |
| `simbolo-haes.jpg` | Símbolo do pré-agendamento, como máscara no dourado do tema |
| Or7 (anexo) | Marca d'água do rodapé; o PNG já tinha alpha e não mostrou resíduos sobre o fundo escuro |
| Boska e Satoshi | Baixadas do Fontshare (WOFF2 oficiais + `FFL.txt`), auto-hospedagem permitida pela licença |

Os arquivos de origem não foram modificados. O mapeamento completo está em `public/assets/LEIA-ME.txt`.

## Profile Card (React Bits)

`src/components/reactbits/ProfileCard.tsx` e `.css` são o componente original (variante TS + CSS, commit `f586a29`), sob licença MIT + Commons Clause (`LICENSE-react-bits.md`). O uso como parte de um site é permitido; o componente não pode ser vendido ou redistribuído isoladamente. Alterações mínimas, marcadas com `HAES:` no código:

1. Ícone do botão de contato: `@hugeicons` trocado por SVG inline, para evitar duas dependências. O botão não é usado.
2. Nova prop `avatarAlt`, para o texto alternativo do retrato.
3. Inclinação e brilho só com mouse ou caneta (`hover: hover` e `pointer: fine`) e sem movimento reduzido. Toque não inclina o card.

Configuração: inclinação máxima de 5°, brilho dourado com opacidade 0,12, sem efeito holográfico, sem giroscópio e sem animação de entrada. As cores vêm dos tokens HAES (em `sections.css`). O retorno após o mouse sair usa a mola do próprio componente (cerca de 0,4 s), e não uma transição fixa de 300 ms.

## Referência Lumiera

A observação completa e o mapeamento estão em [REFERENCIA-LUMIERA.md](REFERENCIA-LUMIERA.md). Nenhum texto, foto, logo, número ou código da referência foi copiado.

## Pendências

- **SVG oficial do símbolo.** Sem ele, o símbolo do pré-agendamento aparece com fade, sem o desenho progressivo dos traços. A folha do seletor de tema usa uma geometria derivada das proporções da folha do símbolo raster, sem path oficial. O código já aceita o SVG: veja `public/assets/LEIA-ME.txt`.
- **Logo da navbar sem a linha "Odontologia e Saúde".** A linha foi removida por legibilidade, como no mockup aprovado. Confirmar com a clínica.
- **Retratos editados por IA:** falta a aprovação de semelhança pelas profissionais.
- **Fotos do café e da fachada:** baixa resolução de origem. Podem ficar suaves em telas grandes.
- **Intervalo de almoço:** a arte anterior indicava pausa, mas a ficha mais recente diz 08h às 18h. O site usa a ficha.
- **Pin exato do mapa:** a rota é feita pelo endereço, pela URL oficial do Google Maps.
- **Processo clínico da primeira consulta:** não confirmado. O site não cita duração, custo nem exames.
- **Campanhas:** bioestimulador e ultrassom Visage ficam fora da oferta pública até confirmação.
- **Textos propostos:** falta a revisão da clínica (tratamentos, visita guiada, passos da primeira visita).
- **CRO da Dra. Marianne** sem UF ("CRO 6891").
- **Nota 5,0:** informada pelo responsável, sem total de avaliações.
