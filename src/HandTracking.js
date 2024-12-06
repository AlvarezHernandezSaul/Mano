import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as cam from '@mediapipe/camera_utils';
import * as hands from '@mediapipe/hands';
import * as draw from '@mediapipe/drawing_utils';
import axios from 'axios';

const HandTracking = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [sign, setSign] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false); // Manejo de tiempo entre solicitudes
  let camera;
  let handModel;

  useEffect(() => {
    // Configuración del modelo de manos
    handModel = new hands.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    handModel.setOptions({
      maxNumHands: 1, // Procesar solo una mano para mayor simplicidad
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    handModel.onResults(onResults);

    if (videoRef.current) {
      camera = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          if (isCameraActive) {
            try {
              await handModel.send({ image: videoRef.current });
            } catch (error) {
              console.error('Error al procesar la imagen:', error);
            }
          }
        },
        width: 640,
        height: 480,
      });
      camera.start();
      setIsCameraActive(true);
    }

    return () => stopCamera();
  }, [isCameraActive]);

  // Detener la cámara
  const stopCamera = () => {
    if (camera) {
      camera.stop();
      camera = null;
      console.log('Cámara detenida');
    }
    if (handModel) {
      handModel.close();
      handModel = null;
      console.log('Modelo de manos detenido');
    }
    setIsCameraActive(false);
  };

  // Exponer función stopCamera
  useImperativeHandle(ref, () => ({
    stopCamera,
  }));

  // Función para manejar los resultados de Mediapipe
  async function onResults(results) {
    if (!canvasRef.current || !isCameraActive) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    // Limpiar el canvas y dibujar el frame
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const allLandmarks = []; // Lista para almacenar landmarks de todas las manos

    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        draw.drawConnectors(canvasCtx, landmarks, hands.HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
        draw.drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

        // Extraer landmarks como [x1, y1, z1, ..., x21, y21, z21]
        const landmarksArray = landmarks.map((landmark) => [
          landmark.x,
          landmark.y,
          landmark.z,
        ]).flat();

        allLandmarks.push(landmarksArray); // Agregar landmarks de esta mano
      }

      // Enviar landmarks de todas las manos al backend
      if (allLandmarks.length > 0 && !isCooldown) {
        await sendLandmarksToBackend(allLandmarks);
      }
    }
  }


  // Enviar landmarks al backend
  async function sendLandmarksToBackend(allLandmarks) {
    try {
      setIsCooldown(true); // Inicia el cooldown

      // Enviar landmarks al backend
      const response = await axios.post('https://flask-app-40377871940.us-central1.run.app/predict', {
        landmarks: allLandmarks,
      });

      if (response.data && response.data.signs) {
        setSign(response.data.signs.join(' / ')); // Combina las letras detectadas
        console.log('Predicciones recibidas:', response.data.signs);
      } else {
        console.error('No se recibieron predicciones del backend');
      }

      // Restablece cooldown
      setTimeout(() => setIsCooldown(false), 1000);
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      setIsCooldown(false); // En caso de error, restablecer cooldown
    }
  }


  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: '10px',
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            display: isCameraActive ? 'none' : 'block',  // Mostrar el video solo cuando la cámara esté activa
            width: '100%',  // El video ocupa el 100% del ancho del contenedor
            height: '100%', // El video ocupa el 100% de la altura del contenedor
            objectFit: 'contain', // Asegura que el video mantenga su relación de aspecto
          }}
        />
        {isCameraActive ? (
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',  // El canvas ocupa el 100% del ancho del contenedor
              height: '100%', // El canvas ocupa el 100% de la altura del contenedor
              objectFit: 'contain', // Asegura que el canvas mantenga su relación de aspecto
            }}
          />
        ) : (
          <p style={{ textAlign: 'center', fontSize: '16px' }}>Cargando cámara...</p>
        )}

        {/* Texto centrado en la parte inferior del video/canvas */}
        <p
          style={{
            position: 'absolute',
            bottom: '10px', // Coloca el texto en la parte inferior
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'red',
            margin: 0,
          }}
        >
          {sign ? `Letra: ${sign}` : 'Esperando predicción...'}
        </p>
      </div>
    </div>


  );
});

export default HandTracking;
