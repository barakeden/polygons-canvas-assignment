import { memo } from 'react';
import './PolygonList.css';
import { PolygonItem } from './PolygonItem';

export const PolygonList = memo(({ polygons, loading, onDeletePolygon }) => {
  
  return (
    <div className="polygon-list">
      <div className="polygon-list-header">
        <h2>Polygons ({polygons.length})</h2>
      </div>
      {polygons.length === 0 ? (
        <p className="empty-message">No polygons yet. Create one!</p>
      ) : (
        <ul>
          {polygons.map((polygon) => (
            <PolygonItem
              key={polygon.id}
              polygon={polygon}
              loading={loading}
              onDelete={onDeletePolygon}
            />
          ))}
        </ul>
      )}
    </div>
  );
});

PolygonList.displayName = 'PolygonList';

