/**
 * Conteúdo da Clínica HAES.
 * Tudo aqui vem do briefing consolidado. Textos marcados como "proposto" ainda
 * dependem de revisão da clínica. Não acrescente dados sem confirmação.
 */

/** Caminho de um arquivo em public/assets, compatível com subdiretório do GitHub Pages. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;

export type PhotoSource = {
  /** Tentados em ordem; se nenhum existir, aparece um bloco neutro. */
  sources: string[];
  /** Versões WebP por largura real (sem ampliação), usadas em srcset. */
  srcset?: [path: string, width: number][];
  /** Dimensões intrínsecas do arquivo, para reservar espaço. */
  width: number;
  height: number;
  alt: string;
  /** object-position individual, para preservar rostos e detalhes. */
  position?: string;
  /** Rótulo do bloco neutro caso o arquivo falhe. */
  pending: string;
};

const photo = (
  name: string,
  widths: number[],
  size: [number, number],
  alt: string,
  position: string,
): PhotoSource => ({
  sources: [`photos/${name}.jpg`],
  srcset: widths.map((w) => [`photos/${name}-${w}.webp`, w]),
  width: size[0],
  height: size[1],
  alt,
  position,
  pending: `Foto: ${name}`,
});

/**
 * Fotos reais fornecidas (HAES-Materiais-Recuperados), otimizadas sem ampliar pixels.
 * Café (632×842) e fachada (679×543 após recorte) têm baixa resolução de origem.
 */
export const photos = {
  recepcao: photo(
    'recepcao',
    [720, 1080, 1440],
    [1440, 1440],
    'Poltrona e mesa lateral na recepção da Clínica HAES',
    '64% 50%',
  ),
  cafe: photo('cafe', [632], [632, 842], 'Café servido em copo da Clínica HAES sobre bandeja dourada', '50% 62%'),
  simboloParede: photo(
    'simbolo-parede',
    [720, 1080, 1440],
    [1440, 1440],
    'Símbolo da HAES em metal na parede da clínica',
    '40% 50%',
  ),
  // recorte conservador 5:4 já aplicado no arquivo: menos céu e asfalto, entrada e totem preservados
  fachada: photo('fachada', [679], [679, 543], 'Fachada da Clínica HAES, com o totem verde na entrada', '50% 50%'),
  detalhes: photo(
    'detalhes',
    [720, 1080, 1440],
    [1440, 1440],
    'Difusor, saboneteira e planta sobre a mesa da recepção da HAES',
    '50% 55%',
  ),
};

export type HeroSlide = {
  id: string;
  title: string;
  /** Trecho final do título em Boska Italic (opcional). */
  italic?: string;
  support: string;
  cta: { label: string; href: string };
  /** Foto principal (celular e desktop). */
  photo: PhotoSource;
  /** Desktop: segundo painel real quando a foto principal é estreita demais para ocupar a tela. */
  companion?: PhotoSource;
  /** Enquadramento por viewport. */
  position: { desktop: string; mobile: string };
};

/**
 * Hero em três cenas. A foto do café (632×842) não suporta a largura total no desktop:
 * lá ela aparece em dois painéis reais, ao lado da foto de detalhes do ambiente.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: 'recepcao',
    title: 'Cuidado em',
    italic: 'cada detalhe.',
    support: 'Odontologia e estética facial com atenção a você.',
    cta: { label: 'Solicitar avaliação', href: '#pre-agendamento' },
    photo: photos.recepcao,
    position: { desktop: '50% 62%', mobile: '66% 50%' },
  },
  {
    id: 'cafe',
    title: 'Os detalhes também acolhem.',
    support: 'Conheça o ambiente da Clínica HAES.',
    cta: { label: 'Conheça a clínica', href: '#clinica' },
    photo: photos.cafe,
    companion: photos.detalhes,
    position: { desktop: '50% 58%', mobile: '50% 60%' },
  },
  {
    id: 'simbolo',
    title: 'Saúde, função e estética.',
    support: 'Conheça as profissionais que recebem você.',
    cta: { label: 'Conheça a equipe', href: '#equipe' },
    photo: photos.simboloParede,
    position: { desktop: '42% 48%', mobile: '40% 50%' },
  },
];

/** Atributos confirmados (substituem as estatísticas da referência). */
export const attributes = [
  { icon: 'tooth', label: 'Odontologia e estética facial' },
  { icon: 'pin', label: 'Campo Grande, MS' },
  { icon: 'clock', label: 'Atendimento com hora marcada' },
  { icon: 'access', label: 'Entrada acessível' },
] as const;

/** Galeria de detalhes reais (função da faixa social da referência). */
export const gallery = [
  photos.recepcao,
  photos.cafe,
  photos.simboloParede,
  photos.detalhes,
  photos.fachada,
];

