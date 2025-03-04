import { describe, it, expect, jest } from '@jest/globals';
import axios from 'axios';
import { getWeather } from '../../services/weatherService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Weather Service', () => {
  const mockWeatherData = {
    data: {
      weather: [
        {
          description: 'clear sky'
        }
      ],
      main: {
        temp: 20.5
      }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {
      url: 'https://api.openweathermap.org/data/2.5/weather'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and format weather data', async () => {
    mockedAxios.get.mockResolvedValueOnce(mockWeatherData);

    const result = await getWeather();

    expect(result).toEqual({
      temperature: 21,
      description: 'clear sky'
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('api.openweathermap.org/data/2.5/weather'),
      expect.any(Object)
    );
  });

  it('should round temperature to nearest integer', async () => {
    const mockDataWithDecimal = {
      ...mockWeatherData,
      data: {
        weather: [{ description: 'cloudy' }],
        main: { temp: 15.7 }
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockDataWithDecimal);

    const result = await getWeather();

    expect(result.temperature).toBe(16);
  });

  it('should handle API errors', async () => {
    const errorMessage = 'API Error';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(getWeather()).rejects.toThrow(errorMessage);
  });
}); 