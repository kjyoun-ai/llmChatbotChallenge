import { logError } from './loggerService';
import axios from 'axios';

interface LocationData {
  distance?: string;
  duration?: string;
  directions?: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface GoogleMapsGeocodeResponse {
  status: string;
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
}

export class LocationService {
  private static instance: LocationService;
  private readonly apiKey: string;
  private readonly shopAddress: string = "123 Coffee Street, Seattle, WA 98101";
  private readonly shopLocation = {
    lat: 47.6062,
    lng: -122.3321
  };

  private constructor() {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API key is not configured');
    }
    this.apiKey = apiKey;
  }

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  public async getDirections(fromAddress: string): Promise<LocationData> {
    try {
      // First, geocode the provided address
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fromAddress)}&key=${this.apiKey}`
      );

      if (!geocodeResponse.ok) {
        throw new Error('Failed to geocode address');
      }

      const geocodeData = await geocodeResponse.json();

      if (geocodeData.status !== 'OK' || !geocodeData.results[0]?.geometry?.location) {
        throw new Error('Invalid address provided');
      }

      const origin = geocodeData.results[0].geometry.location;

      // Then, get directions
      const directionsResponse = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${this.shopLocation.lat},${this.shopLocation.lng}&mode=driving&key=${this.apiKey}`
      );

      if (!directionsResponse.ok) {
        throw new Error('Failed to fetch directions');
      }

      const directionsData = await directionsResponse.json();

      if (directionsData.status !== 'OK' || !directionsData.routes[0]?.legs[0]) {
        throw new Error('Could not calculate directions');
      }

      const leg = directionsData.routes[0].legs[0];

      return {
        distance: leg.distance.text,
        duration: leg.duration.text,
        directions: this.formatDirections(leg.steps),
        address: this.shopAddress,
        latitude: this.shopLocation.lat,
        longitude: this.shopLocation.lng
      };
    } catch (error) {
      logError({
        error: error as Error,
        context: {
          service: 'LocationService',
          method: 'getDirections',
          fromAddress
        },
        timestamp: new Date()
      });
      throw error;
    }
  }

  private formatDirections(steps: any[]): string {
    return steps
      .map((step: any, index: number) => {
        const instruction = step.html_instructions
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/([a-z])([A-Z])/g, '$1 $2'); // Add space between words
        return `${index + 1}. ${instruction}`;
      })
      .join('\n');
  }

  public getShopAddress(): string {
    return this.shopAddress;
  }
}

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const STORE_ADDRESS = '4301 Rainier Ave S, Seattle, WA 98118';

export async function getLocation(): Promise<LocationData> {
  try {
    const response = await axios.get<GoogleMapsGeocodeResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(STORE_ADDRESS)}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status !== 'OK') {
      throw new Error('Failed to geocode address');
    }

    const location = response.data.results[0].geometry.location;

    return {
      address: STORE_ADDRESS,
      latitude: location.lat,
      longitude: location.lng
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'Failed to geocode address') {
      throw error;
    }
    throw new Error('Failed to fetch location data');
  }
} 