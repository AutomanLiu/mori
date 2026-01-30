import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ProfileProvider } from "./contexts/ProfileContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { AudioProvider } from "./contexts/AudioContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import App from "./App";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <SubscriptionProvider>
        <AudioProvider>
          <ProfileProvider>
            <App />
          </ProfileProvider>
        </AudioProvider>
      </SubscriptionProvider>
    </ErrorBoundary>
  </StrictMode>,
)
