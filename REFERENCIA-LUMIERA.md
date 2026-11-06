# Lumiera → HAES: mapeamento e movimentos observados

Inspeção em 06/11/2026, no navegador do Claude, em 1440×900 e 390×844. Medições feitas por script nos estilos computados, com o painel visível, mais capturas. Nada da Lumiera (código, texto, fotos, logos, números) foi copiado.

## Movimentos medidos

| Bloco | Observado | Aplicado na HAES |
|---|---|---|
| Hero: título | Revelado **caractere por caractere**: opacidade 0→1, `blur(10px)`→0, `translateY(10px)`→0. Cerca de 250 ms por caractere e 40 ms de intervalo. Repete a cada troca de slide | Mesmo tipo de revelação, por caractere, sem quebrar palavras: blur máx. 6 px, y 18 px, 36 ms de intervalo (dentro dos limites do briefing) |
| Hero: imagem | Troca a cada **~10 s**. A nova imagem entra com escala **1,2 → 1** em ~1 s e fica parada depois | Crossfade de 900 ms, escala 1,1 → 1 em 1,4 s, intervalo de 9 s. A escala é menor porque as fotos HAES têm no máximo 1440 px |
| Hero: controles | Indicador de 3 pontos na base (ativo alongado) | Setas, pontos, pausar/reproduzir |
| Navbar | Cápsula (raio 120 px), a 30 px do topo, 72 px de altura, margem lateral ~43 px. No hero: `rgba(255,255,255,.02)` + `blur(20px)`, texto branco. Fora do hero: branco sólido, texto escuro. Links à esquerda, marca ao centro, telefone e CTA à direita | Mesma lógica: vidro sobre o hero, superfície sólida do tema depois. Links à esquerda, logo ao centro, folha deslizante e CTA à direita |
| Faixa de atributos | Superfície com cantos superiores arredondados sobreposta à base do hero. Desliza para a esquerda a **~30 px/s** | Faixa marfim (verde no escuro) com 4 atributos confirmados, 30 px/s, pausa no hover/foco, estática com movimento reduzido |
| Entrada dos blocos | Container inteiro: opacidade 0→1 e `translateY` 30–57 px → 0 em ~900 ms (desaceleração). Sem animação por letra fora do hero | `Reveal` por bloco: y 32 px, 900 ms. Sem animação por letra fora do hero |
| Apresentação | Texto + lista + CTA à esquerda, foto grande arredondada à direita, selo circular com texto sobreposto à foto, legenda em pílula sobre a imagem | Mesma composição, com a visita recepção → café → símbolo em palco sticky. O selo numérico virou selo circular HAES |
| Serviços | Cabeçalho com link lateral, trilho de cards (foto + barra com nome e seta), setas abaixo. No celular, 1 card + parte do próximo | Mesmo trilho. Sem fotos de procedimento: painéis tipográficos com o símbolo |
| CTA largo | Foto em largura total com título, texto e botão centrais. Entrada do bloco por fade-up | Mesmo papel, com foto real da clínica |
| Catálogo | Abas por categoria e linhas compactas (miniatura, nome, preço, duração, selo) em 2 colunas | Linhas compactas em 2 colunas, sem abas, preço, duração ou selos (não há esses dados) |
| Depoimento | Imagem à esquerda, painel claro à direita com citação grande, estrelas, autor e setas | Mesma composição, com foto do ambiente e os 3 depoimentos aprovados |
| "As Seen In" | Faixa de logos de imprensa | **Omitido** (não há imprensa confirmada) |
| Equipe | Título central e 4 cards com retrato | Título central e 2 Profile Cards React Bits |
| FAQ | Acordeão à esquerda, card escuro com foto e convite para contato à direita | Mesma composição; o card traz os 3 passos da primeira visita |
| Blog | 3 artigos | **Omitido** (não há artigos reais). A orientação de contato fica no FAQ |
| Galeria social | 4 fotos quadradas e link do Instagram | 5 fotos reais da HAES e link para @clinicahaes, sem simular feed |
| Newsletter | Campo de e-mail no rodapé | **Omitido**. A conversão é o pré-agendamento pelo WhatsApp |
| Rodapé | Cantos superiores arredondados, linha de 4 contatos com ícone e colunas de links | Mesma estrutura com dados HAES, fundo #17271D, logo completo e marca Or7 |

## Não medido

- Curva de easing exata (só o perfil: desaceleração).
- Existência de parallax na imagem do CTA largo. Na HAES usei parallax leve, como aproximação declarada.
- Comportamento das setas do trilho e do depoimento no celular (não acionei).
- Abertura do menu mobile da referência.
