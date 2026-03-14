import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Assuming you have a CSS file
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

// This ID now matches your Google Cloud Screenshot (image_418557.png)
const GOOGLE_CLIENT_ID = "251511926848-3sg3odo8s55iba20ctkir00fsot91i2m.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);