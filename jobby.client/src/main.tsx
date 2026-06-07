import '@/App.css'
import App from '@/App.tsx'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
       <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>,
)
