const SITE_DATA = {
  intro: {
    title: "Ciencia en el Extranjero",
    subtitle:
      "Si eres un estudiante mexicano y estás interesado en aprender mas sobre como conseguir una estancia o un verano de investigación, este es el lugar correcto para encontrar una increíble variedad de programas a los que puedes aplicar.",
    steps: [
      "En primer lugar, es importante conocer tus habilidades actuales y lo que te gustaria aprender.",
      "Una vez que hayas identificado los programas que te interesan, debes asegurarte de cumplir con los requisitos de elegibilidad y preparar una solicitud completa y detallada (CV, carta de motivos, cartas de recomendación, etc.). Incluye tus antecedentes académicos, experiencia en investigación, idiomas y cualquier otra información relevante.",
      "También es recomendable contactar a profesores o investigadores en las universidades extranjeras que te interesan para establecer un primer contacto y aumentar tus posibilidades de ser aceptado. Si la convocatoria especifica que no contactes a los profesores, bajo ninguna circunstancia lo hagas, ya que esto puede provocar el rechazo automático.",
      "Por último, debes ser proactivo en la búsqueda de financiamiento para tu estancia o verano de investigación en el extranjero. Muchas instituciones ofrecen becas y subvenciones para estudiantes internacionales, pero debes estar atento a los plazos de solicitud y cumplir con los requisitos de elegibilidad.",
    ],
    greeting: [
      "Bienvenido a mi sitio web de Ciencia en el Extranjero, actualmente soy un estudiante de posgrado en Quimica, mi pasion siempre ha sido la ciencia pero asi como todos, empezar a hacer ciencia no fue la parte mas dificil, sino encontrar en donde poder hacerla. Aqui encontraras uns coleccion de herramientas, recursos y consejos que pueden servirte para tu carrera de investigacion. No olvides que no importa cuantas veces lo tengas que intentar, sino seguir intentandolo hasta que lo logres. ",
      "Si tienes alguna pregunta o sugerencia, no dudes en contactarme a través de mi correo electrónico o también puedes encontrarme en mi perfil de LinkedIn.",
      "Gracias por visitar mi sitio web y espero que te sea útil. ¡Buena suerte en tu carrera de investigación!",
    ],
  },
  opportunities: {
    international: [
      { program: "iScholar", country: "Estados Unidos", institution: "University of Rochester", level: ["Universidad"], funding: "full", link: "https://www.sas.rochester.edu/chm/undergraduate/i-scholar.html" },
      { program: "ENLACE", country: "Estados Unidos", institution: "University of California San Diego", level: ["Preparatoria", "Universidad", "Posgrado"], funding: "partial", link: "http://resilientmaterials.ucsd.edu/ENLACE" },
      { program: "Globalink", country: "Canadá", institution: "MITACS", level: ["Universidad"], funding: "full", link: "https://www.mitacs.ca/en/programs/globalink" },
      { program: "OIST Research", country: "Japón", institution: "Okinawa Institute of Science and Technology", level: ["Universidad", "Posgrado"], funding: "full", link: "https://admissions.oist.jp/oist-research-internship-program-description" },
      { program: "ICIQ Summer Fellows", country: "España", institution: "Institute of Chemical Research of Catalonia", level: ["Universidad"], funding: "partial", link: "https://careers.iciq.org/jobs/2557776-iciq-summer-fellowship-program-call-2023" },
      { program: "Amgen Scholars", country: "Japón", institution: "AMGEN", level: ["Universidad"], funding: "full", link: "https://amgenscholars.com/" },
      { program: "SURF-CTC", country: "Estados Unidos", institution: "University of Minnesota", level: ["Universidad"], funding: "full", link: "https://cse.umn.edu/ctc/surf" },
      { program: "KAUST VSRP", country: "Arabia Saudita", institution: "King Abdullah University of Science and Technology", level: ["Universidad", "Maestría"], funding: "full", link: "https://vsrp.kaust.edu.sa/about-vsrp" },
      { program: "NIMS Internship Program", country: "Japón", institution: "National Institute for Materials Science", level: ["Universidad", "Posgrado"], funding: "partial", link: "https://www.nims.go.jp/eng/hr-development/internship.html" },
      { program: "GIP-GIST", country: "Corea", institution: "Gwangju Institute of Science and Technology", level: ["Universidad", "Maestría"], funding: "partial", link: "https://ipa.gist.ac.kr/ipa/html/sub03/030102.html" },
      { program: "MaxSIP", country: "Alemania", institution: "Instituto Max Planck", level: ["Universidad"], funding: "partial", link: "https://imprs-ls.opencampus.net/en/MaxSIP" },
      { program: "iSURE", country: "Estados Unidos", institution: "University Of Notre Dame", level: ["Universidad", "Maestría"], funding: "full", link: "https://ndi-sa.nd.edu/index.cfm?FuseAction=Programs.ViewProgramAngular&id=10096" },
      { program: "International Undergraduate Summer School", country: "Reino Unido", institution: "The John Innes Centre", level: ["Universidad"], funding: "partial", link: "https://www.jic.ac.uk/training-careers/summer-schools/international-undergraduate/" },
      { program: "SURF-Rockefeller", country: "Estados Unidos", institution: "The Rockefeller University", level: ["Universidad"], funding: "full", link: "https://surfapplication.rockefeller.edu/" },
      { program: "SFI-UCR", country: "Estados Unidos", institution: "Santa Fe Institute", level: ["Universidad"], funding: "full", link: "https://www.santafe.edu/engage/learn/programs/undergraduate-complexity-research" },
      { program: "SEP-HZDR", country: "Alemania", institution: "Helmholtz-Zentrum Dresden-Rossendorf", level: ["Universidad", "Maestría"], funding: "partial", link: "https://www.hzdr.de/db/Cms?pNid=2519" },
      { program: "EPFL School of Life Sciences SPR", country: "Suiza", institution: "Escuela Politécnica Federal de Lausana", level: ["Universidad", "Maestría"], funding: "full", link: "https://www.epfl.ch/schools/sv/education/summer-research-program/" },
      { program: "Openlab Summer Student Programme", country: "Suiza", institution: "CERN", level: ["Universidad", "Maestría"], funding: "partial", link: "https://jobs.smartrecruiters.com/CERN/743999862723511-cern-openlab-summer-student-programme-2023" },
      { program: "NCTS-TCA Summer Student Program", country: "Taiwán", institution: "NCTS", level: ["Universidad"], funding: "partial", link: "https://nctstca.github.io/events/202307-tcassp/" },
      { program: "US-Mexico Intern Program", country: "EU", institution: "CETUSA", level: ["Universidad", "Recién Graduados"], funding: "partial", link: "https://www.cetusa.org/trainee-internship-programs-3/us-mexico-intern-program/" },
      { program: "Yale Young Global Scholars (YYGS)", country: "EU", institution: "Yale University", level: ["Preparatoria"], funding: "partial", link: "https://globalscholars.yale.edu/about" },
    ],
    national: [
      { program: "Veranos UG", city: "Guanajuato", institution: "Universidad de Guanajuato", level: ["Preparatoria", "Universidad", "Posgrado"], funding: "partial", link: "https://www.ugto.mx/veranos" },
      { program: "Verano Delfín", city: "México", institution: "CONACYT", level: ["Universidad"], funding: "partial", link: "https://www.programadelfin.org.mx/" },
      { program: "Verano de la Ciencia de la Región Centro", city: "México", institution: "N/A", level: ["Universidad"], funding: "none", link: "https://www.veranoregional.org/" },
      { program: "Taller de Ciencias para Jóvenes (Campeche)", city: "Campeche", institution: "N/A", level: ["Preparatoria"], funding: "full", link: "https://www.tcjcampeche.com.mx/" },
      { program: "Taller de Ciencia Viva", city: "México", institution: "CINVESTAV", level: ["Preparatoria"], funding: "full", link: "https://www.facebook.com/cienciavivairapuato/?locale=es_LA" },
      { program: "Clubes De Ciencia Mx", city: "México", institution: "CdeCMx A.C.", level: ["Preparatoria", "Universidad"], funding: "none", link: "https://clubesdeciencia.mx/" },
    ],
  },

  blog: [
    {
      id: "como-preparar-cv",
      title: "Cómo preparar tu CV académico para aplicaciones internacionales",
      date: "2024-08-15",
      excerpt:
        "Una guía práctica sobre qué incluir en tu curriculum vitae cuando aplicas a programas de investigación en el extranjero: formato, secciones clave y errores comunes a evitar.",
      tags: ["CV", "Aplicaciones", "Consejos"],
      link: "https://github.com/Andres8ezau/CienciaEnElExtranjero",
    },
    {
      id: "carta-motivacion",
      title: "Escribir una carta de motivación efectiva",
      date: "2024-07-20",
      excerpt:
        "La carta de motivos es tu oportunidad de mostrar por qué eres el candidato ideal. Aprende a estructurarla, qué destacar y cómo personalizarla para cada programa.",
      tags: ["Carta de motivos", "Aplicaciones"],
      link: "https://github.com/Andres8ezau/CienciaEnElExtranjero",
    },
    {
      id: "contactar-profesores",
      title: "¿Cuándo y cómo contactar a profesores extranjeros?",
      date: "2024-06-10",
      excerpt:
        "Contactar a investigadores puede aumentar tus posibilidades, pero no siempre es recomendable. Te explicamos cuándo hacerlo y cómo redactar un correo profesional.",
      tags: ["Networking", "Consejos"],
      link: "https://github.com/Andres8ezau/CienciaEnElExtranjero",
    },
  ],

  resources: {
    cvTemplates: [
      { name: "FlowCV", link: "https://flowcv.com", description: "Plantillas modernas y gratuitas para CV académico." },
      { name: "Resume.io", link: "https://resume.io/", description: "Editor en línea con plantillas profesionales." },
      { name: "Canva", link: "https://www.canva.com/es_419/free/", description: "Diseños creativos y personalizables." },
    ],
    organizations: [
      {
        name: "Científico Latino",
        link: "https://www.cientificolatino.com/",
        description:
          'Ejemplos de cartas de motivación formales, CV académicos y guias para aplicar a un programa de posgrado en EU.',
      },
      {
        name: "Graduate Student Mentorship Initiative (GSMI-CL)",
        link: "https://www.cientificolatino.com/gsmi",
        description:
          "Programa de mentorías 1 a 1 para prepararte a aplicar a programas de posgrado en Estados Unidos (apertura en mayo-junio).",
      },
    ],
    files: [
      {
        name: "Ejemplo de CV académico (Andrés Pérez-Hernández)",
        type: "PDF",
        link: "https://github.com/Andres8ezau/CienciaEnElExtranjero/blob/main/Files/Perez-Hernandez-Andres-Esau-EJEMPLO-AGOSTO24.pdf",
      },
    ],
    external: [
      {
        name: "Repositorio CienciaEnElExtranjero",
        description: "Accede al repositorio original.",
        link: "https://github.com/Andres8ezau/CienciaEnElExtranjero",
      },
    ],
  },
};
