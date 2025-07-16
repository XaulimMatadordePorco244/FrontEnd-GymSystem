import { useState, useEffect } from 'react'
import axios from 'axios'
import './treinos.css'

// Tipos de dados
interface Aluno {
  id_aluno: number
  nome: string
}

interface Instrutor {
  id_instrutor: number
  nome: string
}

interface Treino {
  id_treino: number
  nome_treino: string
  data_inicio: string
  data_fim: string | null
  id_aluno: number
  aluno_nome: string
  id_instrutor: number
  instrutor_nome: string
}

const Treinos = () => {
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [instrutores, setInstrutores] = useState<Instrutor[]>([])
  const [form, setForm] = useState({
    nome_treino: '',
    id_aluno: '',
    id_instrutor: '',
    data_inicio: '',
    data_fim: ''
  })
  const [editando, setEditando] = useState<number | null>(null)
  const [carregando, setCarregando] = useState(true)

  const API_URL = 'http://localhost:8000/api'

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [resTreinos, resAlunos, resInstrutores] = await Promise.all([
          axios.get(`${API_URL}/treinos`),
          axios.get(`${API_URL}/alunos`),
          axios.get(`${API_URL}/instrutores`)
        ])

        setTreinos(resTreinos.data)
        setAlunos(resAlunos.data)
        setInstrutores(resInstrutores.data)
      } catch (erro) {
        console.error('Erro ao buscar dados:', erro)
      } finally {
        setCarregando(false)
      }
    }

    buscarDados()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const salvarTreino = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editando) {
        await axios.put(`${API_URL}/treinos/${editando}`, form)
      } else {
        await axios.post(`${API_URL}/treinos`, form)
      }

      const res = await axios.get(`${API_URL}/treinos`)
      setTreinos(res.data)

      setForm({
        nome_treino: '',
        id_aluno: '',
        id_instrutor: '',
        data_inicio: '',
        data_fim: ''
      })
      setEditando(null)
    } catch (erro) {
      console.error('Erro ao salvar treino:', erro)
    }
  }

  const editarTreino = (id: number) => {
    const treino = treinos.find(t => t.id_treino === id)
    if (treino) {
      setForm({
        nome_treino: treino.nome_treino,
        id_aluno: String(treino.id_aluno),
        id_instrutor: String(treino.id_instrutor),
        data_inicio: treino.data_inicio,
        data_fim: treino.data_fim || ''
      })
      setEditando(id)
    }
  }

  const excluirTreino = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) {
      try {
        await axios.delete(`${API_URL}/treinos/${id}`)
        setTreinos(treinos.filter(t => t.id_treino !== id))
      } catch (erro) {
        console.error('Erro ao excluir treino:', erro)
      }
    }
  }

  if (carregando) {
    return <div className="carregando">Carregando...</div>
  }

  return (
    <div className="container">
      <h1>Gerenciador de Treinos</h1>

      <form onSubmit={salvarTreino} className="form">
        <h2>{editando ? 'Editar' : 'Adicionar'} Treino</h2>

        <input
          type="text"
          name="nome_treino"
          value={form.nome_treino}
          onChange={handleChange}
          placeholder="Nome do treino"
          required
        />

        <select
          name="id_aluno"
          value={form.id_aluno}
          onChange={handleChange}
          required
        >
          <option value="">Selecione o aluno</option>
          {alunos.map(a => (
            <option key={a.id_aluno} value={a.id_aluno}>{a.nome}</option>
          ))}
        </select>

        <select
          name="id_instrutor"
          value={form.id_instrutor}
          onChange={handleChange}
          required
        >
          <option value="">Selecione o instrutor</option>
          {instrutores.map(i => (
            <option key={i.id_instrutor} value={i.id_instrutor}>{i.nome}</option>
          ))}
        </select>

        <input
          type="date"
          name="data_inicio"
          value={form.data_inicio}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="data_fim"
          value={form.data_fim}
          onChange={handleChange}
          placeholder="Data de término (opcional)"
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

      <div className="lista">
        <h2>Treinos Cadastrados</h2>

        {treinos.length === 0 ? (
          <p>Nenhum treino cadastrado</p>
        ) : (
          <ul>
            {treinos.map(t => (
              <li key={t.id_treino}>
                <h3>{t.nome_treino}</h3>
                <p>Aluno: {t.aluno_nome}</p>
                <p>Instrutor: {t.instrutor_nome}</p>
                <p>Início: {new Date(t.data_inicio).toLocaleDateString()}</p>
                {t.data_fim && <p>Término: {new Date(t.data_fim).toLocaleDateString()}</p>}

                <button onClick={() => editarTreino(t.id_treino)}>
                  Editar
                </button>

                <button onClick={() => excluirTreino(t.id_treino)}>
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
