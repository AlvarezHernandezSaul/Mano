import React, { useState } from 'react';
import Slider from 'react-slick';
import '../Styles/Carousel.css';

// Lista de imágenes (nombres de archivos)
const imageList = [
  'A.png', 'B.png', 'C.png', 'D.png', 'E.png', 'F.png',
  'G.png', 'H.png', 'I.png', 'J.png', 'K.png', 'L.png',
  'M.png', 'N.png', 'Ñ.png', 'O.png', 'P.png', 'Q.png',
  'R.png', 'S.png', 'T.png', 'U.png', 'V.png', 'W.png',
  'X.png', 'Y.png', 'Z.png'
];

// Configuración del carrusel
const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  centerMode: true,
  centerPadding: '0',
  focusOnSelect: true,
  arrows: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        centerMode: true,
      },
    },
  ],
};

// Importar dinámicamente todas las imágenes
const importImages = () => {
  const images = {};
  imageList.forEach((imageName) => {
    images[imageName] = require(`../images/abc/${imageName}`);
  });
  return images;
};

const images = importImages();

const Carousel = () => {
  const [modalImage, setModalImage] = useState(null);

  const handleImageClick = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="carousel-container">
      <Slider {...carouselSettings}>
        {imageList.map((imageName, index) => (
          <div key={index} className="carousel-slide">
            <div className="card">
              <img
                src={images[imageName]}
                alt={imageName}
                className="carousel-image"
                onClick={() => handleImageClick(images[imageName])}
              />
            </div>
          </div>
        ))}
      </Slider>

      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img src={modalImage} alt="Ampliada" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel;
