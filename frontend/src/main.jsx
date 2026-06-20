import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="514243762273-54r7kcibl5mjlg3imrnpqd0b0ch9tr1p.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);