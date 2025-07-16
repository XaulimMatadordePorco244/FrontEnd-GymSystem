import { useState, useEffect } from 'react';
import AlunosList from './AlunosList';
import AlunosForm from './AlunosForm';
import type { Aluno } from './types';
import './Alunos.css'; // Import the new CSS file here

function Alunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [alunoParaEditar, setAlunoParaEditar] = useState<Aluno | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlunos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8000/api/alunos');
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Erro ${response.status}: ${response.statusText}`
          );
        }
        
        const data = await response.json();
        setAlunos(data.map((aluno: any) => ({
          id_aluno: aluno.id_aluno,
          nome_completo: aluno.nome,
          data_nascimento: aluno.data_nascimento,
          sexo: aluno.sexo,
          telefone: aluno.telefone,
          email: aluno.email,
          endereco: aluno.endereco,
          data_matricula: aluno.data_cadastro,
          status: aluno.status
        })));
      } catch (error: unknown) {
        console.error('Erro ao carregar alunos:', error);
        
        let errorMessage = 'Não foi possível carregar os alunos';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlunos();
  }, []);

  const handleSaveAluno = async (alunoData: Aluno) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!alunoData.nome_completo || !alunoData.data_nascimento || !alunoData.sexo) {
        throw new Error('Nome, data de nascimento e sexo são obrigatórios');
      }

      const url = alunoData.id_aluno 
        ? `http://localhost:8000/api/alunos/${alunoData.id_aluno}`
        : 'http://localhost:8000/api/alunos';
      
      const method = alunoData.id_aluno ? 'PUT' : 'POST';

      const bodyData = {
        nome: alunoData.nome_completo,
        data_nascimento: alunoData.data_nascimento,
        sexo: alunoData.sexo,
        telefone: alunoData.telefone || null,
        email: alunoData.email || null,
        endereco: alunoData.endereco || null,
        status: alunoData.status || 'ativo'
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Erro ao salvar aluno');
      }

      setAlunos(prev => {
        if (alunoData.id_aluno) {
          return prev.map(a => a.id_aluno === alunoData.id_aluno ? {
            ...alunoData,
            data_matricula: responseData.data_cadastro || alunoData.data_matricula
          } : a);
        } else {
          return [...prev, {
            ...alunoData,
            id_aluno: responseData.id_aluno,
            data_matricula: responseData.data_cadastro
          }];
        }
      });

      closeForm();
    } catch (error: unknown) {
      console.error('Erro ao salvar aluno:', error);
      
      let errorMessage = 'Erro ao salvar aluno';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAluno = async (id_aluno: number) => {
    if (!window.confirm('Tem certeza que deseja inativar este aluno?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/alunos/${id_aluno}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      setAlunos(prevAlunos => 
        prevAlunos.map(a => 
          a.id_aluno === id_aluno ? { ...a, status: 'inativo' } : a
        )
      );
    } catch (error: unknown) {
      console.error('Erro ao inativar aluno:', error);
      
      let errorMessage = 'Erro ao inativar aluno';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setAlunoParaEditar(null);
  };

  const handleAddNew = () => {
    setAlunoParaEditar({
      id_aluno: 0,
      nome_completo: '',
      data_nascimento: new Date().toISOString().split('T')[0],
      sexo: 'M',
      telefone: '',
      email: '',
      endereco: '',
      status: 'ativo',
      data_matricula: new Date().toISOString().split('T')[0]
    });
    setIsFormVisible(true);
  };

  const handleEdit = (aluno: Aluno) => {
    setAlunoParaEditar(aluno);
    setIsFormVisible(true);
  };

  return (
    <div className="gym-container">
      <div className="gym-content">
        <header className="gym-header">
          <h1 className="gym-title">
            Sistema da <span style={{ color: '#4f46e5' }}>Academia</span>
          </h1>
          <p className="gym-subtitle">Gerenciamento de Alunos</p>
        </header>
        
        {error && (
          <div className="gym-card" style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', marginBottom: '1.5rem' }}>
            <strong>Erro:</strong> {error}
          </div>
        )}

        <main>
          {isFormVisible ? (
            <AlunosForm 
              alunoParaEditar={alunoParaEditar}
              onSave={handleSaveAluno}
              onCancel={closeForm}
              isLoading={isLoading}
            />
          ) : (
            <AlunosList
              alunos={alunos}
              onEdit={handleEdit}
              onDelete={handleDeleteAluno}
              onAddNew={handleAddNew}
              isLoading={isLoading}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default Alunos;