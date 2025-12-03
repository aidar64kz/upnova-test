import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CopilotKit } from '@copilotkit/react-core'
import 'tailwindcss/tailwind.css'
import '@copilotkit/react-ui/styles.css'
import App from 'components/App'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <CopilotKit publicApiKey="ck_pub_f6d64524a7ed63299a2beeae72c62b46">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CopilotKit>
)
