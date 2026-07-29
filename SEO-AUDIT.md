# SEO-AUDIT — DoctorLife (doctorlife.io)

**Fecha:** 2026-07-06
**Auditor:** auditoría técnica automatizada (rúbrica YMYL 100 pts)
**Alcance:** solo código del repo. Nada externo (backlinks, GSC, rankings) se puntúa.

---

## 1. Tabla resumen

| Cat. | Área | Obtenido | Máx. | Evidencia clave / carencia principal |
|------|------|----------|------|--------------------------------------|
| A | Infraestructura técnica | **14** | 20 | `generateMetadata` + canonical en las 3 plantillas dinámicas; sin `not-found.tsx`, sin redirects, sin OG dinámica |
| B | Rendimiento / CWV | **5** | 10 | `next/font` con swap OK; `images.unoptimized: true` anula next/image; sin dynamic imports |
| C | Datos estructurados | **9** | 15 | MedicalWebPage + reviewedBy + FAQPage OK; MedicalOrganization sin dirección/registro/sameAs; sin schema Drug |
| D | E-E-A-T y entidad médica | **10** | 20 | Cluster editorial con AuthorCard + SourcesList; blog usa 1 solo revisor para 59 posts; sin política editorial ni "sobre nosotros"; footer sin registro sanitario |
| E | Arquitectura e interlinking | **12** | 15 | Hub-and-spoke pillar + relacionados + BOFU OK; **/blog quedó huérfano** al quitar sus enlaces de navbar y footer |
| F | Capa programática | **1** | 10 | 59 posts generados con plantillas rotadas `{Drug}/{City}`; **cero** lógica de noindex condicional |
| G | Preparación GEO / IA | **4** | 5 | robots permite `*` (implícito, no explícito); estructura muy extraíble (tablas, FAQs, KeyTakeaways) |
| H | Cumplimiento sanitario en conversión | **0** | 5 | 20+ apariciones de "GLP-1", "receta", "inyección", "prescribe" en landings de servicio y pricing |
| **TOTAL** | | **55** | **100** | |

## 2. Puntuación total

### 55 / 100 — **Base insuficiente** (banda 41–70)

Fuerte en plantillas editoriales del cluster (`/[articulo]`) y en sitemap/robots; hundido por la capa programática sin control (F), el incumplimiento total en rutas de conversión (H) y huecos E-E-A-T institucionales (D).

---

## 3. Evidencia detallada por categoría

### A. Infraestructura técnica — 14/20

| Check | Pts | Evidencia |
|---|---|---|
| Metadata API por ruta | 3/4 | `app/blog/[slug]/page.tsx:19-46` (title/desc únicos vía `seoTitle`/`seoDescription`), `app/[articulo]/page.tsx:11-44`, `app/autores/[slug]/page.tsx:23-44`. **Carencia:** `app/page.tsx` no exporta metadata propia (hereda genérica de `app/layout.tsx:37-48`). |
| Canonicals | 2/3 | `app/blog/[slug]/page.tsx:35`, `app/[articulo]/page.tsx:26`, `app/autores/[slug]/page.tsx:36`. **Carencia:** home y `/blog` (listado) sin canonical verificable. |
| sitemap.ts segmentado | 3/3 | `app/sitemap.ts`: segmentos estáticos + blog + articles + authors, `lastModified` real por post, `revalidate = 86400`. Funnels noindex correctamente excluidos. |
| robots.ts | 2/2 | `app/robots.ts:12-16`: staging/preview bloqueado por host; producción allow all + sitemap + host. |
| Redirects y 404 | 0/2 | No existe `app/not-found.tsx` (verificado: `ls` falla). Sin `redirects()` en `next.config.mjs`. |
| URLs limpias | 1/2 | Slugs kebab-case consistentes. **Carencia:** 11 rutas funnel casi duplicadas (`/consulta-peso-*`) — noindexadas, pero contaminan el grafo de URLs. |
| Breadcrumbs | 2/2 | UI en `app/blog/[slug]/page.tsx:202-208`, componente `Breadcrumbs` en `app/autores/[slug]/page.tsx:78` y `components/editorial/article-layout.tsx:174`. |
| OG + Twitter | 1/2 | OG completo en las 3 plantillas; twitter card solo en `[articulo]:37-42`. **Carencia:** no hay `opengraph-image.tsx` dinámica. |

