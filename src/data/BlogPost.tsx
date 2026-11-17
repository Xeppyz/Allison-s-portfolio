export type BlogPost = {
  slug: string
  date: string // YYYY-MM-DD
  imageKey: "placeholder" | "calendar" | "accounting"
  title: string
  excerpt: string
  contentHtml: string
  tags?: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "pasos-para-inscribirse-ante-la-dgi-de-nicaragua",
    date: "2024-02-01",
    imageKey: "calendar",
    title: "Pasos para inscribirse ante la DGI de Nicaragua",
    excerpt: "Guía práctica para obtener tu RUC y cumplir con tus obligaciones fiscales ante la DGI.",
    contentHtml: `
        <p>Si estás por iniciar un negocio en Nicaragua, uno de los primeros requisitos legales es inscribirte ante la Dirección General de Ingresos (DGI). Este trámite te permite obtener tu RUC (Registro Único de Contribuyente) y cumplir con tus obligaciones fiscales según lo establece el Código Tributario y la Ley de Concertación Tributaria.</p>
        <h3>Pasos principales:</h3>
        <ol>
          <li><strong>Definir el tipo de contribuyente</strong> – Persona natural o jurídica, según corresponda al negocio.</li>
          <li><strong>Reunir la documentación necesaria</strong> – Cédula de identidad, escritura de constitución inscrita; este proceso debe realizarse de forma personal; constancia de local arrendado o propio; RTN municipal.</li>
          <li><strong>Llenar el formulario de inscripción</strong> – Proporcionado en las oficinas de la DGI o disponible en línea.</li>
          <li><strong>Presentar y validar la información</strong> – Un funcionario revisa los documentos y asigna el número de RUC.</li>
          <li><strong>Obtener tu RUC y clave de acceso</strong> – Con esto podrás declarar impuestos, emitir facturas autorizadas y cumplir tus obligaciones tributarias.</li>
        </ol>
        <p>Cumplir con este paso es fundamental para que tu negocio opere legalmente en Nicaragua. En Allison Silva Taxes and Accounting acompañamos a nuestros clientes en cada etapa para garantizar un proceso correcto.</p>
      `,
    tags: ["Nicaragua", "DGI", "RUC", "Cumplimiento fiscal"],
  },
  {
    slug: "ventajas-de-automatizar-e-integrar-quickbooks",
    date: "2024-02-10",
    imageKey: "accounting",
    title: "Ventajas de automatizar e integrar QuickBooks como sistema contable",
    excerpt: "Optimiza procesos, reduce errores y asegura cumplimiento fiscal con QuickBooks Online.",
    contentHtml: `
        <p>La contabilidad manual puede ser ineficiente y propensa a errores. Con la adopción de sistemas tecnológicos como QuickBooks Online, tu empresa puede cumplir con la normativa fiscal y al mismo tiempo optimizar procesos.</p>
        <h3>Principales ventajas:</h3>
        <ul>
          <li><strong>Automatización de tareas</strong> – Registro de ingresos, egresos y conciliaciones bancarias en menor tiempo.</li>
          <li><strong>Cumplimiento fiscal</strong> – Reportes financieros organizados y alineados con obligaciones locales e internacionales.</li>
          <li><strong>Acceso en tiempo real</strong> – Información disponible desde cualquier lugar para la toma de decisiones.</li>
          <li><strong>Reducción de errores</strong> – Minimiza riesgos de omisiones y duplicidades en los registros.</li>
          <li><strong>Integración con otras herramientas</strong> – Conexión con facturación, bancos y nómina.</li>
        </ul>
        <p>En Allison Silva Taxes and Accounting ayudamos a implementar QuickBooks de forma estratégica, asegurando eficiencia y cumplimiento fiscal.</p>
      `,
    tags: ["QuickBooks", "Automatización", "Contabilidad", "Tecnología"],
  },
  {
    slug: "como-prepararse-para-las-declaraciones-anuales-ca-y-eeuu",
    date: "2024-02-20",
    imageKey: "placeholder",
    title: "Cómo prepararse para las declaraciones anuales en Centroamérica y Estados Unidos",
    excerpt: "Claves para evitar sanciones y cumplir con obligaciones en CA y EE. UU.",
    contentHtml: `
        <p>Las declaraciones anuales son una obligación establecida por las leyes fiscales en Centroamérica y en Estados Unidos. Prepararse con tiempo es la clave para evitar sanciones y garantizar el cumplimiento tributario.</p>
        <h3>Recomendaciones clave:</h3>
        <ol>
          <li><strong>Mantén registros contables organizados</strong> – Facturas, recibos y estados bancarios actualizados.</li>
          <li><strong>Identifica tus obligaciones fiscales</strong> – En CA: Impuesto sobre la Renta e IVA/ITBMS; en EE. UU.: Federal Income Tax, State Tax y Sales Tax según corresponda.</li>
          <li><strong>Revisa deducciones permitidas</strong> – Gastos operativos, depreciaciones y beneficios aplicables en cada país.</li>
          <li><strong>Usa herramientas tecnológicas</strong> – QuickBooks u otros softwares que faciliten la preparación de reportes.</li>
          <li><strong>Consulta a un experto</strong> – La normativa cambia con frecuencia y conviene tener asesoría profesional.</li>
        </ol>
        <p>En Allison Silva Taxes and Accounting apoyamos a empresas y personas a cumplir con sus obligaciones fiscales tanto a nivel local como internacional, ofreciendo seguridad y tranquilidad tributaria.</p>
      `,
    tags: ["Declaraciones anuales", "Centroamérica", "Estados Unidos", "Cumplimiento"],
  },
]

export function getAllPosts() {
  return blogPosts
}

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug)
}