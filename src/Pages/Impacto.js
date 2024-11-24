import React from "react";

import '../Styles/Animation.css'

const Impacto = () => {
  const impactoData = {
    titulo: "Impacto Social",
    descripcion: `El traductor de señas tiene el potencial de transformar la vida de millones de personas sordas en todo el mundo. Según la Federación Mundial de Sordos, existen más de 70 millones de personas sordas a nivel global, y una gran parte de ellas enfrenta barreras de comunicación en su vida diaria. Este proyecto busca reducir estas barreras mediante soluciones tecnológicas accesibles y eficientes.`,

    ejemplosUso: [
      "Facilitar la comunicación en entornos médicos, permitiendo a los pacientes sordos expresar síntomas y recibir diagnósticos de manera efectiva.",
      "Mejorar la experiencia educativa en universidades y colegios al proporcionar acceso igualitario al contenido académico.",
      "Optimizar la comunicación en estaciones de transporte público para que las personas sordas puedan recibir indicaciones claras sobre rutas, horarios y cambios de última hora.",
      "Habilitar una comunicación fluida en trámites legales o administrativos, como audiencias judiciales, renovación de documentos oficiales o servicios consulares.",
      "Fomentar la interacción social en eventos como bodas, conferencias, conciertos y reuniones familiares, asegurando que nadie quede excluido.",
      "Apoyar en centros comerciales y supermercados, facilitando las consultas sobre precios, productos y promociones.",
      "Permitir la interacción en tiempo real con asistentes virtuales y chatbots, haciendo que las plataformas digitales sean accesibles para personas sordas.",
      "Proveer traducción instantánea en servicios de emergencia, como bomberos, policías y paramédicos, mejorando la respuesta ante situaciones críticas."
    ],

    aplicaciones: [
      {
        sector: "Educación",
        detalles: [
          "Traducción en tiempo real de clases en aulas físicas o virtuales.",
          "Acceso a materiales de estudio en lenguaje de señas.",
          "Integración en plataformas de aprendizaje en línea como MOOCs (Cursos Masivos Abiertos en Línea).",
          "Capacitación para profesores y personal educativo en el uso de la tecnología para apoyar a estudiantes sordos."
        ]
      },
      {
        sector: "Servicios Públicos",
        detalles: [
          "Asistencia en oficinas gubernamentales para trámites como licencias, pasaportes o registros civiles.",
          "Integración en sistemas de seguridad pública para emitir alertas y mensajes en lenguaje de señas durante emergencias.",
          "Uso en bibliotecas públicas para guiar a usuarios sordos hacia recursos y servicios específicos."
        ]
      },
      {
        sector: "Salud",
        detalles: [
          "Implementación en hospitales y clínicas para consultas médicas accesibles.",
          "Uso en telemedicina para conectar a pacientes sordos con especialistas.",
          "Capacitación del personal médico en herramientas inclusivas para la atención de pacientes con discapacidad auditiva."
        ]
      },
      {
        sector: "Atención al Cliente",
        detalles: [
          "Traducción en tiempo real en bancos y servicios financieros.",
          "Mejora de la experiencia en aerolíneas, hoteles y agencias de viajes mediante atención personalizada.",
          "Soporte inclusivo en centros de llamadas y atención virtual."
        ]
      },
      {
        sector: "Entretenimiento y Cultura",
        detalles: [
          "Traducción de obras teatrales, conciertos y películas en lenguaje de señas.",
          "Guías interactivas en museos y exposiciones culturales.",
          "Acceso inclusivo a actividades recreativas en parques temáticos y eventos deportivos."
        ]
      },
      {
        sector: "Tecnología",
        detalles: [
          "Desarrollo de aplicaciones móviles con soporte para traducción en lenguaje de señas.",
          "Integración en plataformas de videollamadas como Zoom y Microsoft Teams.",
          "Uso en redes sociales para crear contenido más accesible y universal."
        ]
      },
      {
        sector: "Transporte",
        detalles: [
          "Implementación en sistemas de metro, autobuses y aeropuertos para ofrecer información clara y accesible.",
          "Asistencia en el alquiler de vehículos o bicicletas compartidas.",
          "Uso en servicios de transporte privado como taxis o aplicaciones de movilidad."
        ]
      }
    ]
  };

  return (
    <div>
      {/* Burbujas flotantes */}
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>

      {/* Contenido principal */}
      <section
        style={{
          padding: "20px",
          borderRadius: "15px",
          marginTop: "20px",
          textAlign: "left",
          color: "white",
          width: "100%"
        }}
        className="impacto-social"
      >
        <h2 style={{ fontSize: "28px", marginBottom: "15px", paddingTop: "20px", alignItems: "center"  }} className="impacto-titulo">
          {impactoData.titulo}
        </h2>
        <p style={{ marginBottom: "15px", fontSize: "18px" }} className="impacto-descripcion">
          {impactoData.descripcion}
        </p>

        <ul
          style={{
            marginLeft: "20px",
            fontSize: "16px",
            marginBottom: "15px"
          }}
          className="impacto-lista"
        >
          {impactoData.ejemplosUso.map((ejemplo, index) => (
            <li key={index} style={{ marginBottom: "8px" }}>
              {ejemplo}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "20px" }}>
          {impactoData.aplicaciones.map((aplicacion, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>{aplicacion.sector}</h3>
              <ul>
                {aplicacion.detalles.map((detalle, idx) => (
                  <li key={idx} style={{ fontSize: "16px", marginBottom: "5px" }}>
                    {detalle}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Impacto;
