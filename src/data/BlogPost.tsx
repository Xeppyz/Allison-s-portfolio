export type Locale = "es" | "en"

export type BlogPost = {
  slug: string
  date: string // YYYY-MM-DD
  imageKey: "placeholder" | "calendar" | "accounting"
  title: Record<Locale, string>
  excerpt: Record<Locale, string>
  contentHtml: Record<Locale, string>
}

export const blogPosts: BlogPost[] = [
  {
    slug: "pasos-para-inscribirse-ante-la-dgi-de-nicaragua",
    date: "09/09/2025",
    imageKey: "calendar",
    title: {
      es: "Pasos para inscribirse ante la DGI de Nicaragua",
      en: "Steps to Register with Nicaragua’s DGI",
    },
    excerpt: {
      es: "Guía práctica para obtener tu RUC y cumplir con tus obligaciones fiscales ante la DGI.",
      en: "Practical guide to obtain your RUC and meet tax obligations with the DGI.",
    },
    contentHtml: {
      es: `
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
      en: `
        <p>If you are starting a business in Nicaragua, one of the first legal requirements is registering with the Dirección General de Ingresos (DGI). This process allows you to obtain your RUC (Unique Taxpayer Registry) and comply with tax obligations as established by the Tax Code and the Tax Concertation Law.</p>
        <h3>Main steps:</h3>
        <ol>
          <li><strong>Define the taxpayer type</strong> – Individual or legal entity, depending on your business.</li>
          <li><strong>Gather the required documentation</strong> – National ID, registered Articles of Incorporation; this process must be carried out in person; proof of owned or leased premises; municipal RTN.</li>
          <li><strong>Complete the registration form</strong> – Provided at DGI offices or available online.</li>
          <li><strong>Submit and validate your information</strong> – An officer reviews documents and assigns your RUC number.</li>
          <li><strong>Obtain your RUC and access key</strong> – You’ll then be able to file taxes, issue authorized invoices, and meet tax obligations.</li>
        </ol>
        <p>Completing this step is essential for operating legally in Nicaragua. At Allison Silva Taxes and Accounting, we support clients at every stage to ensure a correct process.</p>
      `,
    },
  },
  {
    slug: "ventajas-de-automatizar-e-integrar-quickbooks",
    date: "09/09/2025",
    imageKey: "accounting",
    title: {
      es: "Ventajas de automatizar e integrar QuickBooks como sistema contable",
      en: "Benefits of Automating and Integrating QuickBooks as Your Accounting System",
    },
    excerpt: {
      es: "Optimiza procesos, reduce errores y asegura cumplimiento fiscal con QuickBooks Online.",
      en: "Optimize processes, reduce errors, and ensure tax compliance with QuickBooks Online.",
    },
    contentHtml: {
      es: `
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
      en: `
        <p>Manual accounting can be inefficient and error-prone. By adopting technology such as QuickBooks Online, your company can stay compliant while optimizing processes.</p>
        <h3>Key benefits:</h3>
        <ul>
          <li><strong>Task automation</strong> – Faster recording of income, expenses, and bank reconciliations.</li>
          <li><strong>Tax compliance</strong> – Organized financial reports aligned with local and international obligations.</li>
          <li><strong>Real-time access</strong> – Information available anywhere to support decision-making.</li>
          <li><strong>Error reduction</strong> – Minimizes risks of omissions and duplicate records.</li>
          <li><strong>Integrations</strong> – Connects with invoicing, banks, and payroll.</li>
        </ul>
        <p>At Allison Silva Taxes and Accounting, we implement QuickBooks strategically to ensure efficiency and tax compliance.</p>
      `,
    },
  },
  {
    slug: "como-prepararse-para-las-declaraciones-anuales-ca-y-eeuu",
    date: "09/09/2025",
    imageKey: "placeholder",
    title: {
      es: "Cómo prepararse para las declaraciones anuales en Centroamérica y Estados Unidos",
      en: "How to Prepare for Annual Filings in Central America and the United States",
    },
    excerpt: {
      es: "Claves para evitar sanciones y cumplir con obligaciones en CA y EE. UU.",
      en: "Key steps to avoid penalties and stay compliant in Central America and the U.S.",
    },
    contentHtml: {
      es: `
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
      en: `
        <p>Annual tax filings are required by law in both Central America and the United States. Preparing early is key to avoiding penalties and ensuring compliance.</p>
        <h3>Key recommendations:</h3>
        <ol>
          <li><strong>Keep organized accounting records</strong> – Up-to-date invoices, receipts, and bank statements.</li>
          <li><strong>Identify your tax obligations</strong> – In Central America: Income Tax and VAT/ITBMS; in the U.S.: Federal Income Tax, State Tax, and Sales Tax as applicable.</li>
          <li><strong>Review allowable deductions</strong> – Operating expenses, depreciation, and country-specific benefits.</li>
          <li><strong>Use technology tools</strong> – QuickBooks or other software to ease reporting.</li>
          <li><strong>Consult an expert</strong> – Regulations change frequently; professional advice is recommended.</li>
        </ol>
        <p>At Allison Silva Taxes and Accounting, we support businesses and individuals in meeting their tax obligations locally and internationally, providing confidence and peace of mind.</p>
      `,
    },
  },
]

export function getAllPosts() {
  return blogPosts
}

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug)
}