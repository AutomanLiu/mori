import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ProfileProvider } from "./contexts/ProfileContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import App from "./App";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <SubscriptionProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </SubscriptionProvider>
    </ErrorBoundary>
  </StrictMode>,
)
