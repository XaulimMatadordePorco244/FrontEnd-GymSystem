import { useState, useEffect } from 'react';
import AlunosList from './AlunosList';
import AlunosForm from './AlunosForm';
import type { Aluno } from './types';

function App() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [alunoParaEditar, setAlunoParaEditar] = useState<Aluno | null>(null);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/alunos');
        if (!response.ok) {
          throw new Error('Erro ao carregar alunos');
        }
        const data = await response.json();
        
        const alunosFormatados = data.map((aluno: any) => ({
          id_aluno: aluno.id_aluno,
          nome_completo: aluno.nome,
          data_nascimento: aluno.data_nascimento,
          data_matricula: aluno.data_matricula,
          sexo: aluno.sexo,
          telefone: aluno.telefone,
          email: aluno.email,
          endereco: aluno.endereco,
          status: aluno.status
        }));
        
        setAlunos(alunosFormatados);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    fetchAlunos();
  }, []);

  const handleSaveAluno = async (alunoData: Aluno) => {
    try {
      let url = 'http://localhost:8000/api/alunos';
      let method = 'POST';
      
      if (alunoData.id_aluno) {
        url += `/${alunoData.id_aluno}`;
        method = 'PUT';
      }

      const bodyData = {
        nome: alunoData.nome_completo,
        data_nascimento: alunoData.data_nascimento,
        sexo: alunoData.sexo,
        telefone: alunoData.telefone || null,
        email: alunoData.email || null,
        endereco: alunoData.endereco || null,
        status: alunoData.status || 'ativo',
        data_matricula: alunoData.data_matricula
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar aluno');
      }

      const result = await response.json();
      
      if (alunoData.id_aluno) {
        setAlunos(alunos.map(a => 
          a.id_aluno === alunoData.id_aluno ? result : a
        ));
      } else {
        setAlunos([...alunos, result]);
      }

      closeForm();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDeleteAluno = async (id_aluno: number) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/alunos/${id_aluno}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Erro ao excluir aluno');
        }

        setAlunos(alunos.filter(a => a.id_aluno !== id_aluno));
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setAlunoParaEditar(null);
  };

  const handleAddNew = () => {
    setAlunoParaEditar(null);
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

export default App;