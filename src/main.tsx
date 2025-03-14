
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add extensive console logs to help debug
console.log('Main script running, environment:', import.meta.env.MODE);
console.log('Base URL:', import.meta.env.BASE_URL);
console.log('Window location:', window.location.href);
console.log('Document readyState:', document.readyState);

// Wait for DOM to be fully loaded
const renderApp = () => {
  try {
    console.log("Attempting to render app...");
    const rootElement = document.getElementById("root");
    
    if (!rootElement) {
      console.error("Failed to find the root element");
      // Create a fallback element if root is missing
      const fallbackRoot = document.createElement('div');
      fallbackRoot.id = 'root';
      document.body.appendChild(fallbackRoot);
      console.log("Created fallback root element");
      createRoot(fallbackRoot).render(<App />);
    } else {
      console.log("Root element found, rendering app");
      // Clear any loading indicators
      rootElement.innerHTML = '';
      
      // Create a fresh root and render
      const root = createRoot(rootElement);
      root.render(<App />);
      console.log("App should be rendered now");
    }
  } catch (error) {
    console.error("Error rendering the app:", error);
    // Display error on page for visibility
    document.body.innerHTML = `<div style="color:red;padding:20px;">
      <h1>Error rendering app</h1>
      <pre>${error instanceof Error ? error.message : 'Unknown error'}</pre>
      <pre>${error instanceof Error && error.stack ? error.stack : ''}</pre>
    </div>`;
  }
};

// Force immediate rendering regardless of document state
console.log("Executing renderApp immediately");
renderApp();

// Also add event listener as a fallback
if (document.readyState !== 'complete') {
  window.addEventListener('load', () => {
    console.log("Window load event fired, rendering app again");
    renderApp();
  });
}
