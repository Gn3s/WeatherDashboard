import React from 'react';
import { createRoot } from 'react-dom/client';
import WeatherDashboard from './WeatherDashboard';

// Suppress defaultProps warning in development
if (process.env.NODE_ENV !== 'production') {
    const originalWarn = console.warn;
    console.warn = (message, ...args) => {
        if (typeof message === 'string' && message.includes('defaultProps')) {
            return;
        }
        originalWarn(message, ...args);
    };
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<WeatherDashboard />);
