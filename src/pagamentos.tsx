import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- TIPAGEM E INTERFACES --- //

// Interface para um pagamento, espelhando a estrutura do backend
interface Pagamento {
  id: number;
  aluno_id: number;
  data_pagamento: string;
  valor: number;
  metodo_pagamento: 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'pix';
}

// Interface para um aluno, necessária para o formulário de pagamentos
interface Aluno {
    id: number;
    nome: string;
    email: string;
}

// Props para o componente de formulário
interface PagamentoFormProps {
  alunos: Aluno[];
  onSubmit: (pagamento: Omit<Pagamento, 'id'> | Pagamento) => void;
  onCancel: () => void;
  pagamentoInicial?: Pagamento | null;
}

// Props para o componente de lista
interface PagamentosListProps {
    pagamentos: Pagamento[];
    alunos: Aluno[];
    onEdit: (pagamento: Pagamento) => void;
    onDelete: (id: number) => void;
}

// Props para o modal
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

// --- CONSTANTES --- //
const API_URL = 'http://localhost:3001'; // URL do seu backend Fastify

// --- COMPONENTES AUXILIARES --- //

/**
 * Componente de Notificação para feedback ao usuário
 */
const Notificacao: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000); // Fecha a notificação após 5 segundos
        return () => clearTimeout(timer);
    }, [onClose]);

    const baseClasses = "fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white transition-transform transform";
    const typeClasses = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`${baseClasses} ${typeClasses}`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 font-bold">X</button>
        </div>
    );
};


/**
 * Componente Modal genérico para formulários
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 z-50">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};


/**
 * Componente para exibir a lista de pagamentos
 */
const PagamentosList: React.FC<PagamentosListProps> = ({ pagamentos, alunos, onEdit, onDelete }) => {
    // Cria um mapa de alunos para busca rápida do nome pelo ID
    const alunoMap = useMemo(() => {
        const map = new Map<number, string>();
        alunos.forEach(aluno => map.set(aluno.id, aluno.nome));
        return map;
    }, [alunos]);

    // Formata a data para o padrão brasileiro
    const formatarData = (data: string) => {
        try {
            const dataObj = new Date(data);
            // Adiciona 1 dia para corrigir problemas de fuso horário que podem fazer a data "voltar" um dia
            dataObj.setDate(dataObj.getDate() + 1);
            return dataObj.toLocaleDateString('pt-BR');
        } catch (e) {
            return "Data inválida";
        }
    };
    
    // Formata o valor para moeda brasileira
    const formatarValor = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                        <th scope="col" className="px-6 py-3">Aluno</th>
                        <th scope="col" className="px-6 py-3">Data Pag.</th>
                        <th scope="col" className="px-6 py-3">Valor</th>
                        <th scope="col" className="px-6 py-3">Método</th>
                        <th scope="col" className="px-6 py-3 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pagamentos.length > 0 ? pagamentos.map((pagamento) => (
                        <tr key={pagamento.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {alunoMap.get(pagamento.aluno_id) || 'Aluno não encontrado'}
                            </td>
                            <td className="px-6 py-4">{formatarData(pagamento.data_pagamento)}</td>
                            <td className="px-6 py-4">{formatarValor(pagamento.valor)}</td>
                            <td className="px-6 py-4 capitalize">{pagamento.metodo_pagamento.replace('_', ' ')}</td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => onEdit(pagamento)} className="font-medium text-blue-600 hover:underline mr-4">Editar</button>
                                <button onClick={() => onDelete(pagamento.id)} className="font-medium text-red-600 hover:underline">Excluir</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="text-center py-8 text-gray-500">Nenhum pagamento encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};


/**
 * Componente de Formulário para criar e editar pagamentos
 */
