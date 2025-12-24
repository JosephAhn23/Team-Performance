import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('Main.jsx loading...')

const rootElement = document.getElementById('root')

if (!rootElement) {
  document.body.innerHTML = '<div style="padding: 20px; color: red; background: white;">ERROR: Root element not found!</div>'
} else {
  try {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    console.log('App rendered successfully')
  } catch (error) {
    console.error('Error rendering app:', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; background: white; font-family: monospace;">
        <h1>Fatal Error</h1>
        <pre>${error.toString()}</pre>
        <pre>${error.stack || 'No stack trace'}</pre>
      </div>
    `
  }
}

