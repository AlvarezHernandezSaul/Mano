import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as cam from '@mediapipe/camera_utils';
import * as hands from '@mediapipe/hands';
import * as draw from '@mediapipe/drawing_utils';
import axios from 'axios';

const HandTracking = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [sign, setSign] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false); // Estado para controlar si la cámara está activa
  let camera;
  let handModel;

  useEffect(() => {
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
              console.error('Error while sending hand model image:', error);
            }
          }
        },
        width: 640,
        height: 480,
      });
      camera.start();
      setIsCameraActive(true); // Se marca la cámara como activa
    }

    return () => stopCamera();
  }, [isCameraActive]);

  // Función para detener la cámara y liberar recursos
  const stopCamera = () => {
    if (camera) {
      camera.stop();
      console.log('Cámara detenida');
    }
    if (handModel) {
      handModel.close();
      console.log('Modelo de manos detenido');
    }
    setIsCameraActive(false); // Cambiar el estado para indicar que la cámara está inactiva
  };

  // Exponer la función stopCamera a través de ref
  useImperativeHandle(ref, () => ({
    stopCamera,
  }));

  async function onResults(results) {
    if (!canvasRef.current || !isCameraActive) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // Dibuja las manos si son detectadas
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        draw.drawConnectors(canvasCtx, landmarks, hands.HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
        draw.drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
      }

      // Captura una imagen del canvas para enviar al backend
      const imageSrc = canvasRef.current.toDataURL('image/jpeg');
      await sendImageToBackend(imageSrc);
    } else {
      console.log('No se detectaron manos.');
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
      console.error('Error al enviar la imagen o al conectar con el backend:', error);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: '10px',
      }}
    >
      <div style={{ maxWidth: '100%' }}>
        <video ref={videoRef} style={{ display: 'none' }} />
        {isCameraActive ? (
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            style={{
              width: '100%',
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
          marginLeft: '20px',
          fontSize: '24px',
          color: 'red',
          textAlign: 'center',
          flex: '1 1 auto',
        }}
      >
        {sign ? `Letra: ${sign}` : 'Esperando predicción...'}
      </div>
    </div>
  );
});

export default HandTracking;
