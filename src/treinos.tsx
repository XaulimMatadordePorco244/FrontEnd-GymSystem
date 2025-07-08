import { useCallback, useEffect, useState } from 'react'
import './treinos.css'

// URL base da sua API Fastify
const API_URL = 'http://localhost:3001';

// --- DEFINIÇÕES DE TIPO (TYPESCRIPT) ---
interface Aluno {
  id: number;
  nome: string;
}

interface Instrutor {
  id: number;
  nome: string;
}

interface Treino {
  id: number;
  nome_treino: string;
  descricao: string;
  data_inicio: string;
  data_fim: string | null;
  aluno_id: number;
  aluno_nome: string;
  instrutor_id: number;
  instrutor_nome: string;
}

// Interface para o estado do formulário
interface FormState {
  nome_treino: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  aluno_id: string;
  instrutor_id: string;
}

// Estado inicial para o formulário
const initialState: FormState = {
  nome_treino: '',
  descricao: '',
  data_inicio: '',
  data_fim: '',
  aluno_id: '',
  instrutor_id: '',
};

// --- COMPONENTE PRINCIPAL ---
const Treinos: React.FC = () => {
  // --- ESTADOS DO COMPONENTE ---
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [instrutores, setInstrutores] = useState<Instrutor[]>([]);
  const [formData, setFormData] = useState<FormState>(initialState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- FUNÇÕES DE API ---
  const fetchTreinos = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/treinos`);
      if (!response.ok) throw new Error('Falha ao buscar treinos');
      const data: Treino[] = await response.json();
      setTreinos(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const fetchDependencies = useCallback(async () => {
    try {
      // Busca alunos e instrutores em paralelo para otimização
      const [alunosRes, instrutoresRes] = await Promise.all([
        fetch(`${API_URL}/alunos`),
        fetch(`${API_URL}/instrutores`),
      ]);
      if (!alunosRes.ok || !instrutoresRes.ok) throw new Error('Falha ao buscar dados de suporte');
      
      const alunosData: Aluno[] = await alunosRes.json();
      const instrutoresData: Instrutor[] = await instrutoresRes.json();
      
      setAlunos(alunosData);
      setInstrutores(instrutoresData);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  // --- EFEITOS (LIFECYCLE) ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      await Promise.all([fetchTreinos(), fetchDependencies()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchTreinos, fetchDependencies]);

  // --- MANIPULADORES DE EVENTOS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const formatDateForInput = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  }

  const handleEdit = (treino: Treino) => {
    setEditingId(treino.id);
    setFormData({
      nome_treino: treino.nome_treino,
      descricao: treino.descricao,
      data_inicio: formatDateForInput(treino.data_inicio),
      data_fim: formatDateForInput(treino.data_fim),
      aluno_id: String(treino.aluno_id),
      instrutor_id: String(treino.instrutor_id),
    });
    window.scrollTo(0, 0); // Rola a página para o topo para ver o formulário
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) {
      try {
        const response = await fetch(`${API_URL}/treinos/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao excluir treino');
        // Atualiza a lista de treinos removendo o item excluído
        setTreinos(prev => prev.filter(t => t.id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.aluno_id || !formData.instrutor_id) {
        alert("Por favor, selecione um aluno e um instrutor.");
        return;
    }
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/treinos/${editingId}` : `${API_URL}/treinos`;
    
    const body = {
        ...formData,
        aluno_id: Number(formData.aluno_id),
        instrutor_id: Number(formData.instrutor_id),
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao salvar treino');
      }
      
      // Resetar o formulário e recarregar os dados
      handleCancel();
      await fetchTreinos();

    } catch (err: any) {
      setError(err.message);
    }
  };

  // --- RENDERIZAÇÃO ---
  if (isLoading) return <div className="p-8 text-center">Carregando...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Erro: {error}</div>;

  return (
    <div className="app-container">
      <div className="main-container">
        <header className="app-header">
          <h1 className="app-title">Gerenciamento de Treinos</h1>
          <p className="app-subtitle">Crie, edite e visualize os treinos dos alunos.</p>
        </header>

        <main>
          {/* Formulário de Criação/Edição */}
          <div className="form-card">
            <h2 className="form-title">
              {editingId ? 'Editar Treino' : 'Adicionar Novo Treino'}
            </h2>
            <form onSubmit={handleSubmit} className="workout-form">
              <div className="form-group-full">
                <label htmlFor="nome_treino" className="form-label">Nome do Treino</label>
                <input type="text" id="nome_treino" name="nome_treino" value={formData.nome_treino} onChange={handleInputChange} required className="form-input" />
              </div>
              
              <div className="form-group-full">
                <label htmlFor="descricao" className="form-label">Descrição</label>
                <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleInputChange} rows={3} className="form-input"></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="aluno_id" className="form-label">Aluno</label>
                <select id="aluno_id" name="aluno_id" value={formData.aluno_id} onChange={handleInputChange} required className="form-input">
                  <option value="" disabled>Selecione um aluno</option>
                  {alunos.map(aluno => <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="instrutor_id" className="form-label">Instrutor</label>
                <select id="instrutor_id" name="instrutor_id" value={formData.instrutor_id} onChange={handleInputChange} required className="form-input">
                  <option value="" disabled>Selecione um instrutor</option>
                  {instrutores.map(instrutor => <option key={instrutor.id} value={instrutor.id}>{instrutor.nome}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="data_inicio" className="form-label">Data de Início</label>
                <input type="date" id="data_inicio" name="data_inicio" value={formData.data_inicio} onChange={handleInputChange} required className="form-input" />
              </div>

              <div className="form-group">
                <label htmlFor="data_fim" className="form-label">Data de Fim (Opcional)</label>
                <input type="date" id="data_fim" name="data_fim" value={formData.data_fim} onChange={handleInputChange} className="form-input" />
              </div>

              <div className="form-actions">
                {editingId && (
                  <button type="button" onClick={handleCancel} className="btn btn-cancel">
                    Cancelar
                  </button>
                )}
                <button type="submit" className="btn btn-submit">
                  {editingId ? 'Atualizar Treino' : 'Salvar Treino'}
                </button>
              </div>
            </form>
          </div>

          {/* Tabela de Treinos */}
          <div className="table-card">
            <table className="workout-table">
              <thead className="table-header">
                <tr>
                  <th className="table-th">Treino</th>
                  <th className="table-th">Aluno</th>
                  <th className="table-th">Instrutor</th>
                  <th className="table-th">Período</th>
                  <th className="table-th">Ações</th>
                </tr>
              </thead>
              <tbody>
                {treinos.map(treino => (
                  <tr key={treino.id} className="table-row">
                    <td className="table-td">
                        <div className="workout-name">{treino.nome_treino}</div>
                        <div className="workout-description" style={{maxWidth: '250px'}}>{treino.descricao}</div>
                    </td>
                    <td className="table-td table-text">{treino.aluno_nome}</td>
                    <td className="table-td table-text">{treino.instrutor_nome}</td>
                    <td className="table-td table-text">
                        {formatDateForInput(treino.data_inicio)} a {formatDateForInput(treino.data_fim) || 'Atual'}
                    </td>
                    <td className="table-td">
                      <div className="action-buttons">
                        <button onClick={() => handleEdit(treino)} className="btn-edit">Editar</button>
                        <button onClick={() => handleDelete(treino.id)} className="btn-delete">Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
             {treinos.length === 0 && (
                <div className="empty-state">
                    Nenhum treino encontrado. Adicione um novo treino no formulário acima.
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};


export default Treinos