### B. Rendimiento / CWV — 5/10

| Check | Pts | Evidencia |
|---|---|---|
| next/image + sizes | 1/3 | Uso con `sizes` en `components/clinic-landing.tsx`; **pero `next.config.mjs:7` tiene `images.unoptimized: true`**, que desactiva toda la optimización. `components/footer.tsx:52` usa `<img>` plano. |
| Fuentes optimizadas | 2/2 | `app/layout.tsx:10-35`: 4 fuentes vía `next/font` con `display: 'swap'`. |
| Server Components editoriales | 2/3 | `app/blog/[slug]/page.tsx:15` `force-static` + ISR 24h. **Carencia:** cada artículo carga clientes: `QuizProvider`, `StickyCTA`, `TrustBox` (script externo), `BeforeAfterCarousel`. |
| Lazy/dynamic imports | 0/2 | Cero `next/dynamic` en el repo. Scripts Trustpilot/gtag son `afterInteractive` (correcto), pero componentes pesados no críticos se importan estáticamente. |

### C. Datos estructurados — 9/15

| Check | Pts | Evidencia |
|---|---|---|
| MedicalOrganization global | 1/3 | `lib/seo.ts:15-27` inyectado globalmente en `app/layout.tsx:70`. **Carencias:** sin `address`, sin nº de registro sanitario, sin `sameAs`. |
| Physician | 2/3 | `app/autores/[slug]/page.tsx:57-70` con `identifier: author.colegiado`; también en `article-layout.tsx:116`. **Carencia:** sin `sameAs` (grep en `lib/*.ts`: 0 resultados). |
| Article/MedicalWebPage | 3/3 | `app/blog/[slug]/page.tsx:156-173`: MedicalWebPage con `author`, `reviewedBy`, `datePublished`, `dateModified`, `lastReviewed`. `article-layout.tsx:135` con `reviewedBy`. |
| Drug / MedicalCondition | 0/2 | 59 posts programáticos sobre fármacos (`lib/blog.ts`, `detectDrug:5674`) **sin ningún schema Drug ni MedicalCondition**. Solo `about: MedicalEntity` genérico (`blog/[slug]/page.tsx:171`). |
| FAQPage | 2/2 | `app/blog/[slug]/page.tsx:185-193` + helper `faqSchema` en `lib/seo.ts:66-76`, sobre FAQs reales renderizadas (líneas 268-286). |
| BreadcrumbList válido | 1/2 | `blog/[slug]/page.tsx:175-183` OK. **Carencia:** no evidenciado JSON-LD de breadcrumb en `[articulo]` ni `autores` (solo UI). |

### D. E-E-A-T y entidad médica — 10/20

| Check | Pts | Evidencia |
|---|---|---|
| Sistema de autoría en todas las plantillas | 3/5 | `[articulo]`: `AuthorCard` con autor + revisor (`article-layout.tsx:195`). Blog: byline "Revisado médicamente por" (`blog/[slug]/page.tsx:226-231`) **pero un único `MEDICAL_REVIEWER` para los 59 posts y sin enlace a su página de autor**. |
| Páginas de autor completas | 3/4 | `app/autores/[slug]/page.tsx`: bio multiparágrafo, colegiado (línea 99), experiencia, artículos del autor. **Carencia:** cero enlaces externos verificables (sin sameAs/LinkedIn/Doctoralia). |
| Referencias/bibliografía | 2/3 | `components/editorial/sources-list.tsx` usado en `article-layout.tsx:221` con fuentes reales (OMS, SEEN, NICE — `lib/articles.ts:275,385,500`). **Carencia:** los 59 posts del blog no llevan bibliografía. |
| Política editorial | 0/2 | No existe ruta ni página de proceso de revisión médica (verificado en listado completo de rutas). |
| Sobre nosotros con equipo real | 0/2 | No existe `/sobre-nosotros`. Nota: la sección `Experts` fue retirada del funnel por contener médicos no reales — el problema de identidad del equipo sigue abierto. |
| Legal/privacidad/contacto/registro en footer | 2/4 | `/privacidad`, `/terminos`, `/cookies` existen. **Carencias:** `components/footer.tsx` sin registro sanitario, sin CIF/razón social, sin página de contacto. |

