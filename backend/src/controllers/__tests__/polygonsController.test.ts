import { Request, Response } from 'express';
import * as polygonsController from '../polygonsController';
import * as polygonsService from '../../services/polygonsService';
import { Polygon } from '../../types/polygon';

// Mock the service layer
jest.mock('../../services/polygonsService');

describe('PolygonsController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock response
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };

    mockRequest = {};
  });

  describe('getPolygons', () => {
    it('should return all polygons successfully', async () => {
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

      await polygonsController.getPolygons(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(polygonsService.getAll).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith(mockPolygons);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 500 error when service throws an error', async () => {
      const errorMessage = 'Database connection failed';
      (polygonsService.getAll as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await polygonsController.getPolygons(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(polygonsService.getAll).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('createPolygon', () => {
    it('should create a polygon successfully', async () => {
      const requestBody = {
        name: 'Triangle',
        points: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 5, y: 10 },
        ],
      };

      const createdPolygon: Polygon = {
        id: 'new-id',
        ...requestBody,
      };

      (polygonsService.create as jest.Mock).mockResolvedValue(createdPolygon);
      mockRequest.body = requestBody;

      await polygonsController.createPolygon(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(polygonsService.create).toHaveBeenCalledWith(requestBody);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(createdPolygon);
    });

    it('should return 400 error when service throws validation error', async () => {
      const requestBody = {
        name: '',
        points: [],
      };

      const errorMessage = 'Invalid input';
      (polygonsService.create as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );
      mockRequest.body = requestBody;

      await polygonsController.createPolygon(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(polygonsService.create).toHaveBeenCalledWith(requestBody);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should return 400 error when request body is missing', async () => {
      const errorMessage = 'Invalid input';
      (polygonsService.create as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );
      mockRequest.body = {};

      await polygonsController.createPolygon(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(polygonsService.create).toHaveBeenCalledWith({});
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('deletePolygon', () => {
    it('should delete a polygon successfully', async () => {
      const polygonId = 'polygon-123';
      const deleteResult = { id: polygonId };

      (polygonsService.remove as jest.Mock).mockResolvedValue(deleteResult);
      mockRequest.params = { id: polygonId };

      await polygonsController.deletePolygon(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(polygonsService.remove).toHaveBeenCalledWith(polygonId);
      expect(mockResponse.json).toHaveBeenCalledWith(deleteResult);
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 404 error when polygon is not found', async () => {
      const polygonId = 'non-existent-id';
      const errorMessage = 'Polygon not found';

      (polygonsService.remove as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );
      mockRequest.params = { id: polygonId };

      await polygonsController.deletePolygon(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(polygonsService.remove).toHaveBeenCalledWith(polygonId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: errorMessage });
    });

    it('should handle missing id parameter', async () => {
      const errorMessage = 'Polygon not found';

      (polygonsService.remove as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );
      mockRequest.params = {};

      await polygonsController.deletePolygon(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(polygonsService.remove).toHaveBeenCalledWith(undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});

