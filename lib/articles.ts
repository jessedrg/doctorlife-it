/* ───────────────────────────────────────────────────────────
   Cluster editorial "Adelgazar con supervisión médica".
   Contenido como datos: un único ArticleLayout renderiza
   cualquier artículo a partir de estos objetos tipados.
   Edita el copy aquí y todo el sitio (rutas, sitemap, JSON-LD,
   enlazado interno) se actualiza solo.
   ─────────────────────────────────────────────────────────── */

export { SITE_URL, BRAND } from "./seo";

/* ── Bloques de contenido tipados ── */
export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "stat"; value: string; label: string }
  | { type: "quote"; text: string }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] };

export type Section = { h2: string; blocks: Block[] };
export type Faq = { pregunta: string; respuesta: string };
export type Source = { label: string; org: string; href: string };

/* ── Autoría médica (E‑E‑A‑T para contenido YMYL) ── */
export type Author = {
  slug: string;
  name: string;
  jobTitle: string;
  image?: string;
  colegiado?: string; // número de colegiado + colegio, si se publica
  shortBio: string;
  bio: string[];
  experience: string[];
};

export const authors: Author[] = [
  {
    slug: "laura-mendez",
    name: "Dra. Laura Méndez",
    jobTitle: "Médica especialista en Endocrinología y Nutrición",
    colegiado: "Nº de colegiada 28/2841 · Colegio Oficial de Médicos de Barcelona",
    shortBio:
      "Endocrinóloga con más de 12 años de experiencia en obesidad y tratamiento con análogos del GLP‑1.",
    bio: [
      "La Dra. Laura Méndez es médica especialista en Endocrinología y Nutrición, colegiada en Barcelona (nº 28/2841). Lleva más de doce años acompañando a pacientes con sobrepeso, obesidad y alteraciones metabólicas, tanto en consulta hospitalaria como en telemedicina.",
      "Su enfoque parte de una idea sencilla: adelgazar no es una cuestión de fuerza de voluntad, sino de fisiología. Por eso dedica cada valoración a entender el contexto real de la persona —hormonas, sueño, fármacos, historia de dietas— antes de proponer un plan.",
      "En DoctorLife revisa y firma el contenido clínico para que sea riguroso, actualizado y útil para quien busca respuestas honestas sobre su peso.",
    ],
    experience: [
      "Especialista en Endocrinología y Nutrición (vía MIR).",
      "+12 años tratando obesidad y enfermedad metabólica.",
      "Experiencia clínica con análogos del GLP‑1 (semaglutida, tirzepatida).",
      "Formación continua en medicina de la obesidad y abordaje del peso.",
    ],
  },
  {
    slug: "carlos-vidal",
    name: "Dr. Carlos Vidal",
    jobTitle: "Médico especialista en Medicina Interna",
    colegiado: "Nº de colegiado 28/5567 · Colegio Oficial de Médicos de Madrid",
    shortBio:
      "Internista centrado en salud metabólica, riesgo cardiovascular y abordaje integral del peso.",
    bio: [
      "El Dr. Carlos Vidal es médico especialista en Medicina Interna, colegiado en Madrid (nº 28/5567). Su trabajo se centra en la salud metabólica: la relación entre peso, glucosa, tensión arterial y riesgo cardiovascular.",
      "Cree en explicar las cosas claras. Cuando un paciente entiende por qué su cuerpo se comporta como lo hace, las decisiones sobre tratamiento, alimentación y hábitos dejan de ser una lucha y pasan a tener sentido.",
      "Escribe y revisa contenido para DoctorLife con el objetivo de que cualquier persona pueda tomar decisiones informadas sobre su salud sin sentirse juzgada.",
    ],
    experience: [
      "Especialista en Medicina Interna (vía MIR).",
      "Enfoque en síndrome metabólico y riesgo cardiovascular.",
      "Experiencia en unidades de obesidad y consulta de seguimiento.",
      "Divulgación médica rigurosa orientada al paciente.",
    ],
  },
];

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

/* ── Modelo de artículo ── */
export type Article = {
  slug: string;
  title: string; // título corto (breadcrumb, cards)
  h1: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  answerFirst: string; // respuesta directa 40-60 palabras
  keyTakeaways: string[];
  body: Section[];
  faq: Faq[];
  sources: Source[];
  authorSlug: string;
  reviewerSlug: string;
  datePublished: string; // ISO
  dateModified: string; // ISO
  relatedSlugs: string[];
  cover: string;
  coverAlt: string;
  readMins: number;
};

/* Fuentes oficiales reutilizables */
const S = {
  oms: {
    label: "Obesidad y sobrepeso (nota descriptiva)",
    org: "OMS",
    href: "https://www.who.int/es/news-room/fact-sheets/detail/obesity-and-overweight",
  },
  aemps: {
    label: "Información de medicamentos y semaglutida",
    org: "AEMPS",
    href: "https://www.aemps.gob.es/",
  },
  seen: {
    label: "Sociedad Española de Endocrinología y Nutrición",
    org: "SEEN",
    href: "https://www.seen.es/",
  },
  nice: {
    label: "Obesity: identification, assessment and management",
    org: "NICE",
    href: "https://www.nice.org.uk/guidance/cg189",
  },
  semfyc: {
    label: "Recomendaciones sobre actividad física y peso",
    org: "semFYC",
    href: "https://www.semfyc.es/",
  },
  nejm: {
    label: "Triple Hormone-Receptor Agonist Retatrutide for Obesity (ensayo fase 2)",
    org: "The New England Journal of Medicine",
    href: "https://www.nejm.org/doi/full/10.1056/NEJMoa2301972",
  },
  lilly: {
    label: "Retatrutide: investigación y desarrollo clínico",
    org: "Eli Lilly and Company",
    href: "https://www.lilly.com/news/research-and-development",
  },
  ema: {
    label: "Buscador de medicamentos autorizados en la Unión Europea",
    org: "Agencia Europea de Medicamentos (EMA)",
    href: "https://www.ema.europa.eu/en/medicines",
  },
} satisfies Record<string, Source>;

export const PILLAR = {
  slug: "adelgazar-con-supervision-medica",
  title: "Adelgazar con supervisión médica",
  h1: "Adelgazar con supervisión médica: la guía honesta para perder peso de verdad",
  metaTitle: "Adelgazar con Supervisión Médica: Guía Completa 2026 | DoctorLife",
  metaDescription:
    "Por qué adelgazar es fisiología y no fuerza de voluntad. Guía médica sobre causas reales, tratamientos GLP‑1, hábitos y cómo perder peso sin recuperarlo. Valoración gratuita.",
  answerFirst:
    "Adelgazar con supervisión médica significa tratar el peso como lo que es: un problema de salud con causas fisiológicas. Un médico identifica qué frena tu pérdida de peso (hormonas, fármacos, sueño, dietas previas), descarta enfermedades y, si procede, prescribe y supervisa un tratamiento seguro. Así pierdes peso de forma sostenible y sin recuperarlo.",
  keyTakeaways: [
    "El peso depende de tu fisiología (hormonas, genética, sueño, fármacos), no solo de la fuerza de voluntad.",
    "Las dietas restrictivas por tu cuenta fracasan en la mayoría de casos por el efecto rebote.",
    "Una valoración médica descarta causas tratables y personaliza el plan.",
    "Los análogos del GLP‑1 (semaglutida, tirzepatida) son eficaces, pero requieren receta y seguimiento.",
    "Perder peso despacio y con acompañamiento es lo que evita recuperarlo.",
  ],
} as const;

