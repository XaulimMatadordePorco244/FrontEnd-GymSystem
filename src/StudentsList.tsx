import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { fetchAlunos } from '../../services/alunoService';
// import { Aluno } from '../../types/aluno';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Alert
} from '@mui/material';

const AlunosList: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Menu lateral state
  const [menuAberto, setMenuAberto] = useState<boolean>(false);

  useEffect(() => {
    const carregarAlunos = async () => {
      try {
        const dados = await fetchAlunos();
        setAlunos(dados);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar lista de alunos. Tente recarregar a página.');
        setLoading(false);
        console.error('Erro:', err);
      }
    };

    carregarAlunos();
  }, []);

  const formatarData = (dataString: string): string => {
    if (!dataString) return 'Não informado';
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    };
    return new Date(dataString).toLocaleDateString('pt-BR', options);
  };

  const formatarCPF = (cpf: string): string => {
    if (!cpf) return 'Não informado';
    cpf = cpf.toString().replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <div>
      <header id="cabecalho">
        <div className="menu-toggle" onClick={toggleMenu}>&#9776;</div>
        <Typography variant="h1">GymSystem</Typography>
        <Typography variant="subtitle1">Organize sua Academia com Facilidade!</Typography>
      </header>

      <nav className={`menu-lateral ${menuAberto ? 'aberto' : ''}`}>
        <button className="close-btn" onClick={() => setMenuAberto(false)}>&times;</button>
        <ul>
          <li><a href="/">Início</a></li>
          <li><a href="/alunos">Listar Alunos</a></li>
          <li><a href="/alunos/cadastrar">Cadastrar Aluno</a></li>
          <li><a href="/alunos/filtrar">Filtrar Alunos</a></li>
        </ul>
      </nav>

      <main>
        <div id="lista-estudantes">
          <Typography variant="h2">Lista de Alunos</Typography>
          
          <TableContainer component={Paper}>
            <Table id="tabela-alunos">
              <TableHead>
                <TableRow>
                  <TableCell>CPF</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Idade</TableCell>
                  <TableCell>Plano</TableCell>
                  <TableCell>Vencimento</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody id="corpo-tabela">
                {alunos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhum aluno cadastrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  alunos.map((aluno) => (
                    <TableRow key={aluno.id}>
                      <TableCell className="cpf">{formatarCPF(aluno.cpf)}</TableCell>
                      <TableCell>{aluno.nome || 'Não informado'}</TableCell>
                      <TableCell>{aluno.idade || 'Não informado'}</TableCell>
                      <TableCell>{aluno.plano || 'Não informado'}</TableCell>
                      <TableCell>{formatarData(aluno.data_vencimento)}</TableCell>
                      <TableCell className={`status-${aluno.status?.toLowerCase() === 'ativo' ? 'ativo' : 'inativo'}`}>
                        {aluno.status || 'Não informado'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>

      <footer>
        <Typography variant="body2">&copy; 2025 GymSystem | Todos os direitos reservados</Typography>
      </footer>
    </div>
  );
};

export default AlunosList;