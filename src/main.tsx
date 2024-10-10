import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './styles.css';
import { app } from './firebaseConfig';
import { QueryClient, QueryClientProvider } from 'react-query';
import {AuthProvider} from "./context/AuthContext.tsx";
import './i18n.js'

app;

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <App />
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>,
);