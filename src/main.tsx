import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppErrorBoundary } from './components/AppErrorBoundary.tsx'

const rootNode = document.getElementById('root')

if (!rootNode) {
  throw new Error('Missing #root container in popup HTML.')
}

window.addEventListener('error', (event) => {
  console.error('9Prompt window error:', event.error ?? event.message)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('9Prompt unhandled rejection:', event.reason)
})

createRoot(rootNode).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
)
