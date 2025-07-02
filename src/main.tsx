import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
//import StudentsForm from './StudentsForm.tsx'
import Treinos from './treinos.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <StudentsForm /> */}
    <Treinos/>
  </StrictMode>,
)
