import './Controls.css';
import { Message } from '../Message/Message';

export const Controls = ({ 
  isDrawing, 
  newPolygonName, 
  currentPointsLength, 
  loading, 
  message,
  onStartDrawing, 
  onFinishDrawing, 
  onCancelDrawing 
}) => {
  return (
    <div className="controls">
      <h2>Controls</h2>
      {!isDrawing ? (
        <button 
          onClick={onStartDrawing} 
          disabled={loading} 
          className="btn btn-primary"
        >
          Draw New Polygon
        </button>
      ) : (
        <div className="drawing-controls">
          <p className="drawing-status">
            Drawing: <strong>{newPolygonName}</strong>
            <br />
            Points: {currentPointsLength}
          </p>
          <button 
            onClick={onFinishDrawing} 
            disabled={loading || currentPointsLength < 3} 
            className="btn btn-success"
          >
            Finish Drawing
          </button>
          <button 
            onClick={onCancelDrawing} 
            disabled={loading} 
            className="btn btn-danger"
          >
            Cancel
          </button>
        </div>
      )}
      <Message message={message} loading={loading} />
    </div>
  );
};

