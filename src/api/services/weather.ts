import { api } from '../client';

interface WeatherData {
  city: string; temperature: number; humidity: number;
  description: string; icon: string; wind_speed: number;
  forecast: Array<{ date: string; temperature: number; description: string; icon: string }>;
}

const BASE = '/weather';

export const weatherApi = {
  getByCity: (cityId: string) =>
    api.get<WeatherData>(BASE, { cityId }),
};
