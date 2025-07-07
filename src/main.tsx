import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import StudentsForm from './StudentsForm.tsx'
import Treinos from './treinos.tsx'
// import Students from './Students.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <StudentsForm /> */}
    <Treinos/>
    {/* <Students></Students> */}
  </StrictMode>,
)
