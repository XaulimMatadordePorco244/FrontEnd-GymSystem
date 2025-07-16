import type { AlunosListProps } from './types';

const AlunosList = ({ 
  alunos = [], 
  onEdit, 
  onDelete, 
  onAddNew,
  isLoading = false 
}: AlunosListProps) => {
  return (
    <div className="gym-card">
      <div className="flex-between mb-6">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>Alunos Cadastrados</h2>
        <button 
          onClick={onAddNew} 
          disabled={isLoading}
          className="gym-btn gym-btn-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="gym-btn-icon h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Novo Aluno
        </button>
      </div>
      
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem 0' }}>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="gym-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.length > 0 ? (
                alunos.map(aluno => (
                  <tr key={aluno.id_aluno}>
                    <td data-label="Nome">
                      <div style={{ fontWeight: '600', color: '#111827' }}>{aluno.nome_completo}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{aluno.telefone}</div>
                    </td>
                    <td data-label="Email">{aluno.email}</td>
                    <td data-label="Status">
                      <span className={`gym-badge ${
                        aluno.status === 'ativo' ? 'badge-active' : 'badge-inactive'
                      }`}>
                        {aluno.status}
                      </span>
                    </td>
                    <td data-label="Ações" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button onClick={() => onEdit(aluno)} className="gym-btn gym-btn-secondary" style={{ marginRight: '0.5rem' }}>Editar</button>
                      <button onClick={() => aluno.id_aluno && onDelete(aluno.id_aluno)} className="gym-btn gym-btn-secondary">Excluir</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center" style={{ padding: '2.5rem 0' }}>
                    Nenhum aluno cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AlunosList;