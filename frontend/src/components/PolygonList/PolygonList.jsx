import './PolygonList.css';
import { getPolygonColor } from '../../utils/canvasUtils';

export const PolygonList = ({ polygons, loading, onDeletePolygon }) => {
  return (
    <div className="polygon-list">
      <h2>Polygons ({polygons.length})</h2>
      {polygons.length === 0 ? (
        <p className="empty-message">No polygons yet. Create one!</p>
      ) : (
        <ul>
          {polygons.map((polygon) => (
            <li key={polygon.id}>
              <div className="polygon-item">
                <span 
                  className="polygon-color" 
                  style={{ 
                    backgroundColor: getPolygonColor(polygon.id) 
                  }}
                />
                <span className="polygon-name">{polygon.name}</span>
                <span className="polygon-points">({polygon.points.length} points)</span>
                <button
                  onClick={() => onDeletePolygon(polygon.id, polygon.name)}
                  disabled={loading}
                  className="btn-delete"
                  aria-label={`Delete ${polygon.name}`}
                  title="Delete polygon"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

