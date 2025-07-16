import { useState } from 'react'
import FormularioInstrutores from './instrutoresForm'
import ListaInstrutores from './instrutoresList'
import './instrutores.css'

type Instrutor = {
  id: number
  nome: string
  especialidade: string
  telefone: string
  email: string
}

function Instrutores() {
  const [editando, setEditando] = useState<Instrutor | undefined>()
  const [atualizar, setAtualizar] = useState(false)

  return (
    <div>
      <h2>Cadastro de Instrutores</h2>
      <FormularioInstrutores
        instrutorEditando={editando}
        aoSalvar={() => setAtualizar(true)}
        limparEdicao={() => setEditando(undefined)}
      />

      <hr />
      <h2>Lista de Instrutores</h2>
      <ListaInstrutores
        aoSelecionarInstrutor={setEditando}
        atualizarLista={atualizar}
        aoAtualizar={() => setAtualizar(false)}
      />
    </div>
  )
}

export default Instrutores
