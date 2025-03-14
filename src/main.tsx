
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add console log to help debug
console.log('Main script running, attempting to render app');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  createRoot(rootElement).render(<App />);
}
