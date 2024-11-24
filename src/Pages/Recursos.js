import React from "react";
import '../Styles/Recursos.css'

const Recursos = () => {
  
  return (
    <div className="recursos-aprendizaje">
       <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <h2 className="recursos-titulo">Enlaces a Recursos de Aprendizaje</h2>
      <p className="recursos-descripcion">
        Explora recursos educativos sobre la Lengua de Señas Mexicana (LSM) y otras herramientas para mejorar la comunicación y fomentar la inclusión:
      </p>
      <ul className="recursos-lista">
        <li>
          <a href="https://www.cndh.org.mx/" target="_blank" rel="noopener noreferrer">
            Comisión Nacional de los Derechos Humanos (CNDH) - Guías sobre Lengua de Señas Mexicana
          </a>
        </li>
        <li>
          <a href="https://www.gob.mx/conadis" target="_blank" rel="noopener noreferrer">
            CONADIS - Consejo Nacional para el Desarrollo y la Inclusión de las Personas con Discapacidad
          </a>
        </li>
        <li>
          <a href="https://lenguadesenas.unam.mx/" target="_blank" rel="noopener noreferrer">
            UNAM - Recursos de Lengua de Señas Mexicana
          </a>
        </li>
        <li>
          <a href="https://www.facebook.com/ManosQueHablanAC/" target="_blank" rel="noopener noreferrer">
            Manos Que Hablan A.C. - Asociación educativa y de apoyo para la comunidad sorda en México
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/results?search_query=lengua+de+señas+mexicana" target="_blank" rel="noopener noreferrer">
            YouTube - Videos educativos sobre Lengua de Señas Mexicana (LSM)
          </a>
        </li>
        <li>
          <a href="https://www.bibliotecavirtualsep.mx/" target="_blank" rel="noopener noreferrer">
            Biblioteca Virtual de la SEP - Material educativo para inclusión
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Recursos;
