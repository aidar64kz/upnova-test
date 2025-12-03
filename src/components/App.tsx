import { Routes, Route } from 'react-router-dom'
import Home from 'components/Home'
import Task1 from 'components/Task1'
import Task2 from 'components/Task2'
import Task3 from 'components/Task3'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/task1" element={<Task1 />} />
      <Route path="/task2" element={<Task2 />} />
      <Route path="/task3" element={<Task3 />} />
    </Routes>
  )
}

export default App
