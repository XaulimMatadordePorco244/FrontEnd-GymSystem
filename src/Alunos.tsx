
import  { useState, useEffect } from 'react';
// Importando os componentes que criamos
import AlunosList from './AlunosList';
import AlunosForm from './AlunosForm';
// Importando a interface e os dados mockados
import type { Aluno } from './types';

// --- Dados Iniciais (Simulação de Banco de Dados) ---
// Estes dados seriam carregados do seu back-end (Fastify + MySQL)


function App() {
  // Estado para armazenar a lista de alunos
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  // Estado para controlar a visibilidade do formulário
  const [isFormVisible, setIsFormVisible] = useState(false);
  // Estado para guardar o aluno que está sendo editado
  const [alunoParaEditar, setAlunoParaEditar] = useState<Aluno | null>(null);

  // Simula o carregamento inicial dos dados da API
useEffect(() => {
  const fetchAlunos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/alunos');
      if (!response.ok) {
        throw new Error('Erro ao carregar alunos');
      }
      const data = await response.json();
      setAlunos(data);
    } catch (error) {
      console.error('Erro:', error);
      // Você pode adicionar um estado de erro para mostrar ao usuário
    }
  };

  fetchAlunos();
}, []);

  // --- Funções CRUD (Simuladas) ---

  const handleSaveAluno = async (alunoData: Omit<Aluno, 'id'> | Aluno) => {
  try {
    let response;
    
    if ('id' in alunoData) {
      // Atualização
      response = await fetch(`http://localhost:8000/api/alunos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
       
      });
    } else {
      // Criação
      response = await fetch('http://localhost:8000/api/alunos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
      });
    }

    if (!response.ok) {
      throw new Error('Erro ao salvar aluno');
    }

    const alunoAtualizado = await response.json();
    
    if ('id' in alunoData) {
      setAlunos(alunos.map(a => a.id === alunoData.id ? alunoAtualizado : a));
    } else {
      setAlunos([...alunos, alunoAtualizado]);
    }

    closeForm();
  } catch (error) {
    console.error('Erro:', error);
    // Mostrar mensagem de erro para o usuário
  }
};
const handleDeleteAluno = async (id: number) => {
  if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
    try {
      const response = await fetch(`http://localhost:8000/api/alunos/:id`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir aluno');
      }

      setAlunos(alunos.filter(a => a.id !== id));
    } catch (error) {
      console.error('Erro:', error);
      // Mostrar mensagem de erro para o usuário
    }
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
            <AlunosForm 
              alunoParaEditar={alunoParaEditar}
              onSave={handleSaveAluno}
              onCancel={closeForm}
            />
          ) : (
            <AlunosList
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