"use client";
import styles from "./HandProcessor.module.css";
import { useEffect, useRef } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { checkStability } from "@/components/utils/frameBuffer";

export default function HandProcessor({ videoRef, onLetter }) {
  const canvasRef = useRef(null);
  const frameBufferRef = useRef([]);
  const stableSinceRef = useRef(null);

  useEffect(() => {
    if (!videoRef) return;
    let running = true;
    let handLandmarker;

    const initHandLandmarker = async (video) => {
      try {
        console.log("Inicializando HandLandmarker...");

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );

        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          },
          numHands: 1,
          runningMode: "VIDEO",
        });

        console.log("HandLandmarker cargado");

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Ajustar canvas al tamaño del video
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        const drawHandLines = (landmarks) => {
          ctx.strokeStyle = "#0091ff80";
          ctx.lineWidth = 1;
          ctx.shadowColor = "#004fcfff";
          ctx.shadowBlur = 8;

          const line = (startIdx, endIdx) => {
            const start = landmarks[startIdx];
            const end = landmarks[endIdx];
            if (!start || !end) return;
            ctx.beginPath();
            ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
            ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
            ctx.stroke();
          };

          // Conectar muñeca con bases de los dedos
          line(0, 1);
          line(0, 5);
          line(0, 9);
          line(0, 13);
          line(0, 17);

          // Conectar cada dedo
          const fingers = [
            [1, 2, 3, 4], // pulgar
            [5, 6, 7, 8], // índice
            [9, 10, 11, 12], // medio
            [13, 14, 15, 16], // anular
            [17, 18, 19, 20], // meñique
          ];

          for (const finger of fingers) {
            for (let i = 0; i < finger.length - 1; i++) {
              line(finger[i], finger[i + 1]);
            }
          }
        };

        const processFrame = async () => {
          if (!running) return;

          const videoEl = videoRef.current;
          if (!videoEl || videoEl.readyState < 2) {
            requestAnimationFrame(processFrame);
            return;
          }

          try {
            const results = await handLandmarker.detectForVideo(
              videoEl,
              Date.now()
            );

            // Fondo ligero para trail de movimiento
            ctx.fillStyle = "rgba(0,0,0,0.1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

            if (results.landmarks?.length > 0) {
              const landmarks = results.landmarks[0];
              frameBufferRef.current.push(landmarks);

              if (frameBufferRef.current.length > 6)
                frameBufferRef.current.shift();

              // Verificar estabilidad
              if (checkStability(frameBufferRef.current)) {
                if (!stableSinceRef.current) {
                  stableSinceRef.current = Date.now(); // Inicio de estabilidad
                } else if (Date.now() - stableSinceRef.current >= 2000) {
                  const imageData = canvas.toDataURL("image/png");

                  fetch("/api/identify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: imageData }),
                  })
                    .then((res) => res.json())
                    .then((data) => onLetter(data.letter))
                    .catch(console.error);

                  frameBufferRef.current = [];
                  stableSinceRef.current = null; // Reiniciar temporizador
                }
              } else {
                stableSinceRef.current = null; // Reset si deja de estar estable
              }

              // Dibujar nodos
              for (const point of landmarks) {
                ctx.beginPath();
                ctx.arc(
                  point.x * canvas.width,
                  point.y * canvas.height,
                  4,
                  4,
                  1 * Math.PI
                );
                ctx.fillStyle = "#0091ffff";
                ctx.shadowColor = "#0040c0ff";
                ctx.shadowBlur = 10;
                ctx.fill();
              }

              // Dibujar líneas conectando nodos
              drawHandLines(landmarks);
            } else {
              stableSinceRef.current = null; // Reset si no hay landmarks
            }
          } catch (err) {
            console.error("detectForVideo error:", err);
          }

          requestAnimationFrame(processFrame);
        };

        processFrame();
      } catch (error) {
        console.error("Error inicializando HandLandmarker:", error);
      }
    };

    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 2) {
      initHandLandmarker(video);
    } else {
      const handleLoaded = () => initHandLandmarker(video);
      video.addEventListener("loadeddata", handleLoaded);
      return () => video.removeEventListener("loadeddata", handleLoaded);
    }

    return () => {
      running = false;
    };
  }, [videoRef, onLetter]);

  return (
    <section className={styles.containerCam}>
      <canvas ref={canvasRef} />
    </section>
  );
}
