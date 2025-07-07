// src/types/index.ts
export interface Aluno {
  id: number;
  nome_completo: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  data_matricula: string;
  status: 'ativo' | 'inativo';
}