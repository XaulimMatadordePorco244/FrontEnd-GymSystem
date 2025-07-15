import { useState } from 'react'
import './treinos.css'

// Tipos de dados
interface Aluno {
  id: number
  nome: string
}

interface Instrutor {
  id: number
  nome: string
}

interface Treino {
  id: number
  nome: string
  descricao: string
  aluno: string
  instrutor: string
  data: string
}

// Dados de exemplo
const alunosExemplo: Aluno[] = [
  { id: 1, nome: 'João' },
  { id: 2, nome: 'Maria' },
  { id: 3, nome: 'Carlos' }
]

const instrutoresExemplo: Instrutor[] = [
  { id: 1, nome: 'Prof. Silva' },
  { id: 2, nome: 'Prof. Souza' }
]

const treinosExemplo: Treino[] = [
  {
    id: 1,
    nome: 'Treino Inicial',
    descricao: 'Exercícios básicos',
    aluno: 'João',
    instrutor: 'Prof. Silva',
    data: '01/01/2023'
  }
]

const Treinos = () => {
  // Estados
  const [treinos, setTreinos] = useState<Treino[]>(treinosExemplo)
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    aluno: '',
    instrutor: '',
    data: ''
  })
  const [editando, setEditando] = useState<number | null>(null)

  // Funções
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const salvarTreino = (e: React.FormEvent) => {
    e.preventDefault()
    
    const novoTreino: Treino = {
      id: editando || treinos.length + 1,
      nome: form.nome,
      descricao: form.descricao,
      aluno: alunosExemplo.find(a => a.id === Number(form.aluno))?.nome || '',
      instrutor: instrutoresExemplo.find(i => i.id === Number(form.instrutor))?.nome || '',
      data: form.data
    }

    if (editando) {
      setTreinos(treinos.map(t => t.id === editando ? novoTreino : t))
    } else {
      setTreinos([...treinos, novoTreino])
    }

    setForm({ nome: '', descricao: '', aluno: '', instrutor: '', data: '' })
    setEditando(null)
  }

  const editarTreino = (id: number) => {
    const treino = treinos.find(t => t.id === id)
    if (treino) {
      setForm({
        nome: treino.nome,
        descricao: treino.descricao,
        aluno: alunosExemplo.find(a => a.nome === treino.aluno)?.id.toString() || '',
        instrutor: instrutoresExemplo.find(i => i.nome === treino.instrutor)?.id.toString() || '',
        data: treino.data
      })
      setEditando(id)
    }
  }

  const excluirTreino = (id: number) => {
    if (window.confirm('Tem certeza?')) {
      setTreinos(treinos.filter(t => t.id !== id))
    }
  }

  return (
    <div className="container">
      <h1>Gerenciador de Treinos</h1>
      
      {/* Formulário */}
      <form onSubmit={salvarTreino} className="form">
        <h2>{editando ? 'Editar' : 'Adicionar'} Treino</h2>
        
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome do treino"
          required
        />
        
        <input
          type="text"
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="Descrição"
        />
        
        <select
          name="aluno"
          value={form.aluno}
          onChange={handleChange}
          required
        >
          <option value="">Selecione o aluno</option>
          {alunosExemplo.map(a => (
            <option key={a.id} value={a.id}>{a.nome}</option>
          ))}
        </select>
        
        <select
          name="instrutor"
          value={form.instrutor}
          onChange={handleChange}
          required
        >
          <option value="">Selecione o instrutor</option>
          {instrutoresExemplo.map(i => (
            <option key={i.id} value={i.id}>{i.nome}</option>
          ))}
        </select>
        
        <input
          type="date"
          name="data"
          value={form.data}
          onChange={handleChange}
          required
        />
        
        <button type="submit">
          {editando ? 'Atualizar' : 'Salvar'}
        </button>
        
        {editando && (
          <button type="button" onClick={() => setEditando(null)}>
            Cancelar
          </button>
        )}
      </form>
      
      {/* Lista de treinos */}
      <div className="lista">
        <h2>Treinos Cadastrados</h2>
        
        {treinos.length === 0 ? (
          <p>Nenhum treino cadastrado</p>
        ) : (
          <ul>
            {treinos.map(t => (
              <li key={t.id}>
                <h3>{t.nome}</h3>
                <p>{t.descricao}</p>
                <p>Aluno: {t.aluno}</p>
                <p>Instrutor: {t.instrutor}</p>
                <p>Data: {t.data}</p>
                
                <button onClick={() => editarTreino(t.id)}>
                  Editar
                </button>
                
                <button onClick={() => excluirTreino(t.id)}>
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Treinos