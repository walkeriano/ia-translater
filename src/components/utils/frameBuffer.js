// Función que verifica si todos los landmarks en el buffer son "similares"
// para determinar estabilidad del gesto
export function checkStability(buffer) {
  if (buffer.length < 4) return false; // mínimo 4 frames

  const threshold = 0.02; // diferencia máxima permitida

  for (let i = 1; i < buffer.length; i++) {
    const prev = buffer[i - 1];
    const curr = buffer[i];
    for (let j = 0; j < prev.length; j++) {
      const dx = Math.abs(prev[j].x - curr[j].x);
      const dy = Math.abs(prev[j].y - curr[j].y);
      const dz = Math.abs(prev[j].z - curr[j].z);
      if (dx > threshold || dy > threshold || dz > threshold) return false;
    }
  }

  return true;
}