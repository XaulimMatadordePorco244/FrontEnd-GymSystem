export interface Aluno {
  id_aluno: number;
  nome_completo: string;
  data_nascimento: string;
  sexo: 'M' | 'F' | 'O';
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  data_matricula: string;
  status: 'ativo' | 'inativo';
}

export interface AlunosFormProps {
  alunoParaEditar: Aluno | null;
  onSave: (aluno: Aluno) => Promise<void> | void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface AlunosListProps {
  alunos: Aluno[];
  onEdit: (aluno: Aluno) => void;
  onDelete: (id: number) => Promise<void> | void;
  onAddNew: () => void;
  isLoading?: boolean;
}