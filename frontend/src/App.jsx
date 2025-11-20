import { useState } from 'react';
import './App.css';
import { usePolygons } from './hooks/usePolygons';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Canvas } from './components/Canvas/Canvas';

function App() {
  const [currentPoints, setCurrentPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newPolygonName, setNewPolygonName] = useState('');
  
  const {
    polygons,
    loading,
    message,
    setMessage,
    createPolygon,
    deletePolygon,
  } = usePolygons();

  const handleCanvasClick = (point) => {
    setCurrentPoints([...currentPoints, point]);
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

    try {
      await createPolygon({
        name: newPolygonName,
        points: currentPoints,
      });
      setCurrentPoints([]);
      setIsDrawing(false);
      setNewPolygonName('');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setCurrentPoints([]);
    setNewPolygonName('');
    setMessage('');
  };

  const handleDeletePolygon = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deletePolygon(id, name);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Polygon Manager</h1>
      </header>

      <div className="container">
        <Sidebar
          isDrawing={isDrawing}
          newPolygonName={newPolygonName}
          currentPointsLength={currentPoints.length}
          polygons={polygons}
          loading={loading}
          message={message}
          onStartDrawing={startDrawing}
          onFinishDrawing={finishDrawing}
          onCancelDrawing={cancelDrawing}
          onDeletePolygon={handleDeletePolygon}
        />
        <Canvas
          polygons={polygons}
          currentPoints={currentPoints}
          isDrawing={isDrawing}
          onCanvasClick={handleCanvasClick}
        />
      </div>
    </div>
  );
}

export default App;