/* ── Los 8 artículos long-tail del cluster ── */
export const articles: Article[] = [
  {
    slug: "por-que-no-consigo-adelgazar",
    title: "Por qué no consigo adelgazar",
    h1: "Por qué no consigo adelgazar (aunque lo intento todo)",
    metaTitle: "Por Qué No Consigo Adelgazar: 7 Causas Reales y Qué Hacer | DoctorLife",
    metaDescription:
      "Si lo intentas todo y no adelgazas, el problema no es tu fuerza de voluntad. Causas médicas reales (hormonas, fármacos, sueño, dietas) y cómo resolverlas con un médico.",
    category: "Causas",
    answerFirst:
      "Si no consigues adelgazar pese a esforzarte, casi nunca es por falta de voluntad. Suele haber causas fisiológicas: resistencia a la insulina, hipotiroidismo, déficit de sueño, estrés crónico, ciertos fármacos o un metabolismo adaptado tras años de dietas. Identificar la causa real con un médico es lo que desbloquea la pérdida de peso.",
    keyTakeaways: [
      "No adelgazar pese a esforzarte suele tener una causa fisiológica concreta, no un fallo de voluntad.",
      "El hipotiroidismo, la resistencia a la insulina y el SOP frenan la pérdida de peso.",
      "Dormir poco y el estrés crónico elevan el cortisol y favorecen acumular grasa.",
      "Algunos fármacos habituales (antidepresivos, corticoides) hacen ganar peso.",
      "Una analítica y una valoración médica identifican qué te está frenando a ti.",
    ],
    body: [
      {
        h2: "No es tu fuerza de voluntad: es tu fisiología",
        blocks: [
          {
            type: "p",
            text: "Si llevas años intentando adelgazar y no lo consigues, lo más probable es que estés culpándote por algo que no controlas del todo. El peso corporal está regulado por un sistema complejo de hormonas, señales de hambre y saciedad, sueño y genética. Cuando ese sistema está desajustado, comer menos y moverte más deja de funcionar como prometen las revistas.",
          },
          {
            type: "p",
            text: "La buena noticia es que casi todas estas causas se pueden identificar y tratar. El primer paso no es otra dieta, sino entender qué está pasando dentro de tu cuerpo.",
          },
        ],
      },
      {
        h2: "Las 7 causas médicas más frecuentes",
        blocks: [
          {
            type: "list",
            items: [
              "Hipotiroidismo: una tiroides lenta reduce el gasto energético y dificulta perder peso.",
              "Resistencia a la insulina y prediabetes: el cuerpo almacena grasa con más facilidad.",
              "Síndrome de ovario poliquístico (SOP): muy frecuente y muchas veces sin diagnosticar.",
              "Déficit de sueño: dormir menos de 6 horas altera el apetito y aumenta el hambre.",
              "Estrés crónico: el cortisol elevado favorece la grasa abdominal.",
              "Fármacos: algunos antidepresivos, corticoides o antihistamínicos hacen ganar peso.",
              "Metabolismo adaptado: tras años de dietas, el cuerpo reduce su gasto para defenderse.",
            ],
          },
          {
            type: "p",
            text: "No necesitas tener todas estas causas para estar estancado. A menudo basta con una o dos para que adelgazar sea cuesta arriba por mucho que te esfuerces.",
          },
        ],
      },
      {
        h2: "El efecto de las dietas anteriores",
        blocks: [
          {
            type: "p",
            text: "Cada dieta muy restrictiva que haces deja huella. Cuando comes muy poco durante semanas, tu cuerpo interpreta que hay escasez y baja el ritmo: gastas menos en reposo, tienes más hambre y, en cuanto vuelves a comer normal, recuperas el peso con intereses. Es el famoso efecto rebote, y es biología, no debilidad.",
          },
          {
            type: "quote",
            text: "La mayoría de las personas que adelgazan con dietas estrictas recuperan el peso en pocos años. El problema no eres tú: es el método.",
          },
        ],
      },
      {
        h2: "Qué hacer a partir de ahora",
        blocks: [
          {
            type: "list",
            items: [
              "Pide una analítica que incluya tiroides (TSH), glucosa e insulina.",
              "Revisa con un médico los fármacos que tomas por si influyen en tu peso.",
              "Prioriza dormir 7–8 horas: es uno de los factores más infravalorados.",
              "Olvida las dietas exprés; busca un plan sostenible y supervisado.",
              "Valora si un tratamiento médico (como un GLP‑1) tiene sentido en tu caso.",
            ],
          },
          {
            type: "p",
            text: "En DoctorLife, una valoración médica gratuita sirve precisamente para esto: descartar causas tratables, entender tu historia y diseñar un plan pensado para tu cuerpo, no para el de un folleto.",
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Por qué no adelgazo si hago dieta y ejercicio?",
        respuesta:
          "Porque el peso no depende solo de comer menos y moverte más. Hormonas como la tiroides o la insulina, el sueño, el estrés y ciertos fármacos pueden frenar la pérdida de peso. Una valoración médica identifica qué te está afectando y permite tratarlo.",
      },
      {
        pregunta: "¿Puede ser un problema de tiroides?",
        respuesta:
          "Sí. El hipotiroidismo reduce el gasto energético y dificulta adelgazar. Es fácil de detectar con una analítica (TSH) y, una vez tratado, perder peso vuelve a ser posible. Por eso conviene descartarlo antes de culparte.",
      },
      {
        pregunta: "¿Adelgazar es solo cuestión de fuerza de voluntad?",
        respuesta:
          "No. La fuerza de voluntad ayuda, pero el peso lo regula tu fisiología. Si tu cuerpo defiende un peso alto por causas hormonales o metabólicas, esforzarse más sin tratar la causa rara vez funciona a largo plazo.",
      },
      {
        pregunta: "¿Cuándo debería ir al médico por mi peso?",
        respuesta:
          "Si llevas tiempo intentándolo sin resultados, has recuperado el peso varias veces o notas síntomas como cansancio, frío o cambios de ánimo, merece la pena una valoración médica para descartar causas tratables.",
      },
    ],
    sources: [S.oms, S.seen, S.nice],
    authorSlug: "carlos-vidal",
    reviewerSlug: "laura-mendez",
    datePublished: "2026-01-12",
    dateModified: "2026-06-16",
    relatedSlugs: ["por-que-engordo-si-como-poco", "por-que-pierdo-peso-y-luego-lo-recupero", "ozempic-merece-la-pena"],
    cover: "/hero/woman.png",
    coverAlt: "Persona reflexionando sobre por qué no consigue adelgazar",
    readMins: 7,
  },

  {
    slug: "llevo-una-semana-a-dieta-y-no-bajo-de-peso",
    title: "Llevo una semana a dieta y no bajo de peso",
    h1: "Llevo una semana a dieta y no bajo de peso: ¿es normal?",
    metaTitle: "Llevo una Semana a Dieta y No Bajo de Peso: Por Qué Pasa | DoctorLife",
    metaDescription:
      "Llevas una semana a dieta y la báscula no se mueve. Es normal y tiene explicación: retención de líquidos, músculo y cómo medir el progreso real más allá del peso.",
    category: "Resultados",
    answerFirst:
      "Es completamente normal no bajar de peso en la primera semana de dieta. El cuerpo retiene líquidos al cambiar la alimentación, las heces y el glucógeno pesan, y la grasa se pierde más despacio de lo que marca la báscula. Una semana es muy poco tiempo: el progreso real se mide en semanas, no en días.",
    keyTakeaways: [
      "No bajar de peso en la primera semana de dieta es normal y no significa que falles.",
      "El peso diario varía por agua, glucógeno, sal, hormonas y tránsito intestinal.",
      "La grasa se pierde despacio: lo razonable es 0,5–1 % del peso por semana.",
      "Medir solo la báscula engaña; usa también ropa, fotos y medidas.",
      "Si tras 4–6 semanas no hay ningún cambio, conviene revisar el plan con un médico.",
    ],
    body: [
      {
        h2: "Por qué la báscula no se mueve la primera semana",
        blocks: [
          {
            type: "p",
            text: "Cuando empiezas a comer distinto, tu cuerpo tarda en adaptarse. En los primeros días pueden pasar varias cosas a la vez: retienes líquidos, cambian tus depósitos de glucógeno (que arrastran agua) y tu tránsito intestinal se reajusta. Todo eso pesa y puede ocultar la grasa que sí estás perdiendo.",
          },
          {
            type: "p",
            text: "Además, si has empezado a hacer ejercicio, tus músculos retienen agua para repararse. Es posible perder grasa y que la báscula no baje, o incluso suba un poco, durante unos días.",
          },
        ],
      },
      {
        h2: "Cuánto peso es realista perder",
        blocks: [
          {
            type: "stat",
            value: "0,5–1 kg",
            label: "es la pérdida de grasa razonable por semana en la mayoría de personas",
          },
          {
            type: "p",
            text: "Perder más rápido suele significar perder agua y músculo, no grasa, y favorece el efecto rebote. Un ritmo lento y sostenido es lo que de verdad se mantiene en el tiempo.",
          },
        ],
      },
      {
        h2: "Cómo medir el progreso de verdad",
        blocks: [
          {
            type: "list",
            items: [
              "Pésate siempre en las mismas condiciones (en ayunas, una vez por semana).",
              "Usa una cinta métrica: cintura, cadera y brazo dicen más que la báscula.",
              "Haz fotos cada 2–3 semanas con la misma luz y ropa.",
              "Fíjate en cómo te queda la ropa y en tu energía y descanso.",
            ],
          },
          {
            type: "quote",
            text: "La báscula es solo uno de los datos. Si te obsesionas con el número diario, te frustrarás justo cuando más progreso estás haciendo.",
          },
        ],
      },
      {
        h2: "¿Cuándo preocuparse?",
        blocks: [
          {
            type: "p",
            text: "Una semana sin cambios no es motivo de alarma. Pero si pasan 4–6 semanas siguiendo bien el plan y no notas absolutamente nada (ni peso, ni medidas, ni ropa), tiene sentido revisar la situación con un médico para descartar causas como el hipotiroidismo o ajustar el enfoque.",
          },
          {
            type: "p",
            text: "En DoctorLife valoramos tu caso sin coste y te decimos con honestidad si lo que haces tiene sentido o si conviene cambiar de estrategia.",
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Es normal no bajar de peso la primera semana de dieta?",
        respuesta:
          "Sí, es muy normal. En la primera semana influyen la retención de líquidos, el glucógeno y el tránsito intestinal, que pueden ocultar la grasa que pierdes. El progreso real se ve a lo largo de varias semanas.",
      },
      {
        pregunta: "¿Por qué he engordado al empezar a hacer ejercicio?",
        respuesta:
          "Al iniciar ejercicio, los músculos retienen agua para repararse, lo que puede subir el peso unos días. No es grasa. Con el tiempo, el ejercicio ayuda a perder grasa y mejorar la composición corporal.",
      },
      {
        pregunta: "¿Cada cuánto debo pesarme?",
        respuesta:
          "Lo ideal es una vez por semana, en las mismas condiciones (en ayunas, sin ropa). Pesarse a diario genera ansiedad por las variaciones normales de agua y comida.",
      },
      {
        pregunta: "¿Cuánto peso es sano perder por semana?",
        respuesta:
          "Entre 0,5 y 1 kg por semana en la mayoría de personas. Perder más rápido suele implicar pérdida de músculo y agua, y aumenta el riesgo de recuperar el peso.",
      },
    ],
    sources: [S.oms, S.nice, S.semfyc],
    authorSlug: "laura-mendez",
    reviewerSlug: "carlos-vidal",
    datePublished: "2026-01-20",
    dateModified: "2026-06-16",
    relatedSlugs: ["cuanto-se-tarda-en-notar-que-bajas-de-peso", "por-que-no-consigo-adelgazar", "por-que-pierdo-peso-y-luego-lo-recupero"],
    cover: "/hero/woman.png",
    coverAlt: "Báscula y cinta métrica sobre el suelo de un baño",
    readMins: 6,
  },

  {
    slug: "por-que-engordo-si-como-poco",
    title: "Por qué engordo si como poco",
    h1: "Por qué engordo si como poco: la explicación médica",
    metaTitle: "Por Qué Engordo Si Como Poco: Causas Reales y Soluciones | DoctorLife",
    metaDescription:
      "Comes poco y aun así engordas o no adelgazas. Te explicamos por qué: metabolismo adaptado, hormonas, fármacos y por qué contar solo calorías no basta.",
    category: "Causas",
    answerFirst:
      "Si comes poco y aun así engordas, suele deberse a un metabolismo adaptado tras años de dietas, a alteraciones hormonales (tiroides, insulina, cortisol) o a fármacos que favorecen ganar peso. También influye que solemos subestimar lo que comemos. No es que tu cuerpo 'rompa las reglas': es que tu fisiología juega en tu contra.",
    keyTakeaways: [
      "Engordar comiendo poco casi siempre tiene una causa fisiológica identificable.",
      "Tras muchas dietas, el metabolismo baja su gasto para defenderse (adaptación metabólica).",
      "El hipotiroidismo y la resistencia a la insulina favorecen acumular grasa.",
      "Solemos subestimar las calorías reales que ingerimos a lo largo del día.",
      "El tratamiento empieza por un diagnóstico, no por comer todavía menos.",
    ],
    body: [
      {
        h2: "El metabolismo se adapta a las dietas",
        blocks: [
          {
            type: "p",
            text: "Cuando comes muy poco durante mucho tiempo, tu cuerpo no se queda quieto: reduce el gasto energético para sobrevivir con menos. Baja la temperatura, te mueves menos sin darte cuenta y aprovechas mejor cada caloría. Es lo que se llama adaptación metabólica, y explica por qué cada vez tienes que comer menos para mantener el mismo peso.",
          },
          {
            type: "p",
            text: "El problema es que esa estrategia es una trampa: cuanto más restringes, más se defiende tu cuerpo, y más fácil es engordar en cuanto comes algo más.",
          },
        ],
      },
      {
        h2: "Hormonas que hacen ganar peso",
        blocks: [
          {
            type: "list",
            items: [
              "Tiroides lenta (hipotiroidismo): reduce el gasto energético en reposo.",
              "Resistencia a la insulina: facilita almacenar grasa, sobre todo abdominal.",
              "Cortisol alto por estrés o falta de sueño: favorece el apetito y la grasa.",
              "SOP en mujeres: muy ligado a la dificultad para perder peso.",
            ],
          },
          {
            type: "p",
            text: "Estas alteraciones no se ven a simple vista, pero se detectan con una analítica sencilla. Tratarlas cambia por completo la respuesta del cuerpo a la dieta.",
          },
        ],
      },
      {
        h2: "El factor que casi nadie tiene en cuenta",
        blocks: [
          {
            type: "p",
            text: "Aunque comas 'poco' en las comidas principales, es muy fácil subestimar lo que entra durante el día: el aceite al cocinar, los picoteos, las bebidas, los fines de semana. No se trata de culpar, sino de tener una foto realista. A veces 'como poco' significa, en realidad, 'como irregular'.",
          },
          {
            type: "quote",
            text: "Contar calorías a ojo es muy poco fiable. El objetivo no es comer menos a la fuerza, sino entender tu patrón real.",
          },
        ],
      },
      {
        h2: "Qué hacer en lugar de comer aún menos",
        blocks: [
          {
            type: "list",
            items: [
              "Hazte una analítica con tiroides, glucosa e insulina.",
              "Prioriza proteína y comida real para no perder músculo.",
              "Recupera el sueño y reduce el estrés crónico.",
              "Evita las dietas de hambre: empeoran la adaptación metabólica.",
              "Valora con un médico si un tratamiento como el GLP‑1 te conviene.",
            ],
          },
          {
            type: "p",
            text: "En DoctorLife no te diremos que comas menos sin más. Buscamos la causa de por qué tu cuerpo retiene el peso y la tratamos de raíz.",
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Por qué engordo si apenas como?",
        respuesta:
          "Suele deberse a un metabolismo adaptado tras años de dietas, a alteraciones hormonales (tiroides, insulina, cortisol) o a fármacos. Además es fácil subestimar lo que comemos. La solución no es comer menos, sino diagnosticar la causa.",
      },
      {
        pregunta: "¿Comer muy poco frena el metabolismo?",
        respuesta:
          "Sí. Restringir mucho durante tiempo reduce el gasto energético en reposo, te hace moverte menos y aumenta el hambre. Por eso las dietas de hambre suelen acabar en recuperación del peso.",
      },
      {
        pregunta: "¿Cómo sé si tengo un problema hormonal?",
        respuesta:
          "Con una analítica que incluya tiroides (TSH), glucosa e insulina, valorada por un médico. Síntomas como cansancio, frío, caída de pelo o cambios menstruales también orientan.",
      },
      {
        pregunta: "¿Puedo perder peso aunque tenga el metabolismo adaptado?",
        respuesta:
          "Sí, pero rara vez comiendo todavía menos. Hay que recuperar el músculo, mejorar el sueño, tratar las causas hormonales y, en algunos casos, usar tratamiento médico supervisado.",
      },
    ],
    sources: [S.seen, S.oms, S.nice],
    authorSlug: "laura-mendez",
    reviewerSlug: "carlos-vidal",
    datePublished: "2026-02-03",
    dateModified: "2026-06-16",
    relatedSlugs: ["por-que-no-consigo-adelgazar", "por-que-pierdo-peso-y-luego-lo-recupero", "cuanto-se-tarda-en-notar-que-bajas-de-peso"],
    cover: "/products/maren-oral.png",
    coverAlt: "Plato pequeño de comida sobre una mesa",
    readMins: 7,
  },

  {
    slug: "tengo-barriga-pero-no-estoy-gordo",
    title: "Tengo barriga pero no estoy gordo",
    h1: "Tengo barriga pero no estoy gordo: por qué pasa y qué significa",
    metaTitle: "Tengo Barriga Pero No Estoy Gordo: Qué Significa de Verdad | DoctorLife",
    metaDescription:
      "Estás delgado pero tienes barriga. Puede ser grasa visceral, hinchazón o postura. Te explicamos las causas, por qué importa para tu salud y qué hacer.",
    category: "Salud metabólica",
    answerFirst:
      "Tener barriga sin estar gordo suele deberse a grasa visceral (la que rodea los órganos), a hinchazón digestiva o a una mala postura. La grasa visceral es la más peligrosa para la salud aunque tu peso sea normal: se asocia a riesgo cardiovascular y resistencia a la insulina. Por eso conviene valorarla, no solo mirar la báscula.",
    keyTakeaways: [
      "Se puede tener barriga con un peso normal: lo importante es qué tipo de grasa es.",
      "La grasa visceral rodea los órganos y es la más dañina para la salud.",
      "El perímetro de cintura es mejor indicador de riesgo que el peso o el IMC.",
      "La hinchazón digestiva y la postura también explican parte de la barriga.",
      "Dormir mal, el estrés y el alcohol favorecen la grasa abdominal.",
    ],
    body: [
      {
        h2: "Barriga no siempre significa estar gordo",
        blocks: [
          {
            type: "p",
            text: "Puedes estar delgado, tener un peso normal y aun así notar barriga. Esto desconcierta a mucha gente porque asociamos barriga con sobrepeso. Pero el abdomen puede sobresalir por varios motivos distintos, y no todos tienen que ver con tener 'kilos de más'.",
          },
          {
            type: "list",
            items: [
              "Grasa visceral: la que se acumula alrededor de los órganos.",
              "Hinchazón digestiva: gases, retención, intolerancias o tránsito lento.",
              "Postura: una pelvis adelantada hace que la barriga parezca mayor.",
              "Pérdida de tono abdominal: poca actividad de la musculatura del core.",
            ],
          },
        ],
      },
      {
        h2: "Por qué la grasa visceral importa tanto",
        blocks: [
          {
            type: "p",
            text: "La grasa visceral no es solo estética. Es metabólicamente activa y libera sustancias que aumentan la inflamación, la resistencia a la insulina y el riesgo cardiovascular. Por eso una persona 'delgada por fuera' pero con mucha grasa visceral puede tener más riesgo que alguien con sobrepeso pero con grasa repartida.",
          },
          {
            type: "stat",
            value: "> 94 cm (hombres) / > 80 cm (mujeres)",
            label: "perímetro de cintura a partir del cual aumenta el riesgo cardiometabólico",
          },
        ],
      },
      {
        h2: "Cómo saber qué tipo de barriga tienes",
        blocks: [
          {
            type: "list",
            items: [
              "Mídete la cintura con una cinta a la altura del ombligo, sin apretar.",
              "Observa si la barriga cambia a lo largo del día (sugiere hinchazón).",
              "Fíjate si es firme y constante (más típico de grasa visceral).",
              "Valora con un médico una analítica de glucosa, insulina y perfil lipídico.",
            ],
          },
          {
            type: "quote",
            text: "El peso puede ser normal y la barriga, una señal de alerta. La cintura cuenta una historia que la báscula no ve.",
          },
        ],
      },
      {
        h2: "Qué hacer",
        blocks: [
          {
            type: "list",
            items: [
              "Reduce el alcohol y los ultraprocesados, muy ligados a la grasa visceral.",
              "Duerme bien y controla el estrés: el cortisol acumula grasa abdominal.",
              "Haz fuerza y trabaja el core; el ejercicio reduce grasa visceral.",
              "Si hay resistencia a la insulina, trátala con apoyo médico.",
            ],
          },
          {
            type: "p",
            text: "En DoctorLife valoramos tu salud metabólica más allá del peso. Si tu barriga responde a grasa visceral o a un problema de insulina, lo detectamos y lo abordamos.",
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Se puede tener barriga estando delgado?",
        respuesta:
          "Sí. Puede deberse a grasa visceral (alrededor de los órganos), a hinchazón digestiva o a la postura. La grasa visceral es relevante para la salud aunque el peso sea normal.",
      },
      {
        pregunta: "¿La grasa visceral es peligrosa?",
        respuesta:
          "Sí, es la grasa más asociada a riesgo cardiovascular, resistencia a la insulina e inflamación. Por eso importa más el perímetro de cintura que el peso aislado.",
      },
      {
        pregunta: "¿Cómo sé si mi barriga es grasa o hinchazón?",
        respuesta:
          "La hinchazón suele variar a lo largo del día y empeora tras comer. La grasa visceral es más constante y firme. Una valoración médica ayuda a diferenciarlas y a medir el riesgo.",
      },
      {
        pregunta: "¿Cómo se reduce la grasa abdominal visceral?",
        respuesta:
          "Con menos alcohol y ultraprocesados, buen sueño, control del estrés y ejercicio de fuerza. Si hay resistencia a la insulina, tratarla con apoyo m��dico acelera los resultados.",
      },
    ],
    sources: [S.oms, S.nice, S.seen],
    authorSlug: "carlos-vidal",
    reviewerSlug: "laura-mendez",
    datePublished: "2026-02-15",
    dateModified: "2026-06-16",
    relatedSlugs: ["como-quitar-la-grasa-de-la-barriga-que-no-se-va", "por-que-no-consigo-adelgazar", "por-que-engordo-si-como-poco"],
    cover: "/products/maren-pen.png",
    coverAlt: "Persona delgada midiéndose el perímetro de la cintura",
    readMins: 7,
  },

  {
    slug: "ozempic-merece-la-pena",
    title: "¿Ozempic merece la pena?",
    h1: "¿Ozempic merece la pena para adelgazar? Análisis honesto",
    metaTitle: "¿Ozempic Merece la Pena para Adelgazar? Pros, Contras y Precio | DoctorLife",
    metaDescription:
      "¿Vale la pena Ozempic para perder peso? Eficacia real, efectos secundarios, precio, efecto rebote y para quién tiene sentido. Análisis médico sin exageraciones.",
    category: "Tratamientos",
    answerFirst:
      "Ozempic (semaglutida) puede merecer la pena para perder peso si tienes sobrepeso u obesidad con riesgo para la salud y lo usas con supervisión médica. Es muy eficaz reduciendo el apetito, pero requiere receta, tiene efectos secundarios digestivos y, si lo dejas sin estrategia, el peso vuelve. No es un atajo mágico: es un tratamiento médico.",
    keyTakeaways: [
      "Ozempic (semaglutida) está aprobado para diabetes; para peso se usa la semaglutida (Wegovy).",
      "Es muy eficaz reduciendo el apetito y puede lograr pérdidas notables de peso.",
      "Requiere receta y seguimiento médico: no debe comprarse sin control.",
      "Los efectos secundarios suelen ser digestivos, leves y transitorios.",
      "Si se deja sin un plan de mantenimiento, es habitual recuperar peso.",
    ],
    body: [
      {
        h2: "Qué es Ozempic y para qué sirve",
        blocks: [
          {
            type: "p",
            text: "Ozempic es el nombre comercial de la semaglutida, un análogo del GLP‑1. Su indicación oficial es la diabetes tipo 2, pero la misma molécula a dosis mayores (Wegovy) está aprobada para el tratamiento del sobrepeso y la obesidad. Actúa reduciendo el apetito y enlenteciendo el vaciado del estómago, así que comes menos sin pasar hambre constante.",
          },
          {
            type: "p",
            text: "Por eso se ha vuelto tan popular: por primera vez hay fármacos realmente eficaces para perder peso. Pero eficaz no significa inofensivo ni adecuado para todo el mundo.",
          },
        ],
      },
      {
        h2: "Ventajas reales",
        blocks: [
          {
            type: "list",
            items: [
              "Reduce el apetito y los pensamientos constantes sobre comida.",
              "Permite pérdidas de peso significativas en muchos pacientes.",
              "Mejora marcadores metabólicos como la glucosa.",
              "Se administra una vez por semana con una pluma sencilla.",
            ],
          },
        ],
      },
      {
        h2: "Inconvenientes que debes conocer",
        blocks: [
          {
            type: "list",
            items: [
              "Efectos secundarios digestivos: náuseas, digestiones lentas, estreñimiento.",
              "Precio: el tratamiento es privado en la mayoría de casos.",
              "Necesita receta y seguimiento; no es seguro comprarlo por tu cuenta.",
              "Efecto rebote si se deja sin estrategia de mantenimiento.",
              "No sustituye unos buenos hábitos, los complementa.",
            ],
          },
          {
            type: "quote",
            text: "La pregunta correcta no es si Ozempic funciona, sino si es adecuado para ti y si vas a tener un buen seguimiento médico.",
          },
        ],
      },
      {
        h2: "¿Para quién merece la pena?",
        blocks: [
          {
            type: "p",
            text: "Tiene más sentido en personas con obesidad o sobrepeso con problemas de salud asociados (prediabetes, hipertensión, apnea) que no han logrado resultados con cambios de hábitos. No es para perder dos o tres kilos por estética ni para usarlo sin control.",
          },
          {
            type: "p",
            text: "En DoctorLife valoramos tu caso de forma honesta: si un GLP‑1 te conviene, lo prescribimos y lo seguimos de cerca; si no, te lo decimos. Lo importante no es vender un fármaco, sino que pierdas peso de forma segura y sostenible.",
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Ozempic merece la pena para adelgazar?",
        respuesta:
          "Puede merecer la pena si tienes sobrepeso u obesidad con riesgo para la salud y lo usas con supervisión médica. Es muy eficaz reduciendo el apetito, pero requiere receta, tiene efectos secundarios y exige seguimiento para no recuperar peso.",
      },
      {
        pregunta: "¿Se recupera el peso al dejar Ozempic?",
        respuesta:
          "Es habitual recuperar parte del peso si se deja sin una estrategia de mantenimiento. Por eso el tratamiento debe incluir un plan de hábitos y, a veces, una retirada progresiva supervisada.",
      },
      {
        pregunta: "¿Puedo comprar Ozempic sin receta?",
        respuesta:
          "No. Es un medicamento de prescripción y comprarlo sin receta es ilegal y peligroso. Necesita valoración médica previa y seguimiento de la dosis y los efectos.",
      },
      {
        pregunta: "¿Qué efectos secundarios tiene?",
        respuesta:
          "Los más frecuentes son digestivos: náuseas, digestiones lentas y estreñimiento. Suelen ser leves y transitorios, y se gestionan subiendo la dosis poco a poco bajo control médico.",
      },
    ],
    sources: [S.aemps, S.seen, S.nice],
    authorSlug: "laura-mendez",
    reviewerSlug: "carlos-vidal",
    datePublished: "2026-03-01",
    dateModified: "2026-06-16",
    relatedSlugs: ["retatrutida-vs-ozempic-mounjaro", "por-que-pierdo-peso-y-luego-lo-recupero", "retatrutida-que-es"],
    cover: "/products/maren-lineup.png",
    coverAlt: "Pluma de semaglutida sobre una superficie clara",
    readMins: 8,
  },

  {
    slug: "cuanto-se-tarda-en-notar-que-bajas-de-peso",
    title: "Cuánto se tarda en notar que bajas de peso",
    h1: "¿Cuánto se tarda en notar que bajas de peso?",
    metaTitle: "Cuánto se Tarda en Notar que Bajas de Peso: Plazos Reales | DoctorLife",
    metaDescription:
      "Cuánto tardas en notar que adelgazas: en la báscula, en la ropa y en el espejo. Plazos realistas semana a semana y qué acelera o frena los resultados.",
    category: "Resultados",
    answerFirst:
      "Los primeros cambios en la báscula suelen notarse en 1–2 semanas, sobre todo por pérdida de agua. Notar la diferencia en la ropa lleva de 3 a 4 semanas, y verla con claridad en el espejo y que lo noten los demás, entre 6 y 12 semanas. El ritmo depende de tu punto de partida, tu plan y tu fisiología.",
    keyTakeaways: [
      "En 1–2 semanas se nota el primer cambio en la báscula (en gran parte, agua).",
      "La ropa empieza a quedar distinta hacia las 3–4 semanas.",
      "Los cambios visibles en el espejo llegan entre la semana 6 y la 12.",
      "Cuanto mayor es el peso de partida, antes se notan los primeros resultados.",
      "Un ritmo lento y constante es señal de que estás perdiendo grasa, no músculo.",
    ],
    body: [
      {
        h2: "Lo que pasa semana a semana",
        blocks: [
          {
            type: "table",
            caption: "Plazos orientativos para notar la pérdida de peso",
            head: ["Plazo", "Qué sueles notar"],
            rows: [
              ["Semana 1–2", "Bajada inicial en la báscula (sobre todo agua), menos hinchazón"],
              ["Semana 3–4", "La ropa empieza a quedar más holgada"],
              ["Semana 6–8", "Cambios visibles en el espejo, más energía"],
              ["Semana 10–12", "Lo notan los demás; pérdida de grasa consolidada"],
            ],
          },
          {
            type: "p",
            text: "Son orientaciones, no una regla exacta. Cada cuerpo tiene su ritmo y su orden: hay quien adelgaza primero de cara y barriga, y quien tarda más en notarlo donde le gustaría.",
          },
        ],
      },
      {
        h2: "De qué depende que sea más rápido o más lento",
        blocks: [
          {
            type: "list",
            items: [
              "Tu peso de partida: con más peso, los primeros cambios llegan antes.",
              "El déficit calórico real y la calidad de tu alimentación.",
              "El sueño y el estrés, que influyen en las hormonas del apetito.",
              "Tu fisiología: tiroides, insulina, edad y genética.",
              "Si usas un tratamiento médico supervisado, el ritmo puede ser mayor.",
            ],
          },
        ],
      },
      {
        h2: "Por qué no deberías ir más rápido",
        blocks: [
          {
            type: "p",
            text: "Es tentador querer resultados en una semana, pero perder peso demasiado rápido suele significar perder músculo y agua, no grasa. Y el músculo es justo lo que mantiene tu metabolismo activo. Un ritmo de 0,5–1 % del peso por semana es lo que mejor se sostiene y lo que evita el efecto rebote.",
          },
          {
            type: "quote",
            text: "Lo rápido se recupera rápido. Lo que se pierde despacio y con cabeza es lo que se queda.",
          },
        ],
      },
      {
        h2: "Cómo no perder la motivación",
        blocks: [
          {
            type: "list",
            items: [
              "Mide más allá de la báscula: fotos, medidas y cómo te queda la ropa.",
              "Fíjate en señales de energía, sueño y digestión.",
              "Celebra el proceso, no solo el número final.",
              "Apóyate en un seguimiento profesional para ajustar a tiempo.",
            ],
          },
          {
            type: "p",
            text: "En DoctorLife te ayudamos a leer bien tu progreso para que no abandones justo cuando estás avanzando. La valoración inicial es gratuita.",
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Cuánto se tarda en notar que bajas de peso?",
        respuesta:
          "El primer cambio en la báscula aparece en 1–2 semanas (sobre todo agua), la ropa cambia hacia las 3–4 semanas y los cambios visibles en el espejo, entre la semana 6 y la 12. Depende de tu punto de partida y tu plan.",
      },
      {
        pregunta: "¿Por qué tardo más que otras personas?",
        respuesta:
          "Influyen el peso de partida, las hormonas (tiroides, insulina), el sueño, el estrés y la genética. No compararse es clave: cada cuerpo responde a su ritmo.",
      },
      {
        pregunta: "¿En qué parte del cuerpo se nota antes?",
        respuesta:
          "Varía según la persona. Muchas notan primero la cara y la barriga, pero no se puede elegir dónde se pierde grasa: depende de tu genética.",
      },
      {
        pregunta: "¿Adelgazar rápido es mejor?",
        respuesta:
          "No. Perder peso muy rápido suele implicar pérdida de músculo y agua y favorece el efecto rebote. Un ritmo de 0,5–1 % del peso por semana es más sano y duradero.",
      },
    ],
    sources: [S.oms, S.nice, S.semfyc],
    authorSlug: "carlos-vidal",
    reviewerSlug: "laura-mendez",
    datePublished: "2026-03-12",
    dateModified: "2026-06-16",
    relatedSlugs: ["llevo-una-semana-a-dieta-y-no-bajo-de-peso", "por-que-no-consigo-adelgazar", "por-que-pierdo-peso-y-luego-lo-recupero"],
    cover: "/hero/woman.png",
    coverAlt: "Persona comprobando cómo le queda la ropa más holgada",
    readMins: 6,
  },

  {
    slug: "como-quitar-la-grasa-de-la-barriga-que-no-se-va",
    title: "Cómo quitar la grasa de la barriga que no se va",
    h1: "Cómo quitar la grasa de la barriga que no se va",
    metaTitle: "Cómo Quitar la Grasa de la Barriga que No se Va: Guía Médica | DoctorLife",
    metaDescription:
      "La grasa de la barriga que no se va tiene causas concretas: insulina, cortisol, sueño y hormonas. Qué funciona de verdad y qué es un mito para perder barriga.",
    category: "Salud metabólica",
    answerFirst:
      "La grasa de la barriga que no se va suele estar ligada a la resistencia a la insulina, al cortisol alto por estrés o falta de sueño y a factores hormonales. No se elimina con abdominales ni con productos milagro: se reduce mejorando el sueño, el estrés, la alimentación, el ejercicio de fuerza y, si hace falta, con tratamiento médico.",
    keyTakeaways: [
      "No existe la pérdida de grasa localizada: los abdominales no queman la barriga.",
      "La resistencia a la insulina y el cortisol alto favorecen la grasa abdominal.",
      "Dormir poco y el estrés crónico son causas muy frecuentes y poco tenidas en cuenta.",
      "El ejercicio de fuerza y la proteína ayudan más que el cardio infinito.",
      "Si hay un problema metabólico, tratarlo es lo que desbloquea la barriga.",
    ],
    body: [
      {
        h2: "Por qué esa barriga no se va",
        blocks: [
          {
            type: "p",
            text: "La grasa abdominal que se resiste rara vez es 'culpa' de no hacer suficientes abdominales. Suele tener un origen metabólico y hormonal. Cuando hay resistencia a la insulina, el cuerpo almacena grasa preferentemente en el abdomen. Y cuando el cortisol está alto por estrés o por dormir poco, ocurre lo mismo.",
          },
          {
            type: "p",
            text: "Por eso puedes estar haciendo ejercicio y comiendo 'bien' y aun así no ver cambios en la tripa: estás trabajando el síntoma, no la causa.",
          },
        ],
      },
      {
        h2: "Mitos que no funcionan",
        blocks: [
          {
            type: "list",
            items: [
              "Hacer mil abdominales: tonifican el músculo, pero no queman la grasa de encima.",
              "Fajas, cremas y 'quemagrasas': sin evidencia para reducir grasa real.",
              "El cardio en ayunas como solución mágica: ayuda poco si todo lo demás falla.",
              "Eliminar un solo alimento 'milagro': la grasa abdominal es multifactorial.",
            ],
          },
          {
            type: "quote",
            text: "La grasa localizada no se elige. No puedes quemar barriga haciendo barriga: el cuerpo decide de dónde tira.",
          },
        ],
      },
      {
        h2: "Lo que sí funciona",
        blocks: [
          {
            type: "list",
            items: [
              "Dormir 7–8 horas: bajar el cortisol cambia mucho la grasa abdominal.",
              "Gestionar el estrés crónico (es una causa real, no una excusa).",
              "Comer más proteína y reducir ultraprocesados y alcohol.",
              "Entrenar fuerza: más músculo mejora la sensibilidad a la insulina.",
              "Tratar la resistencia a la insulina si existe, con apoyo médico.",
            ],
          },
        ],
      },
      {
        h2: "Cuándo conviene una valoración médica",
        blocks: [
          {
            type: "p",
            text: "Si has hecho todo lo razonable y la barriga no cede, no es momento de castigarte más, sino de mirar dentro. Una analítica de glucosa e insulina y una valoración pueden revelar una resistencia a la insulina o un problema hormonal que, una vez tratado, hace que por fin se mueva.",
          },
          {
            type: "p",
            text: "En DoctorLife valoramos tu salud metabólica gratis y, si lo necesitas, diseñamos un plan que ataque la causa real de esa barriga que no se va.",
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Cómo se quita la grasa de la barriga que no se va?",
        respuesta:
          "Mejorando el sueño y el estrés (para bajar el cortisol), comiendo más proteína y menos ultraprocesados, entrenando fuerza y tratando la resistencia a la insulina si existe. No hay pérdida localizada: los abdominales no bastan.",
      },
      {
        pregunta: "¿Los abdominales queman la grasa de la barriga?",
        respuesta:
          "No. Los abdominales fortalecen el músculo, pero no eliminan la grasa que tienen encima. La grasa se pierde de forma global, no en la zona que trabajas.",
      },
      {
        pregunta: "¿Por qué tengo barriga si hago ejercicio?",
        respuesta:
          "Porque la grasa abdominal suele ser metabólica: resistencia a la insulina, cortisol alto por estrés o falta de sueño. Si no tratas la causa, el ejercicio solo no la elimina.",
      },
      {
        pregunta: "¿El estrés engorda la barriga?",
        respuesta:
          "Sí. El estrés crónico eleva el cortisol, que favorece acumular grasa abdominal y aumenta el apetito. Gestionarlo es parte del tratamiento, no un detalle menor.",
      },
    ],
    sources: [S.seen, S.oms, S.nice],
    authorSlug: "laura-mendez",
    reviewerSlug: "carlos-vidal",
    datePublished: "2026-03-25",
    dateModified: "2026-06-16",
    relatedSlugs: ["tengo-barriga-pero-no-estoy-gordo", "por-que-engordo-si-como-poco", "por-que-no-consigo-adelgazar"],
    cover: "/products/maren-pen.png",
    coverAlt: "Persona midiéndose la barriga frente al espejo",
    readMins: 7,
  },

  {
    slug: "por-que-pierdo-peso-y-luego-lo-recupero",
    title: "Por qué pierdo peso y luego lo recupero",
    h1: "Por qué pierdo peso y luego lo recupero (el efecto rebote)",
    metaTitle: "Por Qué Pierdo Peso y Luego lo Recupero: El Efecto Rebote | DoctorLife",
    metaDescription:
      "Adelgazas y vuelves a engordar una y otra vez. Te explicamos el efecto rebote, por qué tu cuerpo defiende su peso y cómo perder peso sin recuperarlo.",
    category: "Mantenimiento",
    answerFirst:
      "Pierdes peso y luego lo recuperas por el efecto rebote: tras una dieta restrictiva, tu cuerpo baja el gasto energético y aumenta el hambre para volver a su peso anterior. Es una respuesta biológica de supervivencia, no un fracaso personal. Se evita perdiendo peso despacio, manteniendo músculo y con una fase de mantenimiento supervisada.",
    keyTakeaways: [
      "El efecto rebote es una respuesta biológica, no una falta de disciplina.",
      "Las dietas restrictivas bajan el metabolismo y disparan el hambre al terminar.",
      "Perder músculo durante la dieta facilita recuperar la grasa después.",
      "El mantenimiento es una fase del tratamiento, no el 'final' de la dieta.",
      "Un plan supervisado y un ritmo lento son lo que evita recuperar el peso.",
    ],
    body: [
      {
        h2: "Qué es el efecto rebote",
        blocks: [
          {
            type: "p",
            text: "Tu cuerpo tiene un peso que tiende a defender. Cuando adelgazas rápido con una dieta dura, interpreta la pérdida como una amenaza: reduce el gasto en reposo, aumenta las hormonas del hambre (grelina) y baja las de la saciedad (leptina). El resultado es que, al terminar la dieta, tienes más hambre y quemas menos. La báscula vuelve a subir casi sin querer.",
          },
          {
            type: "quote",
            text: "El efecto rebote no es que falles tú: es que tu biología está haciendo exactamente lo que evolucionó para hacer.",
          },
        ],
      },
      {
        h2: "Por qué las dietas estrictas casi garantizan recuperar el peso",
        blocks: [
          {
            type: "list",
            items: [
              "Son insostenibles: nadie come así toda la vida.",
              "Hacen perder músculo, que es el motor del metabolismo.",
              "Generan ansiedad por la comida y atracones posteriores.",
              "No enseñan hábitos, así que al dejarlas vuelves al punto de partida.",
            ],
          },
          {
            type: "p",
            text: "Por eso el patrón se repite: pierdes 8 kilos, recuperas 10; pierdes 10, recuperas 12. Cada ciclo deja el metabolismo más adaptado y el siguiente intento, más difícil.",
          },
        ],
      },
      {
        h2: "Cómo perder peso sin recuperarlo",
        blocks: [
          {
            type: "list",
            items: [
              "Pierde peso despacio (0,5–1 % por semana) para preservar músculo.",
              "Come suficiente proteína y entrena fuerza durante el proceso.",
              "Cuida el sueño y el estrés, que regulan el apetito.",
              "Planifica una fase de mantenimiento, no un 'fin de la dieta'.",
              "Apóyate en seguimiento médico para ajustar antes de recaer.",
            ],
          },
        ],
      },
      {
        h2: "El papel del tratamiento médico",
        blocks: [
          {
            type: "p",
            text: "En personas con obesidad, los análogos del GLP‑1 ayudan precisamente con el punto débil del mantenimiento: regulan el apetito y reducen las ganas de recuperar lo perdido. Pero deben usarse con un plan, y la retirada, cuando llega, debe ser progresiva y supervisada para no caer de nuevo en el rebote.",
          },
          {
            type: "p",
            text: "En DoctorLife no buscamos que adelgaces rápido, sino que no vuelvas a empezar de cero. Diseñamos el tratamiento pensando en el después. La primera valoración es gratuita.",
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Por qué recupero el peso que pierdo?",
        respuesta:
          "Por el efecto rebote: tras una dieta restrictiva, tu cuerpo baja el gasto energético y aumenta el hambre para volver a su peso previo. Es biología de supervivencia. Se evita perdiendo peso despacio y con una fase de mantenimiento.",
      },
      {
        pregunta: "¿Qué es el efecto rebote?",
        respuesta:
          "Es la recuperación del peso tras adelgazar, causada por la adaptación del metabolismo y el aumento del hambre. Cuanto más estricta es la dieta, mayor es el rebote posterior.",
      },
      {
        pregunta: "¿Cómo evito volver a engordar?",
        respuesta:
          "Perdiendo peso despacio, manteniendo músculo con proteína y fuerza, cuidando sueño y estrés, y planificando una fase de mantenimiento supervisada en lugar de 'terminar' la dieta de golpe.",
      },
      {
        pregunta: "¿Se recupera el peso al dejar un tratamiento GLP‑1?",
        respuesta:
          "Puede ocurrir si se retira sin estrategia. Por eso la retirada debe ser progresiva y acompañada de hábitos consolidados y seguimiento médico para mantener los resultados.",
      },
    ],
    sources: [S.oms, S.seen, S.nice, S.aemps],
    authorSlug: "laura-mendez",
    reviewerSlug: "carlos-vidal",
    datePublished: "2026-04-05",
    dateModified: "2026-06-16",
    relatedSlugs: ["por-que-no-consigo-adelgazar", "ozempic-merece-la-pena", "cuanto-se-tarda-en-notar-que-bajas-de-peso"],
    cover: "/products/maren-oral.png",
    coverAlt: "Gráfico de peso que sube y baja representando el efecto rebote",
    readMins: 8,
  },

  /* ── Cluster Retatrutida (tema de alta demanda de búsqueda) ── */
  {
    slug: "retatrutida-que-es",
    title: "Qué es la retatrutida",
    h1: "Retatrutida: qué es, para qué sirve y por qué todo el mundo habla de ella",
    metaTitle: "Retatrutida: Qué Es, Para Qué Sirve y Resultados | DoctorLife",
    metaDescription:
      "Qué es la retatrutida, el inyectable triple agonista de Eli Lilly para la obesidad. Cómo funciona, resultados de los ensayos y por qué aún no se vende en España.",
    category: "Tratamientos",
    answerFirst:
      "La retatrutida es un medicamento inyectable experimental de Eli Lilly para la obesidad y la diabetes tipo 2. Es un triple agonista: estimula a la vez los receptores de GLP‑1, GIP y glucagón, lo que reduce el apetito y aumenta el gasto energético. En ensayos clínicos logró pérdidas de hasta el 24 % del peso, pero todavía no está aprobada ni a la venta en España.",
    keyTakeaways: [
      "La retatrutida es un triple agonista (GLP‑1, GIP y glucagón), una generación por delante de Ozempic o Mounjaro.",
      "En el ensayo de fase 2 logró pérdidas de peso de hasta el 24 % a las 48 semanas.",
      "Sigue siendo experimental: no está aprobada por la EMA ni la AEMPS y no se vende en España.",
      "Comprarla por internet o fuera del circuito legal es peligroso e ilegal.",
      "Hoy ya existen alternativas eficaces y legales con receta y supervisión médica (semaglutida, tirzepatida).",
    ],
    body: [
      {
        h2: "Qué es exactamente la retatrutida",
        blocks: [
          {
            type: "p",
            text: "La retatrutida (nombre en investigación LY3437943) es un fármaco inyectable que Eli Lilly está desarrollando para tratar la obesidad y la diabetes tipo 2. Pertenece a la misma familia que Ozempic, Wegovy o Mounjaro —los llamados análogos de las hormonas intestinales— pero da un paso más allá en su mecanismo.",
          },
          {
            type: "p",
            text: "Mientras la semaglutida (Ozempic, Wegovy) actúa sobre una sola hormona y la tirzepatida (Mounjaro) sobre dos, la retatrutida actúa sobre tres a la vez. Por eso se la conoce como 'triple agonista' y por eso genera tanta expectación: en los estudios preliminares ha mostrado las mayores pérdidas de peso vistas hasta ahora con un fármaco.",
          },
        ],
      },
      {
        h2: "Cómo funciona el triple mecanismo",
        blocks: [
          {
            type: "p",
            text: "La retatrutida imita tres hormonas que tu cuerpo produce de forma natural y que regulan el hambre, la glucosa y el gasto de energía:",
          },
          {
            type: "list",
            items: [
              "GLP‑1: reduce el apetito y enlentece el vaciado del estómago, así te sientes saciado antes y durante más tiempo.",
              "GIP: mejora cómo el cuerpo gestiona la glucosa y potencia el efecto del GLP‑1 sobre el apetito.",
              "Glucagón: aumenta el gasto energético, es decir, ayuda a 'quemar' más energía en reposo.",
            ],
          },
          {
            type: "p",
            text: "Esa combinación de comer menos y gastar más a la vez es lo que explica los resultados tan llamativos. Es también lo que la diferencia de los GLP‑1 actuales, que trabajan sobre todo reduciendo el apetito.",
          },
        ],
      },
      {
        h2: "Qué resultados ha mostrado en los ensayos",
        blocks: [
          {
            type: "stat",
            value: "Hasta 24 %",
            label: "de pérdida de peso a las 48 semanas en el ensayo de fase 2 publicado en NEJM",
          },
          {
            type: "p",
            text: "En el ensayo de fase 2 publicado en The New England Journal of Medicine, las personas que recibieron la dosis más alta perdieron de media alrededor del 24 % de su peso corporal en 48 semanas, una cifra superior a la de cualquier otro fármaco para la obesidad disponible hoy. Aun así, conviene ser prudente: son resultados de estudios todavía en marcha y faltan los ensayos de fase 3, que son los que confirman eficacia y seguridad a largo plazo.",
          },
          {
            type: "quote",
            text: "Los datos de la retatrutida son prometedores, pero 'prometedor' no significa 'disponible'. Un fármaco experimental no es una opción de tratamiento todavía.",
          },
        ],
      },
      {
        h2: "Efectos secundarios conocidos",
        blocks: [
          {
            type: "p",
            text: "Como el resto de fármacos de esta familia, los efectos adversos más frecuentes en los estudios fueron digestivos y de intensidad leve a moderada, sobre todo al subir la dosis:",
          },
          {
            type: "list",
            items: [
              "Náuseas, sobre todo al inicio del tratamiento.",
              "Diarrea o estreñimiento.",
              "Vómitos y molestias abdominales.",
              "Disminución del apetito (efecto buscado, pero a veces excesivo).",
            ],
          },
          {
            type: "p",
            text: "Al ser un medicamento experimental, su perfil de seguridad completo todavía se está estudiando. Por eso ningún profesional serio puede recomendártela hoy fuera de un ensayo clínico.",
          },
        ],
      },
      {
        h2: "Entonces, ¿qué puedes hacer hoy?",
        blocks: [
          {
            type: "p",
            text: "Si la retatrutida te interesa porque buscas perder peso de forma eficaz, la buena noticia es que no tienes que esperar años. Ya existen tratamientos aprobados, legales y con años de evidencia detrás: la semaglutida y la tirzepatida, que se prescriben con receta y seguimiento médico.",
          },
          {
            type: "p",
            text: "En DoctorLife, una valoración médica gratuita permite saber si uno de estos tratamientos encaja en tu caso, sin recurrir a fármacos experimentales ni a compras ilegales por internet.",
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿La retatrutida ya se vende en España?",
        respuesta:
          "No. La retatrutida es un fármaco experimental que aún no ha sido aprobado por la EMA ni por la AEMPS, por lo que no está a la venta en España ni en la Unión Europea. Cualquier producto que se anuncie como 'retatrutida' fuera del circuito legal es un riesgo para tu salud.",
      },
      {
        pregunta: "¿Cuánto peso se pierde con la retatrutida?",
        respuesta:
          "En el ensayo de fase 2, las personas con la dosis más alta perdieron de media alrededor del 24 % de su peso en 48 semanas. Son resultados muy llamativos, pero todavía deben confirmarse en ensayos de fase 3 antes de su posible aprobación.",
      },
      {
        pregunta: "¿En qué se diferencia de Ozempic o Mounjaro?",
        respuesta:
          "Ozempic (semaglutida) actúa sobre una hormona, Mounjaro (tirzepatida) sobre dos y la retatrutida sobre tres (GLP‑1, GIP y glucagón). Ese triple mecanismo es lo que explicaría sus mayores pérdidas de peso, pero a diferencia de las otras dos, la retatrutida aún no está aprobada.",
      },
      {
        pregunta: "¿Hay alguna alternativa legal disponible ahora?",
        respuesta:
          "Sí. La semaglutida y la tirzepatida están aprobadas y se prescriben con receta y supervisión médica. Una valoración médica permite saber si son adecuadas para ti, con seguridad y sin recurrir a fármacos experimentales.",
      },
    ],
    sources: [S.nejm, S.lilly, S.ema, S.aemps],
    authorSlug: "laura-mendez",
    reviewerSlug: "carlos-vidal",
    datePublished: "2026-06-10",
    dateModified: "2026-06-16",
    relatedSlugs: ["retatrutida-comprar-espana", "retatrutida-vs-ozempic-mounjaro", "ozempic-merece-la-pena"],
    cover: "/articles/retatrutida-que-es.png",
    coverAlt: "Pluma inyectable de medicación sobre una superficie cálida representando la retatrutida",
    readMins: 8,
  },

  {
    slug: "retatrutida-comprar-espana",
    title: "Comprar retatrutida en España",
    h1: "Comprar retatrutida en España: ¿es posible en 2026?",
    metaTitle: "Comprar Retatrutida en España: ¿Se Puede? (Aviso 2026) | DoctorLife",
    metaDescription:
      "¿Se puede comprar retatrutida en España? Hoy NO es legal ni está aprobada. Te explicamos los riesgos del mercado negro y qué alternativas legales sí existen.",
    category: "Disponibilidad",
    answerFirst:
      "No, hoy no es posible comprar retatrutida en España de forma legal: es un fármaco experimental que aún no ha sido aprobado por la AEMPS ni la EMA, por lo que no existe en farmacias ni con receta. Cualquier web que la venda opera en el mercado negro, con riesgos graves para tu salud. Sí existen alternativas legales y eficaces con supervisión médica.",
    keyTakeaways: [
      "La retatrutida no está aprobada ni a la venta en España: no la encontrarás en ninguna farmacia legal.",
      "Las webs que la ofrecen venden productos sin garantías, falsificados o peligrosos.",
      "Comprar e inyectarse un fármaco no aprobado es ilegal y un riesgo serio para tu salud.",
      "Existen tratamientos aprobados (semaglutida, tirzepatida) que sí puedes usar con receta.",
      "Una valoración médica gratuita te dice qué opción legal encaja contigo hoy.",
    ],
    body: [
      {
        h2: "La respuesta corta: hoy no se puede comprar legalmente",
        blocks: [
          {
            type: "p",
            text: "Si has llegado hasta aquí buscando dónde comprar retatrutida en España, conviene ser claro desde el principio: no se puede hacer de forma legal. La retatrutida sigue siendo un medicamento en investigación. No ha completado los ensayos necesarios ni ha recibido la autorización de la Agencia Europea de Medicamentos (EMA) ni de la Agencia Española de Medicamentos (AEMPS).",
          },
          {
            type: "p",
            text: "Eso significa que no existe en las farmacias, no se puede prescribir con receta y ningún canal oficial la distribuye. Está reservada, de momento, a los ensayos clínicos controlados.",
          },
        ],
      },
      {
        h2: "Por qué deberías desconfiar de quien te la venda",
        blocks: [
          {
            type: "p",
            text: "Justamente porque hay mucha gente buscándola, han aparecido webs, redes sociales y vendedores que ofrecen supuesta 'retatrutida'. Detrás de esas ofertas casi nunca hay un fármaco real y seguro:",
          },
          {
            type: "list",
            items: [
              "No sabes qué contiene el vial: puede ser una sustancia falsa, mal dosificada o contaminada.",
              "No hay control de fabricación, esterilidad ni cadena de frío.",
              "Nadie supervisa la dosis ni los efectos adversos, que pueden ser graves.",
              "Es ilegal: importar y usar un medicamento no autorizado tiene consecuencias legales.",
              "Si algo va mal, no tienes ninguna garantía ni respaldo sanitario.",
            ],
          },
          {
            type: "quote",
            text: "Inyectarte un producto comprado por internet del que no conoces ni el origen ni el contenido no es 'adelantarte al futuro': es jugártela con tu salud.",
          },
        ],
      },
      {
        h2: "Por qué hay tanta gente buscándola",
        blocks: [
          {
            type: "p",
            text: "La expectación es comprensible. Los datos preliminares de la retatrutida muestran las mayores pérdidas de peso vistas con un fármaco —hasta un 24 % en los estudios—, y eso genera muchísimo interés en quienes llevan años intentando adelgazar sin éxito. El problema es confundir 'noticia prometedora' con 'tratamiento disponible'.",
          },
          {
            type: "p",
            text: "Probablemente la retatrutida llegue a aprobarse en los próximos años si confirma su eficacia y seguridad. Pero hasta entonces, perseguirla por canales no oficiales solo te expone a riesgos sin ninguna ventaja real.",
          },
        ],
      },
      {
        h2: "Qué sí puedes hacer hoy (y es legal)",
        blocks: [
          {
            type: "p",
            text: "La buena noticia es que no necesitas esperar a la retatrutida para tratar tu peso con un fármaco eficaz. Ya hay opciones aprobadas, con años de evidencia y disponibles con receta:",
          },
          {
            type: "list",
            items: [
              "Semaglutida (el principio activo de Ozempic y Wegovy): pérdidas de peso de en torno al 15 % en los estudios.",
              "Tirzepatida (el principio activo de Mounjaro): doble agonista, con pérdidas de hasta el 22 %.",
              "Ambas se prescriben tras una valoración médica y con seguimiento profesional.",
            ],
          },
          {
            type: "p",
            text: "En DoctorLife puedes hacer una valoración médica gratuita para saber si uno de estos tratamientos es adecuado para ti. Es la forma de obtener resultados reales sin recurrir a fármacos experimentales ni a compras ilegales.",
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Dónde puedo comprar retatrutida en España?",
        respuesta:
          "En ningún sitio de forma legal. La retatrutida no está aprobada por la AEMPS ni la EMA, así que no se vende en farmacias ni con receta. Cualquier web o vendedor que la ofrezca opera al margen de la ley y pone en riesgo tu salud.",
      },
      {
        pregunta: "¿Es peligroso comprar retatrutida por internet?",
        respuesta:
          "Sí, mucho. No tienes garantías de qué contiene el producto, cómo se ha fabricado ni si está contaminado. Además, usar un fármaco no aprobado sin supervisión médica puede provocar efectos adversos graves y es ilegal.",
      },
      {
        pregunta: "¿Cuándo estará disponible la retatrutida en España?",
        respuesta:
          "No hay fecha confirmada. Depende de que termine los ensayos de fase 3 y reciba la aprobación de la EMA y la AEMPS, algo que suele tardar varios años. Hasta entonces no estará disponible por ningún canal legal.",
      },
      {
        pregunta: "¿Qué alternativa legal hay mientras tanto?",
        respuesta:
          "La semaglutida y la tirzepatida ya están aprobadas y se prescriben con receta y seguimiento. Una valoración médica gratuita en DoctorLife permite saber si alguna encaja en tu caso, de forma segura y legal.",
      },
    ],
    sources: [S.aemps, S.ema, S.nejm, S.seen],
    authorSlug: "carlos-vidal",
    reviewerSlug: "laura-mendez",
    datePublished: "2026-06-12",
    dateModified: "2026-06-16",
    relatedSlugs: ["retatrutida-que-es", "retatrutida-vs-ozempic-mounjaro", "ozempic-merece-la-pena"],
    cover: "/articles/retatrutida-comprar-espana.png",
    coverAlt: "Persona buscando en el móvil cómo comprar retatrutida con una farmacia desenfocada al fondo",
    readMins: 7,
  },

  {
    slug: "retatrutida-vs-ozempic-mounjaro",
    title: "Retatrutida vs Ozempic y Mounjaro",
    h1: "Retatrutida vs Ozempic, Wegovy y Mounjaro: ¿cuál es mejor?",
    metaTitle: "Retatrutida vs Ozempic vs Mounjaro: Comparativa 2026 | DoctorLife",
    metaDescription:
      "Comparativa entre retatrutida, semaglutida (Ozempic, Wegovy) y tirzepatida (Mounjaro): mecanismo, pérdida de peso y disponibilidad. Cuál puedes usar hoy en España.",
    category: "Comparativa",
    answerFirst:
      "La retatrutida es un triple agonista (GLP‑1, GIP y glucagón) y en los ensayos logra las mayores pérdidas de peso (hasta el 24 %), por delante de la tirzepatida (Mounjaro, hasta 22 %) y la semaglutida (Ozempic/Wegovy, en torno al 15 %). Sin embargo, la retatrutida aún es experimental, mientras que las otras dos ya están aprobadas y disponibles con receta en España.",
    keyTakeaways: [
      "La diferencia clave es el mecanismo: semaglutida actúa sobre 1 hormona, tirzepatida sobre 2 y retatrutida sobre 3.",
      "En los estudios, la pérdida de peso crece con cada generación: ~15 %, ~22 % y hasta 24 %.",
      "Solo la semaglutida y la tirzepatida están aprobadas y disponibles en España.",
      "Más pérdida de peso potencial no significa que sea la mejor opción para ti: importa la seguridad y el seguimiento.",
      "La opción adecuada se decide en una valoración médica, no por la cifra de un titular.",
    ],
    body: [
      {
        h2: "La diferencia está en cuántas hormonas activan",
        blocks: [
          {
            type: "p",
            text: "Los tres fármacos pertenecen a la misma familia, pero representan generaciones distintas. La clave para entenderlos es cuántas hormonas intestinales imitan, porque de ahí salen sus diferencias en eficacia.",
          },
          {
            type: "list",
            items: [
              "Semaglutida (Ozempic, Wegovy): agonista único de GLP‑1.",
              "Tirzepatida (Mounjaro): doble agonista de GLP‑1 y GIP.",
              "Retatrutida: triple agonista de GLP‑1, GIP y glucagón.",
            ],
          },
        ],
      },
      {
        h2: "Comparativa rápida",
        blocks: [
          {
            type: "table",
            caption: "Comparativa orientativa basada en datos de ensayos clínicos. No es una recomendación de tratamiento.",
            head: ["Fármaco", "Mecanismo", "Pérdida de peso (estudios)", "Disponible en España"],
            rows: [
              ["Semaglutida (Ozempic/Wegovy)", "Agonista GLP‑1", "~15 %", "Sí, con receta"],
              ["Tirzepatida (Mounjaro)", "Doble: GLP‑1 + GIP", "Hasta ~22 %", "Sí, con receta"],
              ["Retatrutida", "Triple: GLP‑1 + GIP + glucagón", "Hasta ~24 %", "No (experimental)"],
            ],
          },
          {
            type: "p",
            text: "Las cifras de pérdida de peso proceden de ensayos distintos y no son directamente comparables entre sí, pero dan una idea de la tendencia: cada generación añade un mecanismo y, con él, mayor potencial de pérdida de peso.",
          },
        ],
      },
      {
        h2: "Más pérdida de peso no significa 'mejor para ti'",
        blocks: [
          {
            type: "p",
            text: "Es tentador quedarse con el número más alto, pero la mejor opción no es la que más adelgaza en un estudio, sino la que es adecuada y segura para tu caso concreto. Influyen tu historia clínica, otras enfermedades, los efectos secundarios que toleras y, sobre todo, qué está aprobado y disponible.",
          },
          {
            type: "quote",
            text: "El fármaco 'más potente' sobre el papel no sirve de nada si no puedes usarlo de forma legal y supervisada. Hoy, eso descarta a la retatrutida.",
          },
        ],
      },
      {
        h2: "Qué puedes usar hoy en España",
        blocks: [
          {
            type: "p",
            text: "A día de hoy, las opciones realistas y legales son la semaglutida y la tirzepatida. Ambas tienen años de evidencia, se prescriben con receta y se usan con seguimiento médico para ajustar la dosis y vigilar los efectos. La retatrutida, por muy prometedora que sea, todavía no es una de ellas.",
          },
          {
            type: "p",
            text: "La forma sensata de decidir es una valoración médica: un profesional revisa tu situación y te dice qué tratamiento aprobado encaja contigo. En DoctorLife esa primera valoración es gratuita.",
          },
        ],
      },
    ],
    faq: [
      {
        pregunta: "¿Es la retatrutida mejor que Mounjaro u Ozempic?",
        respuesta:
          "En los ensayos, la retatrutida muestra mayores pérdidas de peso (hasta el 24 %) que la tirzepatida (Mounjaro) o la semaglutida (Ozempic). Pero 'mejor en un estudio' no equivale a mejor para ti: la retatrutida aún es experimental y no se puede usar, mientras que las otras dos ya están disponibles.",
      },
      {
        pregunta: "¿Cuál pierde más peso?",
        respuesta:
          "Según los datos disponibles, la retatrutida es la que más, seguida de la tirzepatida y luego la semaglutida. Aun así, las cifras vienen de estudios distintos y no son directamente comparables, y la respuesta varía mucho de una persona a otra.",
      },
      {
        pregunta: "¿Puedo elegir yo qué fármaco usar?",
        respuesta:
          "No directamente. Son medicamentos de prescripción: es el médico quien valora tu caso y decide cuál es adecuado y seguro para ti, ajustando la dosis y haciendo seguimiento. Autoindicarse o comprarlos por internet es peligroso e ilegal.",
      },
      {
        pregunta: "¿Por qué no puedo usar retatrutida si es la más eficaz?",
        respuesta:
          "Porque todavía no ha sido aprobada por la EMA ni la AEMPS y sigue en fase de investigación. Hasta que complete los ensayos y reciba autorización, no está disponible de forma legal en España.",
      },
    ],
    sources: [S.nejm, S.lilly, S.aemps, S.ema, S.seen],
    authorSlug: "carlos-vidal",
    reviewerSlug: "laura-mendez",
    datePublished: "2026-06-14",
    dateModified: "2026-06-16",
    relatedSlugs: ["retatrutida-que-es", "retatrutida-comprar-espana", "ozempic-merece-la-pena"],
    cover: "/articles/retatrutida-vs-ozempic-mounjaro.png",
    coverAlt: "Tres plumas inyectables alineadas comparando retatrutida, Ozempic y Mounjaro",
    readMins: 8,
  },
];

/* ── Helpers ── */
export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelated(slug: string): Article[] {
  const article = getArticle(slug);
  if (!article) return [];
  return article.relatedSlugs
    .map((s) => getArticle(s))
    .filter((a): a is Article => Boolean(a));
}

export function getArticlesByAuthor(authorSlug: string): Article[] {
  return articles.filter((a) => a.authorSlug === authorSlug || a.reviewerSlug === authorSlug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
