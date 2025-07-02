import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './treinos.css'

function Treinos() {
  // Estado para armazenar a lista de treinos
  const [treinos, setTreinos] = useState([
    { id: 1, nome: 'Treino A', descricao: 'Peito e Tríceps', dia: 'Segunda-feira' },
    { id: 2, nome: 'Treino B', descricao: 'Costas e Bíceps', dia: 'Quarta-feira' },
    { id: 3, nome: 'Treino C', descricao: 'Pernas e Ombro', dia: 'Sexta-feira' }
  ])

  // Estado para o formulário de cadastro/edição
  const [form, setForm] = useState({
    id: null,
    nome: '',
    descricao: '',
    dia: 'Segunda-feira'
  })

  // Estado para filtro
  const [filtro, setFiltro] = useState('')

  // Estado para controlar se está editando
  const [editando, setEditando] = useState(false)

  // Função para lidar com mudanças nos inputs do formulário
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Função para cadastrar um novo treino
  const cadastrarTreino = (e) => {
    e.preventDefault()
    if (!form.nome || !form.descricao) return

    if (editando) {
      // Editar treino existente
      setTreinos(treinos.map(t => t.id === form.id ? form : t))
      setEditando(false)
    } else {
      // Adicionar novo treino
      const novoTreino = {
        ...form,
        id: Date.now() // Usa o timestamp como ID único
      }
      setTreinos([...treinos, novoTreino])
    }

    // Limpar formulário
    setForm({
      id: null,
      nome: '',
      descricao: '',
      dia: 'Segunda-feira'
    })
  }

  // Função para deletar um treino
  const deletarTreino = (id) => {
    setTreinos(treinos.filter(treino => treino.id !== id))
  }

  // Função para editar um treino
  const editarTreino = (treino) => {
    setForm(treino)
    setEditando(true)
  }

  // Filtrar treinos com base no filtro digitado
  const treinosFiltrados = treinos.filter(treino =>
    treino.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    treino.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
    treino.dia.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="treinos-container">
      <h1>Gerenciador de Treinos de Musculação</h1>
      
      {/* Formulário de cadastro/edição */}
      <form onSubmit={cadastrarTreino} className="treino-form">
        <h2>{editando ? 'Editar Treino' : 'Cadastrar Novo Treino'}</h2>
        
        <div className="form-group">
          <label>Nome do Treino:</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Dia da Semana:</label>
          <select
            name="dia"
            value={form.dia}
            onChange={handleChange}
          >
            <option value="Segunda-feira">Segunda-feira</option>
            <option value="Terça-feira">Terça-feira</option>
            <option value="Quarta-feira">Quarta-feira</option>
            <option value="Quinta-feira">Quinta-feira</option>
            <option value="Sexta-feira">Sexta-feira</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
          </select>
        </div>
        
        <button type="submit">
          {editando ? 'Salvar Edição' : 'Cadastrar Treino'}
        </button>
        
        {editando && (
          <button type="button" onClick={() => {
            setForm({
              id: null,
              nome: '',
              descricao: '',
              dia: 'Segunda-feira'
            })
            setEditando(false)
          }}>
            Cancelar Edição
          </button>
        )}
      </form>
      
      {/* Filtro de treinos */}
      <div className="filtro-container">
        <h2>Filtrar Treinos</h2>
        <input
          type="text"
          placeholder="Digite para filtrar..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>
      
      {/* Lista de treinos */}
      <div className="treinos-list">
        <h2>Treinos Cadastrados</h2>
        
        {treinosFiltrados.length === 0 ? (
          <p>Nenhum treino encontrado.</p>
        ) : (
          <ul>
            {treinosFiltrados.map(treino => (
              <li key={treino.id} className="treino-item">
                <div className="treino-info">
                  <h3>{treino.nome}</h3>
                  <p><strong>Descrição:</strong> {treino.descricao}</p>
                  <p><strong>Dia:</strong> {treino.dia}</p>
                </div>
                
                <div className="treino-actions">
                  <button onClick={() => editarTreino(treino)}>Editar</button>
                  <button onClick={() => deletarTreino(treino.id)}>Excluir</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Treinos

