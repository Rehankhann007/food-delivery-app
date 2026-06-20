import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="514243762273-54r7kcibl5mjlg3imrnpqd0b0ch9tr1p.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);