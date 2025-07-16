import React, { useState, useEffect } from 'react';
import type { Aluno, AlunosFormProps } from './types';

const AlunosForm = ({ 
  alunoParaEditar, 
  onSave, 
  onCancel,
  isLoading = false 
}: AlunosFormProps) => {
  const initialState: Aluno = {
    id_aluno: 0,
    nome_completo: '',
    data_nascimento: new Date().toISOString().split('T')[0],
    sexo: 'M',
    telefone: '',
    email: '',
    endereco: '',
    data_matricula: new Date().toISOString().split('T')[0],
    status: 'ativo'
  };

  const [aluno, setAluno] = useState<Aluno>(initialState);

  useEffect(() => {
    if (alunoParaEditar) {
        // Ensure date is in 'YYYY-MM-DD' format for the input
        const formattedAluno = {
            ...alunoParaEditar,
            data_nascimento: alunoParaEditar.data_nascimento.split('T')[0],
        };
        setAluno(formattedAluno);
    } else {
        setAluno(initialState);
    }
  }, [alunoParaEditar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAluno(prev => ({ 
      ...prev, 
      [name]: name === 'telefone' || name === 'email' || name === 'endereco' 
        ? (value === '' ? null : value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(aluno);
  };

  return (
    <div className="gym-card">
      <h2 className="mb-6" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
        {alunoParaEditar && alunoParaEditar.id_aluno ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Nome Completo (Obrigatório) */}
        <div className="gym-form-group">
          <label htmlFor="nome_completo" className="gym-form-label">
            Nome Completo *
          </label>
          <input
            type="text"
            name="nome_completo"
            id="nome_completo"
            value={aluno.nome_completo}
            onChange={handleChange}
            className="gym-form-control"
            required
          />
        </div>
        
        {/* Data de Nascimento (Obrigatório) */}
        <div className="gym-form-group">
          <label htmlFor="data_nascimento" className="gym-form-label">
            Data de Nascimento *
          </label>
          <input
            type="date"
            name="data_nascimento"
            id="data_nascimento"
            value={aluno.data_nascimento}
            onChange={handleChange}
            className="gym-form-control"
            required
          />
        </div>
        
        {/* Sexo (Obrigatório) */}
        <div className="gym-form-group">
          <label htmlFor="sexo" className="gym-form-label">
            Sexo *
          </label>
          <select
            name="sexo"
            id="sexo"
            value={aluno.sexo}
            onChange={handleChange}
            className="gym-form-control"
            required
          >
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="O">Outro</option>
          </select>
        </div>
        
        {/* Telefone (Opcional) */}
        <div className="gym-form-group">
          <label htmlFor="telefone" className="gym-form-label">Telefone</label>
          <input
            type="tel"
            name="telefone"
            id="telefone"
            value={aluno.telefone || ''}
            onChange={handleChange}
            className="gym-form-control"
          />
        </div>
        
        {/* Email (Opcional) */}
        <div className="gym-form-group">
          <label htmlFor="email" className="gym-form-label">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={aluno.email || ''}
            onChange={handleChange}
            className="gym-form-control"
          />
        </div>
        
        {/* Endereço (Opcional) */}
        <div className="gym-form-group">
          <label htmlFor="endereco" className="gym-form-label">Endereço</label>
          <input
            type="text"
            name="endereco"
            id="endereco"
            value={aluno.endereco || ''}
            onChange={handleChange}
            className="gym-form-control"
          />
        </div>
        
        {/* Status (Apenas para edição) */}
        {alunoParaEditar && alunoParaEditar.id_aluno > 0 && (
          <div className="gym-form-group">
            <label htmlFor="status" className="gym-form-label">Status</label>
            <select
              name="status"
              id="status"
              value={aluno.status}
              onChange={handleChange}
              className="gym-form-control"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        )}

        {/* Botões de Ação */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }} className="gap-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="gym-btn gym-btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="gym-btn gym-btn-primary"
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </span>
            ) : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlunosForm;