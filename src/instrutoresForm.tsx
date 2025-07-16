import { useState, useEffect } from 'react'
import './instrutores.css'

type Instrutor = {
  id?: number
  nome: string
  especialidade: string
  telefone: string
  email: string
}

type Props = {
  instrutorEditando?: Instrutor
  aoSalvar: () => void
  limparEdicao: () => void
}

function FormularioInstrutores({ instrutorEditando, aoSalvar, limparEdicao }: Props) {
  const [nome, setNome] = useState('')
  const [especialidade, setEspecialidade] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    if (instrutorEditando) {
      setNome(instrutorEditando.nome)
      setEspecialidade(instrutorEditando.especialidade)
      setTelefone(instrutorEditando.telefone)
      setEmail(instrutorEditando.email)
    }
  }, [instrutorEditando])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const instrutor: Instrutor = { nome, especialidade, telefone, email }

    try {
      const resposta = await fetch(
        instrutorEditando
          ? `http://localhost:8000/api/instrutores/${instrutorEditando.id}`
          : 'http://localhost:8000/api/instrutores',
        {
          method: instrutorEditando ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(instrutor)
        }
      )

      if (resposta.ok) {
        setMensagem('Instrutor salvo com sucesso!')
        setNome('')
        setEspecialidade('')
        setTelefone('')
        setEmail('')
        limparEdicao()
        aoSalvar()
      } else {
        setMensagem('Erro ao salvar o instrutor.')
      }
    } catch {
      setMensagem('Erro na conexão com o servidor.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Nome:</label>
      <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />

      <label>Especialidade:</label>
      <input type="text" value={especialidade} onChange={e => setEspecialidade(e.target.value)} />

      <label>Telefone:</label>
      <input type="text" value={telefone} onChange={e => setTelefone(e.target.value)} />

      <label>Email:</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

      <button type="submit">{instrutorEditando ? 'Atualizar' : 'Cadastrar'}</button>
      {instrutorEditando && (
        <button type="button" onClick={limparEdicao}>Cancelar</button>
      )}

      {mensagem && <p>{mensagem}</p>}
    </form>
  )
}

export default FormularioInstrutores
