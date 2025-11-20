/**
 * Draws a polygon on the canvas context
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D context
 * @param {Array<[number, number]>} points - Array of [x, y] coordinate pairs
 * @param {string} color - Color in HSL or RGB format
 * @param {string} label - Label text to display on the polygon
 * @param {boolean} isTemp - Whether this is a temporary polygon (not closed)
 */
export const drawPolygon = (ctx, points, color, label, isTemp = false) => {
  if (points.length === 0) return;

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  
  if (!isTemp) {
    ctx.closePath();
  }

  // Fill polygon
  ctx.fillStyle = color.replace(')', ', 0.3)').replace('hsl', 'hsla').replace('rgb', 'rgba');
  ctx.fill();

  // Draw border
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw points
  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Draw label
  if (points.length > 0) {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.font = '16px Arial';
    const centerX = points.reduce((sum, p) => sum + p[0], 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p[1], 0) / points.length;
    ctx.strokeText(label, centerX, centerY);
    ctx.fillText(label, centerX, centerY);
  }
};

function hashUUID(uuid) {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export const getPolygonColor = (uuid) => {
  const hash = hashUUID(uuid);
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

