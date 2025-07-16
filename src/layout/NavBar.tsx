import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">Academia</Link>
      <div className="nav-links">
        <Link to="/alunos">Alunos</Link>
        <Link to="/alunos/novo">Novo Aluno</Link>
      </div>
    </nav>
  )
}