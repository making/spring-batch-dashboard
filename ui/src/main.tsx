import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SWRConfig } from 'swr'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SWRConfig 
        value={{
          fetcher: (resource, init) => fetch(resource, init).then(res => res.json()),
          revalidateOnFocus: true,  // Enable revalidation when window regains focus
          revalidateIfStale: true,  // Revalidate if data is stale
          focusThrottleInterval: 1000  // Throttle focus revalidation to 1 second
        }}
      >
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </SWRConfig>
    </BrowserRouter>
  </React.StrictMode>,
)
