export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface UserPreferences {
  interests: string[]; // e.g. ['food', 'art', 'outdoor']
  avoidances: string[]; // e.g. ['crowds', 'early mornings']
  travelStyle: 'relaxed' | 'packed' | 'adventurous';
}

export interface DailyForecast {
  date: string;
  temperature: number;
  condition: 'sunny' | 'rainy' | 'cloudy';
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: 'sunny' | 'rainy' | 'cloudy';
  forecast: DailyForecast[];
}

