import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Importe todos os componentes CRUD que você quer visualizar
import Alunos from './Alunos.tsx'
import Instrutores from './instrutores.tsx'
import Pagamentos from './pagamentos.tsx'
import Treinos from './treinos.tsx'

function App() {
  return (
    <div className="crud-container">
      <Alunos/>
      <Instrutores />
      <Pagamentos />
      <Treinos />
    </div>
  )
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
