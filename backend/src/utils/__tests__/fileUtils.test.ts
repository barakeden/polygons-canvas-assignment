import fs from 'fs/promises';
import { delay, readJSON, writeJSON } from '../fileUtils';

// Mock fs/promises
jest.mock('fs/promises');

describe('fileUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('delay', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should delay for the specified milliseconds', async () => {
      const delayPromise = delay(100);
      
      // Fast-forward time
      jest.advanceTimersByTime(100);
      
      await delayPromise;
      
      // Test passes if promise resolves
      expect(true).toBe(true);
    });

    it('should default to 5000ms when no argument is provided', async () => {
      const delayPromise = delay();
      
      // Fast-forward time by 5000ms
      jest.advanceTimersByTime(5000);
      
      await delayPromise;
      
      // Test passes if promise resolves
      expect(true).toBe(true);
    });
  });

  describe('readJSON', () => {
    it('should read and parse JSON file successfully', async () => {
      const mockData = [{ id: '1', name: 'Test', points: [] }];
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      const result = await readJSON<typeof mockData>('/path/to/file.json');

      expect(fs.readFile).toHaveBeenCalledWith('/path/to/file.json', 'utf8');
      expect(result).toEqual(mockData);
    });

    it('should return empty array when file does not exist', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      const result = await readJSON<any[]>('/path/to/nonexistent.json');

      expect(result).toEqual([]);
    });

    it('should return empty array when file read fails', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      const result = await readJSON<any[]>('/path/to/file.json');

      expect(result).toEqual([]);
    });

    it('should return empty array when JSON is invalid', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('invalid json');

      const result = await readJSON<any[]>('/path/to/file.json');

      expect(result).toEqual([]);
    });

    it('should handle different data types', async () => {
      const mockData = { key: 'value', number: 42 };
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      const result = await readJSON<typeof mockData>('/path/to/file.json');

      expect(result).toEqual(mockData);
    });
  });

  describe('writeJSON', () => {
    it('should write JSON data to file with proper formatting', async () => {
      const data = [{ id: '1', name: 'Test', points: [{ x: 0, y: 0 }] }];
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await writeJSON('/path/to/file.json', data);

      expect(fs.writeFile).toHaveBeenCalledWith(
        '/path/to/file.json',
        JSON.stringify(data, null, 2)
      );
    });

    it('should handle empty arrays', async () => {
      const data: any[] = [];
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await writeJSON('/path/to/file.json', data);

      expect(fs.writeFile).toHaveBeenCalledWith(
        '/path/to/file.json',
        JSON.stringify(data, null, 2)
      );
    });

    it('should handle complex nested objects', async () => {
      const data = {
        polygons: [
          { id: '1', name: 'Triangle', points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] },
        ],
        metadata: { count: 1, version: '1.0' },
      };
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      await writeJSON('/path/to/file.json', data);

      expect(fs.writeFile).toHaveBeenCalledWith(
        '/path/to/file.json',
        JSON.stringify(data, null, 2)
      );
    });

    it('should propagate write errors', async () => {
      const data = { test: 'data' };
      const error = new Error('Write failed');
      (fs.writeFile as jest.Mock).mockRejectedValue(error);

      await expect(writeJSON('/path/to/file.json', data)).rejects.toThrow('Write failed');
    });
  });
});

