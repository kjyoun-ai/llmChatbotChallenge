import { describe, it, expect, jest } from '@jest/globals';
import axios from 'axios';
import { getLocation } from '../../services/locationService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Location Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch location data successfully', async () => {
    const mockLocationData = {
      data: {
        status: 'OK',
        results: [{
          geometry: {
            location: {
              lat: 47.6062,
              lng: -122.3321
            }
          }
        }]
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };

    mockedAxios.get.mockResolvedValueOnce(mockLocationData);

    const result = await getLocation();

    expect(result).toEqual({
      address: '4301 Rainier Ave S, Seattle, WA 98118',
      latitude: 47.6062,
      longitude: -122.3321
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('maps.googleapis.com/maps/api/geocode/json')
    );
  });

  it('should handle API errors', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    await expect(getLocation()).rejects.toThrow('Failed to fetch location data');
  });

  it('should handle invalid status response', async () => {
    const mockErrorResponse = {
      data: {
        status: 'ZERO_RESULTS',
        results: []
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    };

    mockedAxios.get.mockResolvedValueOnce(mockErrorResponse);

    await expect(getLocation()).rejects.toThrow('Failed to geocode address');
  });
}); 