### E. Arquitectura e interlinking — 12/15

| Check | Pts | Evidencia |
|---|---|---|
| Hub-and-spoke | 4/5 | Pillar `/adelgazar-con-supervision-medica` (`PILLAR` en `app/sitemap.ts:14-18`) + 8 spokes en `/[articulo]` + silos ciudad/fármaco vía `BlogInternalLinks` (`blog/[slug]/page.tsx:297`). |
| Contenido relacionado | 4/4 | `getRelated()` en ambas plantillas (`blog/[slug]/page.tsx:133,300-311`; `article-layout.tsx:108,238-247`). |
| Enlazado BOFU | 3/3 | `BlogFunnel` insertado tras la 2ª sección y al cierre (`blog/[slug]/page.tsx:249,288`), `CTABlock`/`StickyCTA` en editorial, bloques `links` con anchors naturales. |
| Sin huérfanas ≤3 clics | 1/3 | **HALLAZGO CRÍTICO:** `/blog` quedó huérfano — el enlace se eliminó del navbar (`components/navbar.tsx`, `links` sin Blog) y del footer (`lib/data.ts`, columna Recursos reducida a 1 enlace). El hub del blog y sus 59 posts ya no son alcanzables desde la home. `/autores` y `/herramientas` tampoco enlazados desde navegación principal. |

### F. Capa programática — 1/10

| Check | Pts | Evidencia |
|---|---|---|
| Solo datos únicos, sin plantilla rotada | 0/4 | `lib/blog-content.ts:670-806`: pools de párrafos con spinners `{Drug}`, `{City}`, `{inn}`, `{BRAND}`, `{frequency}` rotados entre 59 páginas. Es exactamente texto plantilla rotado. |
| Noindex condicional | 0/4 | Cero lógica de indexación condicional en `lib/blog.ts` (grep `noindex|robots`: 0 resultados). Los 59 posts entran todos al sitemap con priority 0.8. |
| Diferenciación title/H1 | 1/2 | Titles/H1 difieren por fármaco+ciudad (`seoTitle` en `lib/blog.ts`), pero el cuerpo es intercambiable entre ciudades. |

### G. Preparación GEO / IA — 4/5

| Check | Pts | Evidencia |
|---|---|---|
| Bots IA permitidos | 1/2 | `app/robots.ts:19`: `userAgent: "*", allow: "/"` — permite GPTBot/Perplexity/Claude *implícitamente*, sin reglas explícitas (algunos bots priorizan reglas con su nombre). |
| Estructura extraíble | 3/3 | Respuesta directa bajo H1 (`post.excerpt`, `blog/[slug]/page.tsx:241`), tablas comparativas (`renderBlock type "table"`), FAQs con schema, `KeyTakeaways` en editorial. |

### H. Cumplimiento sanitario en rutas de conversión — 0/5

Según la regla (−2 por aparición), el resultado es muy inferior a 0; se registra 0 con las violaciones documentadas:

**`components/clinic-landing.tsx` (landing de servicio `/consulta-medica-online`):**
- L40: "Tratamiento GLP-1 personalizado…" · L41+L75: "Inyección semanal indolora…" · L57: "El tratamiento GLP-1 actúa…" · L74: "Tratamiento GLP-1 adaptado…" · L89: "…prescribe un tratamiento GLP-1" · L104/L111: pricing "Tratamiento GLP-1 + seguimiento/analíticas" · L121-122: FAQ "¿Necesito una receta previa?… él mismo emite la prescripción" · L201/204-205/223/355/373/690: titulares y CTAs "GLP-1"

