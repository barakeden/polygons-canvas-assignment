import { useState, useCallback, useMemo } from 'react';
import './App.css';
import { usePolygons } from './hooks/usePolygons';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Canvas } from './components/Canvas/Canvas';
import { NameInputModal } from './components/NameInputModal/NameInputModal';
import { ConfirmDeleteDialog } from './components/ConfirmDeleteDialog/ConfirmDeleteDialog';

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

  const handleCanvasClick = useCallback((point) => {
    setCurrentPoints(prev => [...prev, point]);
  }, []);

  const startDrawing = useCallback(() => {
    setShowNameModal(true);
  }, []);

  const handleNameSubmit = useCallback((name) => {
    setNewPolygonName(name);
    setIsDrawing(true);
    setCurrentPoints([]);
    setMessage('Click on the canvas to add points. Click "Finish Drawing" when done.');
  }, [setMessage]);

  const finishDrawing = useCallback(async () => {
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
  }, [newPolygonName, currentPoints, createPolygon]);

  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setCurrentPoints([]);
    setNewPolygonName('');
    setMessage('');
  }, [setMessage]);

  const handleDeletePolygon = useCallback((id, name) => {
    setDeleteTarget({ id, name });
    setShowConfirmDialog(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;

    try {
      await deletePolygon(deleteTarget.id, deleteTarget.name);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, deletePolygon]);

  const handleNameModalClose = useCallback(() => {
    setShowNameModal(false);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setShowConfirmDialog(false);
    setDeleteTarget(null);
  }, []);

  const confirmMessage = useMemo(() => {
    return deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"?` : '';
  }, [deleteTarget]);

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
        onClose={handleNameModalClose}
        onSubmit={handleNameSubmit}
      />
      <ConfirmDeleteDialog
        isOpen={showConfirmDialog}
        onClose={handleDeleteDialogClose}
        onConfirm={confirmDelete}
        message={confirmMessage}
      />
    </div>
  );
}

export default App;
