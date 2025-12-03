import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import HomeButton from 'components/HomeButton'
import { CopilotSidebar } from '@copilotkit/react-ui'
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core'
import type { Todo, UserPreferences, WeatherData } from 'types/task3'
import { fetchWeather } from 'utils/weather'
import { classNames } from 'utils'
import { config } from 'config'

const TODOS_STORAGE_KEY = 'task3.todos'
const PREFERENCES_STORAGE_KEY = 'task3.preferences'
const DESTINATION_STORAGE_KEY = 'task3.destination'
const WEATHER_STORAGE_KEY = 'task3.weather'

const defaultPreferences: UserPreferences = {
  interests: [],
  avoidances: [],
  travelStyle: 'relaxed'
}

function reviveTodos(raw: unknown): Todo[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const anyItem = item as Todo
      if (typeof anyItem.title !== 'string' || typeof anyItem.id !== 'string') {
        return null
      }
      return {
        id: anyItem.id,
        title: anyItem.title,
        completed: Boolean(anyItem.completed),
        createdAt: anyItem.createdAt ? new Date(anyItem.createdAt) : new Date()
      } satisfies Todo
    })
    .filter(Boolean) as Todo[]
}

function Task3() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [destination, setDestination] = useState('')
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences>(defaultPreferences)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isFetchingWeather, setIsFetchingWeather] = useState(false)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Todos
    try {
      const rawTodos = window.localStorage.getItem(TODOS_STORAGE_KEY)
      if (rawTodos) {
        const parsed = JSON.parse(rawTodos)
        setTodos(reviveTodos(parsed))
      }
    } catch {
      // Ignore corrupted todos; start with an empty list
    }

    // User preferences
    try {
      const rawPrefs = window.localStorage.getItem(PREFERENCES_STORAGE_KEY)
      if (rawPrefs) {
        const parsedPrefs = JSON.parse(rawPrefs) as UserPreferences
        setUserPreferences({ ...defaultPreferences, ...parsedPrefs })
      }
    } catch {
      // Ignore corrupted preferences; fall back to defaults
    }

    // Destination
    try {
      const rawDestination = window.localStorage.getItem(
        DESTINATION_STORAGE_KEY
      )
      if (rawDestination) {
        setDestination(rawDestination)
      }
    } catch {
      // Ignore corrupted destination; leave unset
    }

    // Weather
    try {
      const rawWeather = window.localStorage.getItem(WEATHER_STORAGE_KEY)
      if (rawWeather) {
        const parsedWeather = JSON.parse(rawWeather) as WeatherData
        setWeatherData(parsedWeather)
      }
    } catch {
      // Ignore corrupted weather cache; user can re-fetch
    }
  }, [])

  // Persist todos
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos))
    } catch {
      // ignore
    }
  }, [todos])

  // Persist preferences
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(
        PREFERENCES_STORAGE_KEY,
        JSON.stringify(userPreferences)
      )
    } catch {
      // ignore
    }
  }, [userPreferences])

  // Persist destination
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(DESTINATION_STORAGE_KEY, destination)
    } catch {
      // ignore
    }
  }, [destination])

  // Persist weather
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (weatherData) {
        window.localStorage.setItem(
          WEATHER_STORAGE_KEY,
          JSON.stringify(weatherData)
        )
      } else {
        window.localStorage.removeItem(WEATHER_STORAGE_KEY)
      }
    } catch {
      // ignore
    }
  }, [weatherData])

  const addTodo = (title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: new Date()
    }
    setTodos((prev) => [newTodo, ...prev])
  }

  const removeTodoByTitle = (title: string) => {
    const lowered = title.toLowerCase()
    setTodos((prev) =>
      prev.filter((todo) => todo.title.toLowerCase() !== lowered)
    )
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addTodo(newTitle)
    setNewTitle('')
  }

  const handleDestinationChange = (value: string) => {
    setDestination(value)
  }

  const loadWeather = async (location: string): Promise<WeatherData | null> => {
    if (!location.trim()) return null
    setIsFetchingWeather(true)
    setWeatherError(null)
    try {
      const data = await fetchWeather(location)
      setWeatherData(data)
      return data
    } catch (error) {
      setWeatherError(error instanceof Error ? error.message : 'Unknown error')
      return null
    } finally {
      setIsFetchingWeather(false)
    }
  }

  // Copilot actions for todos and weather
  useCopilotAction({
    name: 'addTodo',
    description: 'Add a new todo item to the trip plan',
    parameters: [{ name: 'title', type: 'string' }],
    handler: async ({ title }) => {
      addTodo(title)
    }
  })

  useCopilotAction({
    name: 'removeTodo',
    description: 'Remove a todo by its title',
    parameters: [{ name: 'title', type: 'string' }],
    handler: async ({ title }) => {
      removeTodoByTitle(title)
    }
  })

  useCopilotAction({
    name: 'getWeather',
    description: 'Get current weather for a destination city',
    parameters: [{ name: 'location', type: 'string' }],
    handler: async ({ location }) => {
      handleDestinationChange(location)
      const data = await loadWeather(location)
      return data
    }
  })

  // Readable state for the AI
  useCopilotReadable({
    description: 'Current todo list for the active trip',
    value: todos
  })

  useCopilotReadable({
    description: 'User preferences for trip planning',
    value: userPreferences
  })

  useCopilotReadable({
    description: 'Current weather conditions for the active destination',
    value: weatherData
  })

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <CopilotSidebar
        defaultOpen
        clickOutsideToClose
        instructions={config.copilotKit.instructions}
        labels={{
          title: 'Trip planning copilot',
          initial:
            'Ask me to plan your trip, create todos, and adjust them based on the weather.'
        }}
      >
        <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 md:flex-row md:gap-8">
          <section className="flex-1 border-b border-neutral-800 pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-8">
            <header className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold text-neutral-50">
                  Trip todos
                </h1>
                <p className="mt-1 text-sm text-neutral-400">
                  Minimal todo list for planning your next trip.
                </p>
              </div>
              <HomeButton />
            </header>

            <form onSubmit={handleSubmit} className="mt-2 flex gap-3">
              <div className="flex-1">
                <label htmlFor="new-todo" className="sr-only">
                  Add todo
                </label>
                <input
                  id="new-todo"
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="Add a todo, e.g. Book hotel in Paris"
                  className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
              >
                Add
              </button>
            </form>

            <ul
              className="mt-6 space-y-2"
              aria-label="Todo list for the current trip"
            >
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2"
                >
                  <input
                    id={todo.id}
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="size-4 rounded border-neutral-600 bg-neutral-900 text-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                    aria-label={
                      todo.completed
                        ? `Mark ${todo.title} as incomplete`
                        : `Mark ${todo.title} as complete`
                    }
                  />
                  <span
                    className={classNames(
                      'flex-1 text-sm',
                      todo.completed
                        ? 'line-through text-neutral-500'
                        : 'text-neutral-50'
                    )}
                  >
                    {todo.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTodoByTitle(todo.title)}
                    className="text-xs font-medium text-neutral-400 underline-offset-2 hover:text-neutral-50 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                    aria-label={`Remove todo ${todo.title}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            {todos.length === 0 && (
              <p className="mt-4 text-sm text-neutral-500">
                No todos yet. Ask the copilot to create a plan for your next
                trip.
              </p>
            )}
          </section>

          <aside className="mt-8 flex w-full flex-col gap-4 md:mt-0 md:w-80">
            <section className="rounded-md border border-neutral-800 bg-neutral-900 p-4">
              <h2 className="text-sm font-semibold text-neutral-50">
                Destination &amp; weather
              </h2>
              <p className="mt-1 text-xs text-neutral-400">
                Set a city and let the copilot fetch the weather and adjust
                suggestions.
              </p>

              <div className="mt-3">
                <label
                  htmlFor="destination"
                  className="block text-xs font-medium text-neutral-400"
                >
                  Destination city
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    id="destination"
                    value={destination}
                    onChange={(event) =>
                      handleDestinationChange(event.target.value)
                    }
                    placeholder="e.g. Paris"
                    className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-50 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                  />
                  <button
                    type="button"
                    onClick={() => loadWeather(destination)}
                    disabled={isFetchingWeather || !destination.trim()}
                    className="rounded-md bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-950 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isFetchingWeather ? 'Loading' : 'Update'}
                  </button>
                </div>
              </div>

              {weatherError && (
                <p className="mt-3 text-xs text-neutral-300">{weatherError}</p>
              )}

              {weatherData && !weatherError && (
                <div className="mt-4 rounded-md border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-50">
                  <p className="font-medium">
                    {weatherData.location}{' '}
                    <span className="text-neutral-400">
                      {Math.round(weatherData.temperature)}
                      °C · {weatherData.condition}
                    </span>
                  </p>
                  <p className="mt-1 text-neutral-400">
                    The copilot uses this to suggest indoor or outdoor
                    activities.
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-md border border-neutral-800 bg-neutral-900 p-4 text-xs text-neutral-400">
              <h2 className="text-sm font-semibold text-neutral-50">
                How to use the copilot
              </h2>
              <p className="mt-2">
                Use the chat sidebar to ask for a Paris itinerary, remove museum
                visits, or add weather-safe alternatives. All actions are
                reflected in this todo list.
              </p>
            </section>
          </aside>
        </main>
      </CopilotSidebar>
    </div>
  )
}

export default Task3
