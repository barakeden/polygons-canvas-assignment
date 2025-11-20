import { useState } from 'react';
import './App.css';
import { usePolygons } from './hooks/usePolygons';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Canvas } from './components/Canvas/Canvas';
import { NameInputModal } from './components/NameInputModal/NameInputModal';
import { ConfirmDialog } from './components/ConfirmDialog/ConfirmDialog';

function App() {
  const [currentPoints, setCurrentPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newPolygonName, setNewPolygonName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
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

  const startDrawing = () => setShowNameModal(true);

  const handleNameSubmit = (name) => {
    setNewPolygonName(name);
    setIsDrawing(true);
    setCurrentPoints([]);
    setMessage('Click on the canvas to add points. Click "Finish Drawing" when done.');
  };

  const finishDrawing = async () => {
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

  const handleDeletePolygon = (id, name) => {
    setDeleteTarget({ id, name });
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deletePolygon(deleteTarget.id, deleteTarget.name);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setDeleteTarget(null);
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
      <NameInputModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onSubmit={handleNameSubmit}
      />
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Polygon"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"?` : ''}
      />
    </div>
  );
}

export default App;
