import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { polygonsAPI } from './api';

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || 'https://picsum.photos/1920/1080';
const CANVAS_WIDTH = parseInt(import.meta.env.VITE_CANVAS_WIDTH || '1920', 10);
const CANVAS_HEIGHT = parseInt(import.meta.env.VITE_CANVAS_HEIGHT || '1080', 10);

function App() {
  const [polygons, setPolygons] = useState([]);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newPolygonName, setNewPolygonName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Fetch polygons on component mount
  useEffect(() => {
    fetchPolygons();
  }, []);

  // Redraw canvas whenever polygons or currentPoints change
  useEffect(() => {
    drawCanvas();
  }, [polygons, currentPoints]);

  const fetchPolygons = async () => {
    setLoading(true);
    setMessage('Loading polygons...');
    try {
      const data = await polygonsAPI.getAll();
      setPolygons(data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching polygons:', error);
      setMessage('Error fetching polygons: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw image if loaded
    if (img && img.complete) {
      ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Draw all saved polygons
    polygons.forEach((polygon, index) => {
      drawPolygon(ctx, polygon.points, `hsl(${index * 360 / polygons.length}, 70%, 50%)`, polygon.name);
    });

    // Draw current polygon being drawn
    if (currentPoints.length > 0) {
      drawPolygon(ctx, currentPoints, 'rgba(255, 255, 0, 0.5)', 'New Polygon', true);
    }
  };

  const drawPolygon = (ctx, points, color, label, isTemp = false) => {
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
    points.forEach((point, index) => {
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

  const handleCanvasClick = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setCurrentPoints([...currentPoints, [x, y]]);
  };

  const startDrawing = () => {
    const name = prompt('Enter polygon name:');
    if (name) {
      setNewPolygonName(name);
      setIsDrawing(true);
      setCurrentPoints([]);
      setMessage('Click on the canvas to add points. Click "Finish Drawing" when done.');
    }
  };

  const finishDrawing = async () => {
    if (currentPoints.length < 3) {
      alert('A polygon must have at least 3 points');
      return;
    }

    setLoading(true);
    setMessage('Saving polygon...');

    try {
      await polygonsAPI.create({
        name: newPolygonName,
        points: currentPoints,
      });
      setMessage('Polygon saved successfully!');
      setCurrentPoints([]);
      setIsDrawing(false);
      setNewPolygonName('');
      await fetchPolygons();
    } catch (error) {
      console.error('Error saving polygon:', error);
      setMessage('Error saving polygon: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setCurrentPoints([]);
    setNewPolygonName('');
    setMessage('');
  };

  const deletePolygon = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setLoading(true);
    setMessage(`Deleting polygon "${name}"...`);

    try {
      await polygonsAPI.delete(id);
      setMessage('Polygon deleted successfully!');
      await fetchPolygons();
    } catch (error) {
      console.error('Error deleting polygon:', error);
      setMessage('Error deleting polygon: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Polygon Manager</h1>
      </header>

      <div className="container">
        <div className="sidebar">
          <div className="controls">
            <h2>Controls</h2>
            {!isDrawing ? (
              <button onClick={startDrawing} disabled={loading} className="btn btn-primary">
                Draw New Polygon
              </button>
            ) : (
              <div className="drawing-controls">
                <p className="drawing-status">
                  Drawing: <strong>{newPolygonName}</strong>
                  <br />
                  Points: {currentPoints.length}
                </p>
                <button onClick={finishDrawing} disabled={loading || currentPoints.length < 3} className="btn btn-success">
                  Finish Drawing
                </button>
                <button onClick={cancelDrawing} disabled={loading} className="btn btn-danger">
                  Cancel
                </button>
              </div>
            )}
            {message && (
              <div className={`message ${loading ? 'loading' : ''}`}>
                {loading && <span className="spinner">⏳</span>}
                {message}
              </div>
            )}
          </div>

          <div className="polygon-list">
            <h2>Polygons ({polygons.length})</h2>
            {polygons.length === 0 ? (
              <p className="empty-message">No polygons yet. Create one!</p>
            ) : (
              <ul>
                {polygons.map((polygon, index) => (
                  <li key={polygon.id}>
                    <div className="polygon-item">
                      <span className="polygon-color" style={{ backgroundColor: `hsl(${index * 360 / polygons.length}, 70%, 50%)` }}></span>
                      <span className="polygon-name">{polygon.name}</span>
                      <span className="polygon-points">({polygon.points.length} points)</span>
                      <button
                        onClick={() => deletePolygon(polygon.id, polygon.name)}
                        disabled={loading}
                        className="btn-delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

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
      </div>
    </div>
  );
}

export default App;