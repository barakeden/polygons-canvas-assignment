import { useEffect, useRef, memo, useCallback } from 'react';
import './Canvas.css';
import { CANVAS_WIDTH, CANVAS_HEIGHT, IMAGE_URL } from '../../config/constants';
import { drawPolygon, getPolygonColor } from '../../utils/canvasUtils';

export const Canvas = memo(({ 
  polygons, 
  currentPoints, 
  isDrawing, 
  onCanvasClick 
}) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw image if loaded
    if (img && img.complete) {
      ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Draw all saved polygons
    polygons.forEach((polygon) => {
      const color = getPolygonColor(polygon.id);
      drawPolygon(ctx, polygon.points, color, polygon.name);
    });

    // Draw current polygon being drawn
    if (currentPoints.length > 0) {
      drawPolygon(ctx, currentPoints, 'rgba(255, 255, 0, 0.5)', 'New Polygon', true);
    }
  }, [polygons, currentPoints]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleCanvasClick = useCallback((e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    onCanvasClick([x, y]);
  }, [isDrawing, onCanvasClick]);

  return (
    <div className="canvas-container">
      <img
        ref={imageRef}
        src={IMAGE_URL}
        alt="Background"
        style={{ display: 'none' }}
        onLoad={drawCanvas}
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleCanvasClick}
        style={{ cursor: isDrawing ? 'crosshair' : 'default' }}
      />
    </div>
  );
});

Canvas.displayName = 'Canvas';