/**
 * Marca: rasters oficiais com fundo convertido em canal alpha real.
 * "-claro" = texto marfim para fundos escuros (mesma combinação da variante oficial em verde).
 * "-nav" = sem a linha "Odontologia e Saúde", ilegível na altura da navbar (como no mockup aprovado).
 * Não há SVG oficial: symbolSvg fica nulo até o arquivo existir.
 */
export const brand = {
  logo: { light: 'brand/haes-logo.png', dark: 'brand/haes-logo-claro.png', width: 854, height: 152 },
  logoNav: { light: 'brand/haes-logo-nav.png', dark: 'brand/haes-logo-nav-claro.png', width: 854, height: 152 },
  symbolSvg: null as string | null,
  symbol: { src: 'brand/haes-simbolo.png', width: 395, height: 250 },
  or7: { src: 'brand/or7-logo.png', width: 1842, height: 252 },
};

const address = {
  street: 'Rua Aluízio de Azevedo, 18',
  district: 'Jardim Monte Líbano',
  city: 'Campo Grande',
  state: 'MS',
  zip: '79004-050',
};

export const clinic = {
  name: 'Clínica HAES',
  address,
  addressLine: `${address.street} — ${address.district}, ${address.city} — ${address.state}, ${address.zip}`,
  whatsapp: {
    number: '5567996688933',
    display: '(67) 99668-8933',
  },
  instagram: 'https://www.instagram.com/clinicahaes/',
  hours: [
    { days: 'Segunda a sexta', time: '08h às 18h' },
    { days: 'Sábado e domingo', time: 'Fechado' },
  ],
  amenities: [
    'Entrada e estacionamento acessíveis para cadeirantes',
    'Banheiro no local',
    'Atendimento com hora marcada recomendado',
    'Cartões de crédito e débito e pagamento por aproximação (NFC)',
  ],
  /** Nota informada pelo responsável do projeto. Sem total de avaliações. */
  rating: '5,0',
};

/** Rota pelo endereço (URL oficial do Google Maps), sem coordenadas ou Place ID inventados. */
export const mapsRouteUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${address.street}, ${address.district}, ${address.city} - ${address.state}, ${address.zip}`,
)}`;

