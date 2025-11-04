import { useRef, useEffect, forwardRef } from "react";

const CameraFeed = forwardRef(function CameraFeed(props, ref) {
  const localRef = useRef(null);

  useEffect(() => {
    const video = ref ? ref.current : localRef.current;
    console.log("Video ref en CameraFeed:", video);
    if (!video) return;

    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => console.error("Error al acceder a la cámara:", err));
  }, [ref]);

  return (
    <video
      ref={ref ? ref : localRef}
      style={{ display: "none" }}
      autoPlay
      muted
    />
  );
});

export default CameraFeed;