import { config } from 'config';
import type { WeatherData } from 'types/task3';

// Using WeatherAPI.com for current weather data
const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1/current.json';

function normalizeCondition(raw?: string): 'sunny' | 'rainy' | 'cloudy' {
  const value = raw?.toLowerCase() ?? '';
  if (value.includes('rain')) return 'rainy';
  if (value.includes('shower')) return 'rainy';
  if (value.includes('drizzle')) return 'rainy';
  if (value.includes('cloud')) return 'cloudy';
  if (value.includes('overcast')) return 'cloudy';
  if (value.includes('sunny') || value.includes('clear')) return 'sunny';
  // Default to cloudy when condition is unknown
  return 'cloudy';
}

export async function fetchWeather(location: string): Promise<WeatherData> {
  const apiKey = config.weather.apiKey;

  if (!apiKey) {
    throw new Error('Weather API key is not configured');
  }

  const params = new URLSearchParams({
    key: apiKey,
    q: location,
    aqi: 'no'
  });

  const response = await fetch(`${WEATHER_API_BASE_URL}?${params.toString()}`);
  let data: any;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // WeatherAPI sometimes returns HTTP 200 with an "error" field in the body
  if (!response.ok || (data && typeof data.error === 'object' && data.error)) {
    const apiMessage =
      data?.error && typeof data.error.message === 'string'
        ? data.error.message
        : undefined;
    const details = apiMessage ?? `status ${response.status}`;
    throw new Error(`Failed to fetch weather data: ${details}`);
  }

  return {
    // WeatherAPI response shape: { location: { name }, current: { temp_c, condition: { text } } }
    location: data?.location?.name ?? location,
    temperature:
      typeof data?.current?.temp_c === 'number' ? data.current.temp_c : 0,
    condition: normalizeCondition(data?.current?.condition?.text),
    forecast: []
  };
}

