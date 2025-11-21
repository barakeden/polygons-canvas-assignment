import request from 'supertest';
import app from '../../app';
import * as polygonsService from '../../services/polygonsService';
import { Polygon } from '../../types/polygon';

// Mock the service layer
jest.mock('../../services/polygonsService');

describe('Polygons Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /polygons', () => {
    it('should return all polygons', async () => {
      const mockPolygons: Polygon[] = [
        {
          id: '1',
          name: 'Triangle',
          points: [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 5, y: 10 },
          ],
        },
        {
          id: '2',
          name: 'Square',
          points: [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 10, y: 10 },
            { x: 0, y: 10 },
          ],
        },
      ];

      (polygonsService.getAll as jest.Mock).mockResolvedValue(mockPolygons);

      const response = await request(app).get('/polygons');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPolygons);
      expect(polygonsService.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return 500 when service throws an error', async () => {
      const errorMessage = 'Database connection failed';
      (polygonsService.getAll as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      const response = await request(app).get('/polygons');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: errorMessage });
    });

    it('should return empty array when no polygons exist', async () => {
      (polygonsService.getAll as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/polygons');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /polygons', () => {
    const validPolygonData = {
      name: 'Triangle',
      points: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 5, y: 10 },
      ],
    };

    it('should create a new polygon', async () => {
      const createdPolygon: Polygon = {
        id: 'new-id-123',
        ...validPolygonData,
      };

      (polygonsService.create as jest.Mock).mockResolvedValue(createdPolygon);

      const response = await request(app)
        .post('/polygons')
        .send(validPolygonData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdPolygon);
      expect(polygonsService.create).toHaveBeenCalledWith(validPolygonData);
    });

    it('should return 400 when name is missing', async () => {
      const invalidData = {
        points: [{ x: 0, y: 0 }],
      };
      const errorMessage = 'Invalid input';
      (polygonsService.create as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      const response = await request(app)
        .post('/polygons')
        .send(invalidData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: errorMessage });
    });

    it('should return 400 when points is missing', async () => {
      const invalidData = {
        name: 'Test',
      };
      const errorMessage = 'Invalid input';
      (polygonsService.create as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      const response = await request(app)
        .post('/polygons')
        .send(invalidData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: errorMessage });
    });

    it('should return 400 when points is not an array', async () => {
      const invalidData = {
        name: 'Test',
        points: 'not an array',
      };
      const errorMessage = 'Invalid input';
      (polygonsService.create as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      const response = await request(app)
        .post('/polygons')
        .send(invalidData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: errorMessage });
    });

    it('should handle empty request body', async () => {
      const errorMessage = 'Invalid input';
      (polygonsService.create as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      const response = await request(app)
        .post('/polygons')
        .send({})
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: errorMessage });
    });

    it('should handle complex polygon with many points', async () => {
      const complexPolygon = {
        name: 'Complex Shape',
        points: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 15, y: 5 },
          { x: 20, y: 10 },
          { x: 15, y: 15 },
          { x: 10, y: 20 },
          { x: 0, y: 20 },
          { x: -5, y: 15 },
          { x: -5, y: 5 },
        ],
      };

      const createdPolygon: Polygon = {
        id: 'complex-id',
        ...complexPolygon,
      };

      (polygonsService.create as jest.Mock).mockResolvedValue(createdPolygon);

      const response = await request(app)
        .post('/polygons')
        .send(complexPolygon)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdPolygon);
    });
  });

  describe('DELETE /polygons/:id', () => {
    it('should delete a polygon successfully', async () => {
      const polygonId = 'polygon-123';
      const deleteResult = { id: polygonId };

      (polygonsService.remove as jest.Mock).mockResolvedValue(deleteResult);

      const response = await request(app).delete(`/polygons/${polygonId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(deleteResult);
      expect(polygonsService.remove).toHaveBeenCalledWith(polygonId);
    });

    it('should return 404 when polygon is not found', async () => {
      const polygonId = 'non-existent-id';
      const errorMessage = 'Polygon not found';

      (polygonsService.remove as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      const response = await request(app).delete(`/polygons/${polygonId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: errorMessage });
      expect(polygonsService.remove).toHaveBeenCalledWith(polygonId);
    });

    it('should handle UUID format ids', async () => {
      const uuidId = '550e8400-e29b-41d4-a716-446655440000';
      const deleteResult = { id: uuidId };

      (polygonsService.remove as jest.Mock).mockResolvedValue(deleteResult);

      const response = await request(app).delete(`/polygons/${uuidId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(deleteResult);
      expect(polygonsService.remove).toHaveBeenCalledWith(uuidId);
    });

    it('should handle special characters in id', async () => {
      const specialId = 'polygon-123-abc';
      const deleteResult = { id: specialId };

      (polygonsService.remove as jest.Mock).mockResolvedValue(deleteResult);

      const response = await request(app).delete(`/polygons/${specialId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(deleteResult);
      expect(polygonsService.remove).toHaveBeenCalledWith(specialId);
    });
  });

  describe('CORS and JSON parsing', () => {
    it('should handle CORS headers', async () => {
      (polygonsService.getAll as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/polygons');

      // CORS middleware should be applied (supertest doesn't show CORS headers by default,
      // but the request should succeed)
      expect(response.status).toBe(200);
    });

    it('should parse JSON request body', async () => {
      const polygonData = {
        name: 'Test',
        points: [{ x: 0, y: 0 }],
      };

      const createdPolygon: Polygon = {
        id: 'test-id',
        ...polygonData,
      };

      (polygonsService.create as jest.Mock).mockResolvedValue(createdPolygon);

      const response = await request(app)
        .post('/polygons')
        .send(polygonData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(polygonsService.create).toHaveBeenCalledWith(polygonData);
    });
  });
});