**`components/weight-loss-landing.tsx` (10 funnels `/consulta-peso-*`):**
- L49: "puede prescribir tratamiento" · L86-87: "¿El médico puede recetar tratamiento? Sí…" · L192: "Prescripción si está indicada"

**`lib/data.ts` (productos/pricing usados en home):**
- L31: "Receta de tratamiento GLP‑1 si el médico lo considera necesario"

**`components/footer.tsx` (global, presente en rutas de conversión):**
- L29: "…seguimiento del peso con tratamiento GLP‑1"

*Atenuante no puntuable: todas las rutas funnel llevan `robots index:false` (verificado en los 11 `app/consulta-*/page.tsx`), pero la rúbrica evalúa el contenido, no la indexación.*

---

## 4. TOP 10 FIXES (impacto × esfuerzo)

1. **Re-enlazar `/blog` desde el footer** — `lib/data.ts` (columna Recursos). El hub con 59 posts está huérfano: sin enlace interno, el crawl y el link equity al cluster se cortan. *Esfuerzo: 1 línea.*
2. **Añadir `app/not-found.tsx`** con 404 real, enlaces al hub y navegación. *Esfuerzo: 1 archivo.*
3. **Quitar `images.unoptimized: true`** en `next.config.mjs` para reactivar la optimización de next/image (LCP en artículos con cover). *Esfuerzo: 1 línea (verificar despliegue).*
4. **Completar `organizationSchema`** (`lib/seo.ts`): `address`, `sameAs` (Trustpilot, LinkedIn, Instagram), y nº de registro sanitario cuando exista; reflejarlo también en texto visible del footer. *Impacto YMYL alto.*
5. **Noindex condicional en la capa programática** (`app/blog/[slug]/page.tsx` + `lib/blog.ts`): marcar `robots: { index: false }` para posts ciudad×fármaco con contenido mayoritariamente rotado, manteniendo indexables solo los que tengan datos únicos (precio local, farmacias, datos de ciudad). Riesgo actual: thin/doorway content en un YMIL.
6. **Limpiar rutas de conversión según la restricción regulatoria** — quitar "GLP-1", "receta/prescripción" como promesa e "inyección" de `clinic-landing.tsx`, `weight-loss-landing.tsx`, `lib/data.ts:31` y `footer.tsx:29`; mover ese contenido al blog firmado. *(Nota: decisión de negocio del cliente — actualmente elegida deliberadamente para los funnels de Ads.)*
7. **Página "Sobre nosotros" + política editorial** (`/sobre-nosotros`, `/politica-editorial`): equipo médico real e identificable y proceso de revisión. Los dos únicos ceros completos de la categoría D.
8. **Schema `Drug`/`MedicalCondition`** en los posts de fármacos: `lib/blog.ts` ya tiene `detectDrug()` (L5674) — usarlo para emitir JSON-LD Drug con `nonProprietaryName` (INN) y `prescriptionStatus`.
9. **Diversificar autoría del blog**: los 59 posts firmados por la misma persona (`MEDICAL_REVIEWER`) sin enlace a `/autores/[slug]`. Enlazar el byline a la página de autor y repartir entre los autores existentes en `lib/articles.ts`.
10. **`sameAs` en autores + reglas explícitas de bots IA**: añadir LinkedIn/Doctoralia a cada autor (Physician schema) y reglas explícitas para GPTBot/PerplexityBot/ClaudeBot/Google-Extended en `app/robots.ts`.

---

## 5. FUERA DE ALCANCE (no verificable desde el repo)

- Perfil de backlinks y autoridad de dominio
- Datos de Google Search Console (indexación real, impresiones, CTR)
- Rankings actuales y visibilidad
- Core Web Vitals de campo (CrUX) — solo se auditó configuración
- Veracidad de los números de colegiado de los autores
- Reseñas reales de Trustpilot y su volumen
- Perfiles externos de los médicos (LinkedIn, Doctoralia)
- Estado de verificación del negocio en Google (Ads / Business Profile)
- Configuración DNS, headers de servidor y redirects a nivel de hosting/Vercel

---

*Generado el 2026-07-06. Reejecutar esta auditoría tras aplicar los fixes para comparar puntuación.*
