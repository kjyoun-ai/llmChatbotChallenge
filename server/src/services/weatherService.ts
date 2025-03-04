import axios from 'axios';
import { logError } from './loggerService';

interface WeatherData {
  description: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
}

interface OpenWeatherMapResponse {
  weather: Array<{
    description: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
}

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const SEATTLE_LAT = 47.6062;
const SEATTLE_LON = -122.3321;

export async function getWeather(): Promise<WeatherData> {
  try {
    const response = await axios.get<OpenWeatherMapResponse>(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          lat: SEATTLE_LAT,
          lon: SEATTLE_LON,
          appid: OPENWEATHERMAP_API_KEY,
          units: 'imperial'
        }
      }
    );

    return {
      description: response.data.weather[0].description,
      temperature: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch weather data');
  }
}

export class WeatherService {
  private static instance: WeatherService;
  private readonly apiKey: string;
  private readonly latitude: string = "47.6062"; // Seattle's coordinates
  private readonly longitude: string = "-122.3321";

  private constructor() {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      throw new Error('OpenWeatherMap API key is not configured');
    }
    this.apiKey = apiKey;
  }

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  public async getCurrentWeather(): Promise<WeatherData> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&appid=${this.apiKey}&units=imperial`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json() as OpenWeatherMapResponse;

      return {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity
      };
    } catch (error) {
      logError({
        error: error as Error,
        context: {
          service: 'WeatherService',
          method: 'getCurrentWeather'
        },
        timestamp: new Date()
      });
      throw error;
    }
  }
} 