export const whatsappUrl = (text?: string) =>
  `https://wa.me/${clinic.whatsapp.number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const navLinks = [
  { href: '#clinica', label: 'A clínica' },
  { href: '#tratamentos', label: 'Tratamentos' },
  { href: '#equipe', label: 'Equipe' },
  { href: '#localizacao', label: 'Localização' },
];

export type Scene = {
  id: string;
  title: string;
  text: string;
  caption: string;
  photo: PhotoSource;
};

/** Visita guiada: recepção → café → símbolo na parede. Textos propostos. */
export const scenes: Scene[] = [
  {
    id: 'recepcao',
    title: 'O cuidado começa na chegada.',
    text: 'Conheça o espaço que recebe você na HAES.',
    caption: 'Recepção',
    photo: photos.recepcao,
  },
  {
    id: 'cafe',
    title: 'Tempo para se sentir à vontade.',
    text: 'Os pequenos detalhes também fazem parte da visita.',
    caption: 'Café da recepção',
    photo: photos.cafe,
  },
  {
    id: 'simbolo',
    title: 'Cada detalhe tem um propósito.',
    text: 'Um ambiente que apresenta o jeito HAES de cuidar.',
    caption: 'Símbolo HAES na parede',
    photo: photos.simboloParede,
  },
];

export type Treatment = {
  id: string;
  name: string;
  category: string;
  /** Descrição proposta, sujeita à revisão da clínica. */
  summary: string;
};

export const featuredTreatments: Treatment[] = [
  {
    id: 'clareamento',
    name: 'Clareamento dental',
    category: 'Clareamento',
    summary: 'Opções em consultório e caseiro supervisionado, conforme avaliação profissional.',
  },
  {
    id: 'toxina',
    name: 'Toxina botulínica',
    category: 'Harmonização facial',
    summary: 'Avaliação individual para conversar sobre objetivos e possibilidades de tratamento.',
  },
  {
    id: 'preenchimento',
    name: 'Preenchimento facial',
    category: 'Harmonização facial',
    summary: 'Planejamento individual com atenção às características e aos objetivos de cada pessoa.',
  },
];

/** As dez categorias fornecidas. Toxina e preenchimento pertencem à harmonização facial. */
export const treatmentCategories = [
  'Clínica geral',
  'Limpeza',
  'Extrações',
  'Próteses',
  'Periodontia',
  'Endodontia',
  'Clareamento',
  'Implantes',
  'Aparelhos ortodônticos',
  'Harmonização facial',
];

/** Informação curta disponível por categoria (sem preço, duração ou popularidade). */
export const categoryInfo: Record<string, string> = {
  Clareamento: 'Em consultório ou caseiro supervisionado',
  'Harmonização facial': 'Toxina botulínica e preenchimento facial',
};

export const GENERAL_EVALUATION = 'Quero uma avaliação';

/** Opções do formulário: avaliação geral, destaques e demais categorias, sem repetição. */
export const treatmentOptions = [
  GENERAL_EVALUATION,
  ...featuredTreatments.map((t) => t.name),
  ...treatmentCategories.filter((c) => c !== 'Clareamento'),
];

export type Professional = {
  id: string;
  name: string;
  credential: string;
  roles: string[];
  quote: string;
  instagram: string;
  instagramHandle: string;
  /** Retrato vertical 4:5 (1122×1402). */
  portrait: { src: string; alt: string };
};

/**
 * Retratos editados por IA fornecidos pelo responsável; identificação confirmada pelo
 * responsável em 06/11/2026. Aprovação de semelhança pelas profissionais ainda pendente.
 */
export const team: Professional[] = [
  {
    id: 'danielle',
    name: 'Dra. Danielle Yahn',
    credential: 'Cirurgiã-dentista · CRO/MS 6895',
    roles: ['Responsável técnica da Clínica HAES'],
    quote: 'A beleza de se reconhecer no espelho. Resultados naturais, para quem não gosta de exageros.',
    instagram: 'https://www.instagram.com/danielleyahnn/',
    instagramHandle: '@danielleyahnn',
    portrait: { src: 'team/danielle-1122.webp', alt: 'Retrato da Dra. Danielle Yahn' },
  },
  {
    id: 'marianne',
    name: 'Dra. Marianne Tavares',
    // CRO fornecido sem UF; não acrescentar UF sem documento.
    credential: 'Cirurgiã-dentista · CRO 6891',
    roles: ['Especialista em Dentística', 'Co-proprietária da Clínica HAES'],
    quote: 'Sorrisos que unem saúde, função e estética.',
    instagram: 'https://www.instagram.com/mariannetavaress/',
    instagramHandle: '@mariannetavaress',
    portrait: { src: 'team/marianne-1122.webp', alt: 'Retrato da Dra. Marianne Tavares' },
  },
];

/** Depoimentos fornecidos, com texto fiel. Sem datas relativas e sem fotos de autores. */
export const reviews = [
  {
    author: 'CONCEITO MUSA STORE',
    text: 'Atendimento incrível e profissionais excelentes! Amei meus resultados!',
  },
  {
    author: 'Eurico Rodrigues',
    text: 'Excelente clínica! A equipe é altamente qualificada e atenciosa. Atendimento de alta qualidade. Recomendo fortemente!',
  },
  {
    author: 'Renata Ortiz',
    text: 'Atendimento impecável e excelentes profissionais!',
  },
];

export const firstVisitSteps = [
  {
    title: 'Escolha o assunto',
    text: 'Pode ser um tratamento específico ou apenas uma avaliação para entender o que faz sentido para você.',
  },
  {
    title: 'Envie sua preferência pelo WhatsApp',
    text: 'Se quiser, indique uma data. A mensagem sai pronta, e você revisa antes de enviar.',
  },
  {
    title: 'Aguarde a confirmação da equipe',
    text: 'A equipe da HAES responde pelo WhatsApp e confirma o dia e o horário disponíveis.',
  },
];

export const faq = [
  {
    q: 'Como solicitar uma avaliação?',
    a: `Preencha o pré-agendamento nesta página e toque em “Pré-agendar pelo WhatsApp”. Se preferir, chame a clínica direto no WhatsApp ${clinic.whatsapp.display}.`,
  },
  {
    q: 'O horário escolhido já está confirmado?',
    a: 'Ainda não. A data que você escolhe é só uma preferência. A equipe confirma a disponibilidade pelo WhatsApp.',
  },
  {
    q: 'Quais são os horários de atendimento?',
    a: 'De segunda a sexta, das 08h às 18h. Sábado e domingo a clínica fica fechada. O atendimento com hora marcada é recomendado.',
  },
  {
    q: 'Onde fica a clínica?',
    a: `${clinic.addressLine}.`,
  },
  {
    q: 'A entrada tem acessibilidade?',
    a: 'Sim. A entrada e o estacionamento são acessíveis para cadeirantes.',
  },
];

/** Pendências internas (não aparecem no site). Ver também README.md. */
export const pendencias = [
  'SVG oficial do símbolo HAES (desenho animado e folha do seletor de tema).',
  'Aprovação de semelhança dos retratos editados por IA pelas profissionais (identificação confirmada pelo responsável).',
  'Fotos do café (632×842) e da fachada (679×812) em baixa resolução: substituir por originais maiores quando houver.',
  'Intervalo de almoço: a arte anterior indicava pausa; a ficha mais recente informa 08h às 18h sem intervalo.',
  'Pin exato no mapa (hoje a rota usa o endereço).',
  'Processo clínico da primeira consulta (duração, custo, exames).',
  'Confirmação atual de campanhas; bioestimulador e ultrassom Visage fora da oferta pública até confirmação.',
  'Revisão das descrições propostas de tratamentos e da visita guiada.',
  'Qualidade da transparência do PNG da Or7.',
];
