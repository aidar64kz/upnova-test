export const config = {
  copilotKit: {
    // CopilotKit runtime URL; defaults to CopilotKit Cloud and can be overridden via Vite env
    runtimeUrl:
      import.meta.env.VITE_COPILOT_RUNTIME_URL ?? 'https://api.copilotkit.ai',
    // High-level behavioral instructions for the trip-planning copilot
    instructions:
      'You are a trip-planning AI copilot in a chat sidebar. ' +
      "Manage the user's trip-planning todos conversationally using the available tools: " +
      'use addTodo to create todos, removeTodo to delete them, and modify todos by ' +
      'removing the old todo and then adding a new one with the updated content. ' +
      'Use the readable todo list to understand existing items, avoid duplicates, and ' +
      'resolve references like "the hotel booking todo". ' +
      'When the user mentions a destination city or asks about the weather, call ' +
      'getWeather for that location and then suggest weather-appropriate todos, such as ' +
      'packing items (e.g. umbrella, sunscreen) and indoor or outdoor activities based on the conditions.'
  },
  weather: {
    // WeatherAPI.com key (set VITE_WEATHER_API_KEY in your .env)
    apiKey: import.meta.env.VITE_WEATHER_API_KEY,
    // Provider: we now use https://www.weatherapi.com/
    provider: 'weatherapi' as const
  },
  storage: {
    type: 'localStorage' as const
  }
} as const
