

import React, { useState, useEffect, type FC, type FormEvent } from 'react';
// Importa a interface Aluno do nosso arquivo de tipos.
import type { Aluno } from './types';

// Propriedades que o componente StudentsForm espera receber.
interface StudentsFormProps {
  alunoParaEditar: Aluno | null;
  onSave: (aluno: Omit<Aluno, 'id'> | Aluno) => void;
  onCancel: () => void;
}

const StudentsForm: FC<StudentsFormProps> = ({ alunoParaEditar, onSave, onCancel }) => {
  // Estado inicial do formulário
  const initialState = {
    nome_completo: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    data_matricula: '',
    status: 'ativo' as 'ativo' | 'inativo',
  };

  const [aluno, setAluno] = useState(initialState);

  // Efeito que roda quando 'alunoParaEditar' muda.
  // Se um aluno for passado, preenche o formulário.
  // Se for nulo (clicando em "Novo Aluno"), limpa o formulário.
  useEffect(() => {
    if (alunoParaEditar) {
      setAluno({
        nome_completo: alunoParaEditar.nome_completo,
        email: alunoParaEditar.email,
        telefone: alunoParaEditar.telefone,
        data_nascimento: alunoParaEditar.data_nascimento,
        data_matricula: alunoParaEditar.data_matricula,
        status: alunoParaEditar.status,
      });
    } else {
      setAluno(initialState);
    }
  }, [alunoParaEditar]);

  // Atualiza o estado conforme o usuário digita nos inputs.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAluno(prev => ({ ...prev, [name]: value }));
  };

  // Chamado quando o formulário é enviado.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const alunoData = alunoParaEditar ? { ...aluno, id: alunoParaEditar.id } : aluno;
    onSave(alunoData);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {alunoParaEditar ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="nome_completo" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input type="text" name="nome_completo" id="nome_completo" value={aluno.nome_completo} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" id="email" value={aluno.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input type="tel" name="telefone" id="telefone" value={aluno.telefone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="data_nascimento" className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
            <input type="date" name="data_nascimento" id="data_nascimento" value={aluno.data_nascimento} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <label htmlFor="data_matricula" className="block text-sm font-medium text-gray-700 mb-1">Data de Matrícula</label>
            <input type="date" name="data_matricula" id="data_matricula" value={aluno.data_matricula} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" id="status" value={aluno.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
            Cancelar
          </button>
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentsForm;
