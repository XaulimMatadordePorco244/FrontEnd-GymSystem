import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// import Treinos from './treinos.tsx'
import Students from './Students.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    {/* <Treinos/> */}
    <Students></Students>
  </StrictMode>,
)
