# Product Requirements Document: AI-Powered Todo App with Travel Planning

## Overview

A minimalistic todo application with an AI copilot sidebar that helps users plan trips, manage todos through natural conversation, and provides real-time weather-aware recommendations.

## Technology Stack

- **Vite** - Build tool
- **ReactJS** - UI framework
- **React Router** - Routing
- **TypeScript** - Type-safe development
- **Vitest** - Unit testing
- **Testing Library** - Component testing
- **Tailwindcss** - Styling
- **CopilotKit.ai** - AI chat interface and agent functionality

## Core Features

### 1. Todo Management (CRUD)

**Todo Structure:**

```typescript
interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}
```

**Operations:**

- **List** - Display all todos
- **Add** - Create new todo
- **Remove** - Delete todo by id
- **Edit** - Update todo title/status
- **Toggle** - Mark complete/incomplete

### 2. AI Copilot Chat Sidebar

**Layout:**

- Fixed sidebar (right or left)
- Chat interface with message history
- Input field for natural language commands
- Powered by CopilotKit.ai

**Capabilities:**

- Understand natural language requests
- Create multiple todos from single prompt
- Modify existing todos conversationally
- Remove todos by description
- Provide trip planning suggestions

**Example Interactions:**

```
User: "Help me create a todo list of what to do in Paris"
AI: Creates todos like:
  - Visit Eiffel Tower
  - Explore Louvre Museum
  - Walk along Seine River
  - Try croissants at local bakery

User: "Remove the Louvre and add Versailles instead"
AI: Updates the list accordingly
```

### 3. Real-Time Weather Integration

**Weather API:**

- Fetch current weather for trip destination
- Display temperature, conditions, forecast
- Update weather data periodically

**Weather-Aware Recommendations:**

```
AI: "I see it's raining in Paris tomorrow. I've added
     'Visit Musée d'Orsay' as an indoor activity."

AI: "It'll be sunny on Saturday - perfect for
     'Picnic at Luxembourg Gardens'!"
```

**Implementation:**

- Detect location from user's trip context
- Call weather API when location mentioned
- Store weather data in AI context
- Provide contextual suggestions based on conditions

### 4. Memory & Persistence

**AI Memory (CopilotKit):**

- Store user preferences (e.g., "I don't like museums")
- Remember past trip plans
- Recall previous conversations
- Maintain context across sessions

**Data Persistence:**

- Save todos to localStorage or database
- Persist chat history
- Save user preferences
- Enable users to return and continue planning

**User Preferences:**

```typescript
interface UserPreferences {
  interests: string[] // ['food', 'art', 'outdoor']
  avoidances: string[] // ['crowds', 'early mornings']
  travelStyle: string // 'relaxed' | 'packed' | 'adventurous'
}
```

## UI Layout

```
┌─────────────────────────────────────────────┐
│  Todo App                                   │
├──────────────────────┬──────────────────────┤
│                      │                      │
│  Todos               │  AI Copilot          │
│                      │                      │
│  □ Visit Eiffel      │  Chat messages...    │
│  □ Try croissants    │                      │
│  ☑ Book hotel        │  Weather: 18°C ☁️    │
│                      │                      │
│  + Add Todo          │  ┌──────────────┐   │
│                      │  │ Type here... │   │
│                      │  └──────────────┘   │
└──────────────────────┴──────────────────────┘
```

## CopilotKit Implementation

### Setup

```typescript
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";

// Wrap app with CopilotKit provider
<CopilotKit runtimeUrl="/api/copilotkit">
  <CopilotSidebar>
    <TodoApp />
  </CopilotSidebar>
</CopilotKit>
```

### AI Actions (CopilotKit Actions)

**Define todo actions for AI:**

```typescript
useCopilotAction({
  name: 'addTodo',
  description: 'Add a new todo item',
  parameters: [{ name: 'title', type: 'string' }],
  handler: async ({ title }) => {
    addTodo(title)
  }
})

useCopilotAction({
  name: 'removeTodo',
  description: 'Remove a todo by title or id',
  parameters: [{ name: 'title', type: 'string' }],
  handler: async ({ title }) => {
    removeTodoByTitle(title)
  }
})

useCopilotAction({
  name: 'getWeather',
  description: 'Get current weather for a location',
  parameters: [{ name: 'location', type: 'string' }],
  handler: async ({ location }) => {
    return await fetchWeather(location)
  }
})
```

### Readable State (Context for AI)

```typescript
useCopilotReadable({
  description: 'Current todo list',
  value: todos
})

useCopilotReadable({
  description: 'User preferences for trip planning',
  value: userPreferences
})

useCopilotReadable({
  description: 'Current weather conditions',
  value: weatherData
})
```

## Weather API Integration

**Recommended API:** OpenWeatherMap or WeatherAPI

**Data Structure:**

```typescript
interface WeatherData {
  location: string
  temperature: number
  condition: string // 'sunny', 'rainy', 'cloudy'
  forecast: DailyForecast[]
}
```

**Usage in AI:**

- AI calls `getWeather` action when trip location mentioned
- Weather data stored in readable state
- AI references weather in recommendations

## User Flow

### Initial Planning

1. User opens app with empty todo list
2. User opens AI sidebar
3. User: "Help me create a todo list of what to do in Paris"
4. AI fetches Paris weather
5. AI creates 5-10 relevant todos
6. AI provides weather-based suggestions

### Ongoing Management

1. User: "Add visit Sacré-Cœur"
2. AI adds the todo
3. User: "Remove anything related to museums"
4. AI removes museum-related todos
5. User: "What's the weather for Friday?"
6. AI provides forecast and adjusts recommendations

### Return Visit

1. User returns to app
2. Previous todos and chat history loaded
3. AI remembers user preferences
4. User continues planning from where they left off

## Testing Requirements

### Unit Tests

- Todo CRUD operations
- AI action handlers
- Weather data fetching
- Local storage persistence

### Integration Tests

- CopilotKit action execution
- Todo list updates from AI commands
- Weather API integration
- Memory persistence across sessions

### E2E Tests

- Full trip planning workflow
- Multi-turn conversations with AI
- Todo modifications via chat
- Return user experience

## Success Criteria

- Users can plan trips entirely through conversation
- AI accurately interprets todo operations
- Weather data influences AI recommendations
- Todos persist across sessions
- AI remembers user preferences
- Chat history maintained
- All CRUD operations work via UI and AI
- Response time under 2 seconds for AI actions

## Configuration

```typescript
const config = {
  copilotKit: {
    runtimeUrl: process.env.COPILOT_RUNTIME_URL
  },
  weather: {
    apiKey: process.env.WEATHER_API_KEY,
    provider: 'openweathermap'
  },
  storage: {
    type: 'localStorage' // or 'supabase', 'firebase'
  }
}
```

## Future Enhancements

- Multi-destination trip planning
- Collaborative todo lists
- Calendar integration
- Budget tracking
- Photo attachments for todos
- Offline mode support
