import { memo, useMemo } from 'react';
import { getPolygonColor } from '../../utils/canvasUtils';
import './PolygonList.css';

export const PolygonItem = memo(({ polygon, loading, onDelete }) => {
  const color = useMemo(() => getPolygonColor(polygon.id), [polygon.id]);

  return (
    <li>
      <div className="polygon-item">
        <span 
          className="polygon-color" 
          style={{ backgroundColor: color }}
        />
        <span className="polygon-name" title={polygon.name}>
          {polygon.name}
        </span>
        <span className="polygon-points">
          ({polygon.points.length} points)
        </span>
        <button
          onClick={() => onDelete(polygon.id, polygon.name)}
          disabled={loading}
          className="btn-delete"
          aria-label={`Delete ${polygon.name}`}
          title="Delete polygon"
        >
          ×
        </button>
      </div>
    </li>
  );
});

PolygonItem.displayName = 'PolygonItem';

