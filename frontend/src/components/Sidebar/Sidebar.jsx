import { memo } from 'react';
import './Sidebar.css';
import { Controls } from '../Controls/Controls';
import { PolygonList } from '../PolygonList/PolygonList';

export const Sidebar = memo(({
  isDrawing,
  newPolygonName,
  currentPointsLength,
  polygons,
  loading,
  message,
  onStartDrawing,
  onFinishDrawing,
  onCancelDrawing,
  onDeletePolygon,
}) => {
  return (
    <div className="sidebar">
      <Controls
        isDrawing={isDrawing}
        newPolygonName={newPolygonName}
        currentPointsLength={currentPointsLength}
        loading={loading}
        message={message}
        onStartDrawing={onStartDrawing}
        onFinishDrawing={onFinishDrawing}
        onCancelDrawing={onCancelDrawing}
      />
      <PolygonList
        polygons={polygons}
        loading={loading}
        onDeletePolygon={onDeletePolygon}
      />
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

