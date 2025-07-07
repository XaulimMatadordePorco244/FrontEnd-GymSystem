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
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Gerenciamento de Treinos</h1>
          <p className="text-gray-600">Crie, edite e visualize os treinos dos alunos.</p>
        </header>

        <main>
          {/* Formulário de Criação/Edição */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              {editingId ? 'Editar Treino' : 'Adicionar Novo Treino'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="nome_treino" className="block text-sm font-medium text-gray-700 mb-1">Nome do Treino</label>
                <input type="text" id="nome_treino" name="nome_treino" value={formData.nome_treino} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
              </div>

              <div>
                <label htmlFor="aluno_id" className="block text-sm font-medium text-gray-700 mb-1">Aluno</label>
                <select id="aluno_id" name="aluno_id" value={formData.aluno_id} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="" disabled>Selecione um aluno</option>
                  {alunos.map(aluno => <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="instrutor_id" className="block text-sm font-medium text-gray-700 mb-1">Instrutor</label>
                <select id="instrutor_id" name="instrutor_id" value={formData.instrutor_id} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="" disabled>Selecione um instrutor</option>
                  {instrutores.map(instrutor => <option key={instrutor.id} value={instrutor.id}>{instrutor.nome}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="data_inicio" className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                <input type="date" id="data_inicio" name="data_inicio" value={formData.data_inicio} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </div>

              <div>
                <label htmlFor="data_fim" className="block text-sm font-medium text-gray-700 mb-1">Data de Fim (Opcional)</label>
                <input type="date" id="data_fim" name="data_fim" value={formData.data_fim} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </div>

              <div className="md:col-span-2 flex items-center justify-end space-x-4">
                {editingId && (
                  <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
                    Cancelar
                  </button>
                )}
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                  {editingId ? 'Atualizar Treino' : 'Salvar Treino'}
                </button>
              </div>
            </form>
          </div>

          {/* Tabela de Treinos */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Treino</th>
                  <th className="p-4 font-semibold text-gray-600">Aluno</th>
                  <th className="p-4 font-semibold text-gray-600">Instrutor</th>
                  <th className="p-4 font-semibold text-gray-600">Período</th>
                  <th className="p-4 font-semibold text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {treinos.map(treino => (
                  <tr key={treino.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                        <div className="font-medium text-gray-900">{treino.nome_treino}</div>
                        <div className="text-sm text-gray-500 truncate" style={{maxWidth: '250px'}}>{treino.descricao}</div>
                    </td>
                    <td className="p-4 text-gray-700">{treino.aluno_nome}</td>
                    <td className="p-4 text-gray-700">{treino.instrutor_nome}</td>
                    <td className="p-4 text-gray-700">
                        {formatDateForInput(treino.data_inicio)} a {formatDateForInput(treino.data_fim) || 'Atual'}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(treino)} className="text-indigo-600 hover:text-indigo-900 font-medium">Editar</button>
                        <button onClick={() => handleDelete(treino.id)} className="text-red-600 hover:text-red-900 font-medium">Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
             {treinos.length === 0 && (
                <div className="text-center p-8 text-gray-500">
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

