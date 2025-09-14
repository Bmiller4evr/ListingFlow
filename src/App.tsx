import { AppWithAuth } from "./AppWithAuth";

// This is now just a wrapper that delegates to AppWithAuth
// The AuthProvider is in main.tsx
export default function App() {
  return <AppWithAuth />;
}