
import  { useState, useEffect } from 'react';
// Importando os componentes que criamos
import StudentsList from './StudentsList';
import StudentsForm from './StudentsForm';
// Importando a interface e os dados mockados
import type { Aluno } from './types';

// --- Dados Iniciais (Simulação de Banco de Dados) ---
// Estes dados seriam carregados do seu back-end (Fastify + MySQL)
const mockAlunos: Aluno[] = [
  { id: 1, nome_completo: 'João da Silva', email: 'joao.silva@example.com', telefone: '11987654321', data_nascimento: '1995-03-15', data_matricula: '2023-01-10', status: 'ativo' },
  { id: 2, nome_completo: 'Maria Oliveira', email: 'maria.oliveira@example.com', telefone: '21998877665', data_nascimento: '2000-07-22', data_matricula: '2023-02-20', status: 'ativo' },
  { id: 3, nome_completo: 'Carlos Pereira', email: 'carlos.pereira@example.com', telefone: '31988889999', data_nascimento: '1988-11-05', data_matricula: '2022-11-30', status: 'inativo' },
];

function App() {
  // Estado para armazenar a lista de alunos
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  // Estado para controlar a visibilidade do formulário
  const [isFormVisible, setIsFormVisible] = useState(false);
  // Estado para guardar o aluno que está sendo editado
  const [alunoParaEditar, setAlunoParaEditar] = useState<Aluno | null>(null);

  // Simula o carregamento inicial dos dados da API
  useEffect(() => {
    // TODO: Substituir por uma chamada fetch para a sua API Fastify
    // Ex: fetch('/api/alunos').then(res => res.json()).then(data => setAlunos(data));
    setAlunos(mockAlunos);
  }, []);

  // --- Funções CRUD (Simuladas) ---

  const handleSaveAluno = (alunoData: Omit<Aluno, 'id'> | Aluno) => {
    // Lógica para UPDATE (Atualizar)
    if ('id' in alunoData) {
      // TODO: Substituir pela chamada da API: PUT /api/alunos/:id
      console.log('Atualizando aluno:', alunoData);
      setAlunos(alunos.map(a => a.id === alunoData.id ? alunoData : a));
    } 
    // Lógica para CREATE (Criar)
    else {
      // TODO: Substituir pela chamada da API: POST /api/alunos
      console.log('Criando novo aluno:', alunoData);
      const novoAlunoComId = { ...alunoData, id: Date.now() }; // Simula a geração de ID pelo DB
      setAlunos([...alunos, novoAlunoComId]);
    }
    closeForm();
  };

  const handleDeleteAluno = (id: number) => {
    // O ideal é usar um modal de confirmação customizado em vez do window.confirm
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
        // TODO: Substituir pela chamada da API: DELETE /api/alunos/:id
        console.log('Excluindo aluno com ID:', id);
        setAlunos(alunos.filter(a => a.id !== id));
    }
  };

  // --- Funções de Controle da UI ---

  const closeForm = () => {
    setIsFormVisible(false);
    setAlunoParaEditar(null);
  };

  const handleAddNew = () => {
    setAlunoParaEditar(null); // Garante que o formulário estará vazio
    setIsFormVisible(true);
  };

  const handleEdit = (aluno: Aluno) => {
    setAlunoParaEditar(aluno);
    setIsFormVisible(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Sistema da <span className="text-indigo-600">Academia</span>
            </h1>
            <p className="mt-2 text-lg text-gray-600">Gerenciamento de Alunos</p>
        </header>
        
        <main>
          {isFormVisible ? (
            <StudentsForm 
              alunoParaEditar={alunoParaEditar}
              onSave={handleSaveAluno}
              onCancel={closeForm}
            />
          ) : (
            <StudentsList
              alunos={alunos}
              onEdit={handleEdit}
              onDelete={handleDeleteAluno}
              onAddNew={handleAddNew}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App