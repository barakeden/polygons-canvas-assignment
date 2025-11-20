import { useState, useEffect } from 'react';
import { polygonsAPI } from '../services/api';

export const usePolygons = () => {
  const [polygons, setPolygons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const createPolygon = async (polygonData) => {
    setLoading(true);
    setMessage('Saving polygon...');
    try {
      await polygonsAPI.create(polygonData);
      setMessage('Polygon saved successfully!');
      await fetchPolygons();
    } catch (error) {
      console.error('Error saving polygon:', error);
      setMessage('Error saving polygon: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePolygon = async (id, name) => {
    setLoading(true);
    setMessage(`Deleting polygon "${name}"...`);
    try {
      await polygonsAPI.delete(id);
      setMessage('Polygon deleted successfully!');
      await fetchPolygons();
    } catch (error) {
      console.error('Error deleting polygon:', error);
      setMessage('Error deleting polygon: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolygons();
  }, []);

  return {
    polygons,
    loading,
    message,
    setMessage,
    fetchPolygons,
    createPolygon,
    deletePolygon,
  };
};