const PagamentoForm: React.FC<PagamentoFormProps> = ({ alunos, onSubmit, onCancel, pagamentoInicial }) => {
    const [pagamento, setPagamento] = useState({
        aluno_id: pagamentoInicial?.aluno_id || (alunos.length > 0 ? alunos[0].id : 0),
        data_pagamento: pagamentoInicial?.data_pagamento.substring(0, 10) || new Date().toISOString().substring(0, 10),
        valor: pagamentoInicial?.valor || 0,
        metodo_pagamento: pagamentoInicial?.metodo_pagamento || 'pix',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPagamento(prev => ({ ...prev, [name]: name === 'valor' || name === 'aluno_id' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!pagamento.aluno_id || pagamento.aluno_id === 0) {
            alert("Por favor, selecione um aluno.");
            return;
        }
        if(pagamento.valor <= 0) {
            alert("O valor do pagamento deve ser maior que zero.");
            return;
        }
        onSubmit(pagamentoInicial ? { ...pagamento, id: pagamentoInicial.id } : pagamento);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="aluno_id" className="block text-sm font-medium text-gray-700">Aluno</label>
                <select id="aluno_id" name="aluno_id" value={pagamento.aluno_id} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value={0} disabled>Selecione um aluno</option>
                    {alunos.map(aluno => (
                        <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="data_pagamento" className="block text-sm font-medium text-gray-700">Data do Pagamento</label>
                <input type="date" id="data_pagamento" name="data_pagamento" value={pagamento.data_pagamento} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="valor" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                <input type="number" id="valor" name="valor" step="0.01" value={pagamento.valor} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="metodo_pagamento" className="block text-sm font-medium text-gray-700">Método de Pagamento</label>
                <select id="metodo_pagamento" name="metodo_pagamento" value={pagamento.metodo_pagamento} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="pix">PIX</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="dinheiro">Dinheiro</option>
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Salvar</button>
            </div>
        </form>
    );
};


// --- COMPONENTE PRINCIPAL --- //
const Pagamentos: React.FC = () => {
    const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [pagamentoEmEdicao, setPagamentoEmEdicao] = useState<Pagamento | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notificacao, setNotificacao] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Função para buscar dados da API
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Busca pagamentos e alunos em paralelo
            const [pagamentosResponse, alunosResponse] = await Promise.all([
                fetch(`${API_URL}/pagamentos`),
                fetch(`${API_URL}/alunos`) // Assumindo que você tem uma rota para buscar alunos
            ]);

            if (!pagamentosResponse.ok || !alunosResponse.ok) {
                throw new Error('Falha ao buscar dados do servidor.');
            }

            const pagamentosData: Pagamento[] = await pagamentosResponse.json();
            const alunosData: Aluno[] = await alunosResponse.json();
            
            setPagamentos(pagamentosData);
            setAlunos(alunosData);

        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro inesperado.');
            setNotificacao({ message: err.message || 'Erro ao conectar com o servidor.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Busca os dados iniciais ao montar o componente
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Funções de manipulação do CRUD
    const handleSavePagamento = async (pagamento: Omit<Pagamento, 'id'> | Pagamento) => {
        const isEditing = 'id' in pagamento;
        const url = isEditing ? `${API_URL}/pagamentos/${pagamento.id}` : `${API_URL}/pagamentos`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pagamento),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro ao ${isEditing ? 'atualizar' : 'criar'} pagamento.`);
            }
            
            setNotificacao({ message: `Pagamento ${isEditing ? 'atualizado' : 'criado'} com sucesso!`, type: 'success' });
            handleCloseModal();
            fetchData(); // Re-busca os dados para atualizar a lista

        } catch (err: any) {
            setNotificacao({ message: err.message, type: 'error' });
        }
    };

    const handleDeletePagamento = async (id: number) => {
        // Simples confirmação do navegador. Em um app real, use um modal de confirmação.
        if (window.confirm('Tem certeza que deseja excluir este pagamento?')) {
            try {
                const response = await fetch(`${API_URL}/pagamentos/${id}`, { method: 'DELETE' });
                if (!response.ok && response.status !== 204) {
                     const errorData = await response.json();
                     throw new Error(errorData.error || 'Erro ao excluir pagamento.');
                }
                setNotificacao({ message: 'Pagamento excluído com sucesso!', type: 'success' });
                fetchData(); // Re-busca os dados
            } catch (err: any) {
                setNotificacao({ message: err.message, type: 'error' });
            }
        }
    };

    // Funções de controle do Modal
    const handleOpenModalParaCriar = () => {
        setPagamentoEmEdicao(null);
        setIsModalOpen(true);
    };

    const handleOpenModalParaEditar = (pagamento: Pagamento) => {
        setPagamentoEmEdicao(pagamento);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPagamentoEmEdicao(null);
    };
    
    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                {notificacao && <Notificacao message={notificacao.message} type={notificacao.type} onClose={() => setNotificacao(null)} />}
                
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Controle de Pagamentos</h1>
                    <button onClick={handleOpenModalParaCriar} className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors duration-300 flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        <span>Adicionar Pagamento</span>
                    </button>
                </header>

                <main>
                    {isLoading && <div className="text-center py-8">Carregando pagamentos...</div>}
                    {error && !isLoading && <div className="text-center py-8 text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
                    {!isLoading && !error && (
                        <PagamentosList 
                            pagamentos={pagamentos} 
                            alunos={alunos}
                            onEdit={handleOpenModalParaEditar} 
                            onDelete={handleDeletePagamento} 
                        />
                    )}
                </main>

                <Modal 
                    isOpen={isModalOpen} 
                    onClose={handleCloseModal} 
                    title={pagamentoEmEdicao ? 'Editar Pagamento' : 'Novo Pagamento'}>
                    <PagamentoForm 
                        alunos={alunos}
                        onSubmit={handleSavePagamento} 
                        onCancel={handleCloseModal} 
                        pagamentoInicial={pagamentoEmEdicao} 
                    />
                </Modal>
            </div>
        </div>
    );
};

export default Pagamentos;
