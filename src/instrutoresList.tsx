import { useEffect, useState } from 'react'

type Instrutor = {
  id: number
  nome: string
  especialidade: string
  telefone: string
  email: string
}

type Props = {
  aoSelecionarInstrutor: (instrutor: Instrutor) => void
  atualizarLista: boolean
  aoAtualizar: () => void
}

function ListaInstrutores({ aoSelecionarInstrutor, atualizarLista, aoAtualizar }: Props) {
  const [instrutores, setInstrutores] = useState<Instrutor[]>([])
  const [todos, setTodos] = useState<Instrutor[]>([])
  const [mensagem, setMensagem] = useState('')
  const [filtro, setFiltro] = useState('')

  const buscarInstrutores = async () => {
    try {
      const resposta = await fetch('http://localhost:3000/instrutores')
      const dados = await resposta.json()
      setInstrutores(dados)
      setTodos(dados)
      aoAtualizar()
    } catch {
      setMensagem('Erro ao buscar instrutores.')
    }
  }

  useEffect(() => {
    buscarInstrutores()
  }, [atualizarLista])

  const deletarInstrutor = async (id: number) => {
    try {
      const resposta = await fetch(`http://localhost:3000/instrutores/${id}`, {
        method: 'DELETE'
      })

      if (resposta.ok) {
        setMensagem('Instrutor deletado com sucesso!')
        buscarInstrutores()
      } else {
        setMensagem('Erro ao deletar instrutor.')
      }
    } catch {
      setMensagem('Erro ao se conectar com o servidor.')
    }
  }

  const filtrarInstrutores = (texto: string) => {
    setFiltro(texto)
    const filtrados = todos.filter(instrutor =>
      instrutor.nome.toLowerCase().includes(texto.toLowerCase())
    )
    setInstrutores(filtrados)
  }

  return (
    <div>
      {mensagem && <p>{mensagem}</p>}

      <input
        type="text"
        placeholder="Filtrar por nome..."
        value={filtro}
        onChange={e => filtrarInstrutores(e.target.value)}
      />

      <ul>
        {instrutores.map(instrutor => (
          <li key={instrutor.id}>
            {instrutor.nome} — {instrutor.especialidade} — {instrutor.telefone} — {instrutor.email}
            <button onClick={() => aoSelecionarInstrutor(instrutor)}>Editar</button>
            <button onClick={() => deletarInstrutor(instrutor.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListaInstrutores
