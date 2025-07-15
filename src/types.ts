export interface Aluno {
  id_aluno?: number;
  nome_completo: string;
  data_nascimento: string;
  data_matricula: string;
  sexo: 'M' | 'F' | 'O';
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  status: 'ativo' | 'inativo';
}