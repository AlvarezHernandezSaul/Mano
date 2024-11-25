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
  let camera;
  let handModel;

  useEffect(() => {
    // Configuración del modelo de manos
    handModel = new hands.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    handModel.setOptions({
      maxNumHands: 2,
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

  // Función para detener la cámara
  const stopCamera = () => {
    if (camera) {
      camera.stop();
      camera = null; // Libera la referencia
      console.log('Cámara detenida');
    }
    if (handModel) {
      handModel.close();
      handModel = null; // Libera la referencia
      console.log('Modelo de manos detenido');
    }
    setIsCameraActive(false);
  };
  

  // Exponer la función stopCamera
  useImperativeHandle(ref, () => ({
    stopCamera,
  }));

  // Función llamada al obtener resultados de Mediapipe
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

    // Dibujar landmarks de las manos
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        draw.drawConnectors(canvasCtx, landmarks, hands.HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
        draw.drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
      }

      // Enviar imagen procesada al backend
      const imageSrc = canvasRef.current.toDataURL('image/jpeg');
      await sendImageToBackend(imageSrc);
    }
  }

  // Función para enviar la imagen al backend
  async function sendImageToBackend(imageSrc) {
    try {
      const response = await axios.post('https://flask-app-40377871940.us-central1.run.app/predict', {
        image: imageSrc,
      });

      if (response.data && response.data.sign) {
        setSign(response.data.sign);
        console.log('Predicción recibida:', response.data.sign);
      } else {
        console.error('No se recibió predicción del backend');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
    }
  }

  return (
    <div
    style={{
      display: 'flex',
      flexDirection: 'column', // Cambiar a columna para vistas móviles
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '10px',
    }}
  >
    <div style={{ width: '100%' }}>
    <video   ref={videoRef}  autoPlay  playsInline  muted  style={{ display: 'none' }}/>
      {isCameraActive ? (
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{
            width: '90vw', 
            maxWidth: '640px', 
            height: 'auto', 
          }}
        />
      ) : (
        <p style={{ textAlign: 'center', fontSize: '16px' }}>Cargando cámara...</p>
      )}
    </div>
    <div
      style={{
        marginTop: '10px',
        fontSize: '18px', // Reducido para dispositivos más pequeños
        color: 'red',
        textAlign: 'center',
        width: '90%', // Alinea el texto en el 90% del ancho de la pantalla
      }}
    >
      {sign ? `Letra: ${sign}` : 'Esperando predicción...'}
    </div>
  </div>
  
  );
});

export default HandTracking;
