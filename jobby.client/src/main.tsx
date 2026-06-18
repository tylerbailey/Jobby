import '@/App.css'
import App from '@/App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@/providers/authProvider'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
       <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>,
)
