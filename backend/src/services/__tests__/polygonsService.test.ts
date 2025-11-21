import { v4 as uuidv4 } from 'uuid';
import * as polygonsService from '../polygonsService';
import * as fileUtils from '../../utils/fileUtils';
import { Polygon } from '../../types/polygon';

// Mock dependencies
jest.mock('../../utils/fileUtils');
jest.mock('uuid'); 

describe('PolygonsService', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock delay to resolve immediately for faster tests
    (fileUtils.delay as jest.Mock).mockResolvedValue(undefined);
  });

  describe('getAll', () => {
    it('should return all polygons from file', async () => {
      (fileUtils.readJSON as jest.Mock).mockResolvedValue(mockPolygons);

      const result = await polygonsService.getAll();

      expect(fileUtils.delay).toHaveBeenCalledWith(5000);
      expect(fileUtils.readJSON).toHaveBeenCalled();
      expect(result).toEqual(mockPolygons);
    });

    it('should return empty array when file is empty', async () => {
      (fileUtils.readJSON as jest.Mock).mockResolvedValue([]);

      const result = await polygonsService.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    const newPolygonData = {
      name: 'Pentagon',
      points: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 12, y: 5 },
        { x: 5, y: 10 },
        { x: -2, y: 5 },
      ],
    };

    it('should create a new polygon with generated UUID', async () => {
      const mockId = 'new-uuid-123';
      (uuidv4 as jest.Mock).mockReturnValue(mockId);
      (fileUtils.readJSON as jest.Mock).mockResolvedValue([...mockPolygons]);
      (fileUtils.writeJSON as jest.Mock).mockResolvedValue(undefined);

      const result = await polygonsService.create(newPolygonData);

      expect(fileUtils.delay).toHaveBeenCalledWith(5000);
      expect(uuidv4).toHaveBeenCalled();
      expect(fileUtils.readJSON).toHaveBeenCalled();
      expect(fileUtils.writeJSON).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([
          ...mockPolygons,
          { id: mockId, ...newPolygonData },
        ])
      );
      expect(result).toEqual({
        id: mockId,
        ...newPolygonData,
      });
    });

    it('should throw error when name is missing', async () => {
      const invalidData = {
        points: [{ x: 0, y: 0 }],
      };

      await expect(polygonsService.create(invalidData)).rejects.toThrow('Invalid input');

      expect(fileUtils.readJSON).not.toHaveBeenCalled();
      expect(fileUtils.writeJSON).not.toHaveBeenCalled();
    });

    it('should throw error when name is empty string', async () => {
      const invalidData = {
        name: '',
        points: [{ x: 0, y: 0 }],
      };

      await expect(polygonsService.create(invalidData)).rejects.toThrow('Invalid input');
    });

    it('should throw error when points is missing', async () => {
      const invalidData = {
        name: 'Test',
      };

      await expect(polygonsService.create(invalidData)).rejects.toThrow('Invalid input');
    });

    it('should throw error when points is not an array', async () => {
      const invalidData = {
        name: 'Test',
        points: 'not an array',
      };

      await expect(polygonsService.create(invalidData)).rejects.toThrow('Invalid input');
    });

    it('should throw error when points is null', async () => {
      const invalidData = {
        name: 'Test',
        points: null,
      };

      await expect(polygonsService.create(invalidData)).rejects.toThrow('Invalid input');
    });

    it('should create polygon when starting with empty array', async () => {
      const mockId = 'new-uuid-456';
      (uuidv4 as jest.Mock).mockReturnValue(mockId);
      (fileUtils.readJSON as jest.Mock).mockResolvedValue([]);
      (fileUtils.writeJSON as jest.Mock).mockResolvedValue(undefined);

      const result = await polygonsService.create(newPolygonData);

      expect(result).toEqual({
        id: mockId,
        ...newPolygonData,
      });
      expect(fileUtils.writeJSON).toHaveBeenCalledWith(
        expect.any(String),
        [{ id: mockId, ...newPolygonData }]
      );
    });
  });

  describe('remove', () => {
    it('should remove polygon by id and return the id', async () => {
      const idToRemove = '1';
      (fileUtils.readJSON as jest.Mock).mockResolvedValue([...mockPolygons]);
      (fileUtils.writeJSON as jest.Mock).mockResolvedValue(undefined);

      const result = await polygonsService.remove(idToRemove);

      expect(fileUtils.delay).toHaveBeenCalledWith(5000);
      expect(fileUtils.readJSON).toHaveBeenCalled();
      expect(fileUtils.writeJSON).toHaveBeenCalledWith(
        expect.any(String),
        [mockPolygons[1]] // Should only contain the second polygon
      );
      expect(result).toEqual({ id: idToRemove });
    });

    it('should throw error when polygon id is not found', async () => {
      const nonExistentId = '999';
      (fileUtils.readJSON as jest.Mock).mockResolvedValue([...mockPolygons]);

      await expect(polygonsService.remove(nonExistentId)).rejects.toThrow('Polygon not found');

      expect(fileUtils.writeJSON).not.toHaveBeenCalled();
    });

    it('should handle empty polygons array', async () => {
      const idToRemove = '1';
      (fileUtils.readJSON as jest.Mock).mockResolvedValue([]);

      await expect(polygonsService.remove(idToRemove)).rejects.toThrow('Polygon not found');
    });

    it('should remove the correct polygon when multiple exist', async () => {
      const idToRemove = '2';
      (fileUtils.readJSON as jest.Mock).mockResolvedValue([...mockPolygons]);
      (fileUtils.writeJSON as jest.Mock).mockResolvedValue(undefined);

      const result = await polygonsService.remove(idToRemove);

      expect(result).toEqual({ id: idToRemove });
      expect(fileUtils.writeJSON).toHaveBeenCalledWith(
        expect.any(String),
        [mockPolygons[0]] // Should only contain the first polygon
      );
    });

    it('should handle removing the only polygon', async () => {
      const singlePolygon = [mockPolygons[0]];
      const idToRemove = '1';
      (fileUtils.readJSON as jest.Mock).mockResolvedValue([...singlePolygon]);
      (fileUtils.writeJSON as jest.Mock).mockResolvedValue(undefined);

      const result = await polygonsService.remove(idToRemove);

      expect(result).toEqual({ id: idToRemove });
      expect(fileUtils.writeJSON).toHaveBeenCalledWith(
        expect.any(String),
        []
      );
    });
  });
});

