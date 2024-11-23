import React, { useState, useRef, useEffect } from 'react';
import '../App.css';
import HandTracking from '../HandTracking';
import throbberLogo from '../images/ML_white-rm.png';
import '../Styles/Navbar.css';
import '../Styles/Carousel.css';
import Carousel from '../components/Carousel';

function Home() {
  const [showHandTracking, setShowHandTracking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState('user'); // 'user' = frontal, 'environment' = trasera
  const handTrackingRef = useRef(null);

  useEffect(() => {
    // Detectar si el dispositivo es móvil
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);

    // Simulación de carga
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = () => {
    setShowHandTracking(!showHandTracking);
  };

  const handleCloseModal = () => {
    if (handTrackingRef.current) {
      handTrackingRef.current.stopCamera();
    }
    setShowHandTracking(false);
  };

  const handleCameraSelection = (camera) => {
    setSelectedCamera(camera);
    // Re-inicia la cámara con la cámara seleccionada
    if (handTrackingRef.current) {
      handTrackingRef.current.switchCamera(camera);
    }
  };

  if (loading) {
    return (
      <div className="throbber-container">
        <img src={throbberLogo} alt="Loading" className="throbber-logo" />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Burbujas flotantes */}
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>
      
      <main className="main-content">
        <h1 className="app-title">Bienvenido a ManoLingua</h1>
        <Carousel />
        <p className="app-description">
          Descubre la comunicación sin barreras con nuestra tecnología de <strong>IA</strong> para traducir el lenguaje de señas en tiempo real. Al presionar el siguiente botón se activará la función para traducir las letras del lenguaje de señas Mexicano.
        </p>
        <button className="translate-button" onClick={handleButtonClick}>
          {showHandTracking ? 'Cerrar Cámara' : 'TRADUCIR'}
        </button>
      </main>

      {showHandTracking && (
        <div className="modal">
          <div className="modal-content">
            {isMobile && (
              <div className="camera-selection">
                <button
                  className={`camera-button ${selectedCamera === 'user' ? 'active' : ''}`}
                  onClick={() => handleCameraSelection('user')}
                >
                  Cámara Frontal
                </button>
                <button
                  className={`camera-button ${selectedCamera === 'environment' ? 'active' : ''}`}
                  onClick={() => handleCameraSelection('environment')}
                >
                  Cámara Trasera
                </button>
              </div>
            )}
            <button className="close-button" onClick={handleCloseModal}>
              ✖ Cerrar
            </button>
            <HandTracking ref={handTrackingRef} selectedCamera={selectedCamera} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
