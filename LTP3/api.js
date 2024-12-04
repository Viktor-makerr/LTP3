// API do Sistema Urban Drive

// ========================================
// API de Veículos
// ========================================
const VeiculosAPI = {
    // Lista todos os veículos cadastrados
    // Retorna um array com todos os veículos ordenados por data de criação
    async listar() {
        try {
            console.log('Listando veículos...'); // Log para debug
            const { data, error } = await window.supabase
                .from('veiculos')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }
            console.log('Veículos retornados:', data);
            return data || [];
        } catch (error) {
            console.error('Erro ao listar veículos:', error);
            throw error;
        }
    },

    // Adiciona um novo veículo ao sistema
    // Parâmetro veiculo: objeto com dados do veículo (placa, modelo, marca, ano, capacidade)
    async adicionar(veiculo) {
        try {
            console.log('Adicionando veículo:', veiculo);
            const { data, error } = await window.supabase
                .from('veiculos')
                .insert([veiculo])
                .select();
            
            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }
            console.log('Veículo adicionado:', data);
            return data[0];
        } catch (error) {
            console.error('Erro ao adicionar veículo:', error);
            throw error;
        }
    },

    // Atualiza os dados de um veículo existente
    // Parâmetros:
    // - id: identificador único do veículo
    // - veiculo: objeto com os novos dados do veículo
    async atualizar(id, veiculo) {
        try {
            console.log('Atualizando veículo:', id, veiculo);
            const { data, error } = await window.supabase
                .from('veiculos')
                .update(veiculo)
                .eq('id', id)
                .select()
                .single();
            
            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }
            console.log('Veículo atualizado:', data);
            return data;
        } catch (error) {
            console.error('Erro ao atualizar veículo:', error);
            throw error;
        }
    },

    // Remove um veículo do sistema
    // Parâmetro id: identificador único do veículo a ser removido
    async deletar(id) {
        try {
            console.log('Deletando veículo:', id);
            const { error } = await window.supabase
                .from('veiculos')
                .delete()
                .eq('id', id);
            
            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }
            console.log('Veículo deletado com sucesso');
        } catch (error) {
            console.error('Erro ao deletar veículo:', error);
            throw error;
        }
    }
};

// ========================================
// API de Motoristas
// ========================================
const MotoristasAPI = {
    // Lista todos os motoristas cadastrados
    // Retorna um array com todos os motoristas ordenados por data de criação
    async listar() {
        try {
            console.log('Listando motoristas...');
            const { data, error } = await window.supabase
                .from('motoristas')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }
            console.log('Motoristas retornados:', data);
            return data || [];
        } catch (error) {
            console.error('Erro ao listar motoristas:', error);
            throw error;
        }
    },

    // Adiciona um novo motorista ao sistema
    // Parâmetro motorista: objeto com dados do motorista (nome, cnh, categoria)
    async adicionar(motorista) {
        try {
            console.log('Adicionando motorista:', motorista);
            const { data, error } = await window.supabase
                .from('motoristas')
                .insert([motorista])
                .select();
            
            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }
            console.log('Motorista adicionado:', data);
            return data[0];
        } catch (error) {
            console.error('Erro ao adicionar motorista:', error);
            throw error;
        }
    },

    // Atualiza os dados de um motorista existente
    // Parâmetros:
    // - id: identificador único do motorista
    // - motorista: objeto com os novos dados do motorista
    async atualizar(id, motorista) {
        try {
            console.log('Atualizando motorista:', id, motorista);
            const { data, error } = await window.supabase
                .from('motoristas')
                .update(motorista)
                .eq('id', id)
                .select()
                .single();
            
            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }
            console.log('Motorista atualizado:', data);
            return data;
        } catch (error) {
            console.error('Erro ao atualizar motorista:', error);
            throw error;
        }
    },

    // Remove um motorista do sistema
    // Parâmetro id: identificador único do motorista a ser removido
    async deletar(id) {
        try {
            console.log('Deletando motorista:', id);
            const { error } = await window.supabase
                .from('motoristas')
                .delete()
                .eq('id', id);
            
            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }
            console.log('Motorista deletado com sucesso');
        } catch (error) {
            console.error('Erro ao deletar motorista:', error);
            throw error;
        }
    }
};

// ========================================
// API de Rotas
// ========================================
const RotasAPI = {
    // Lista todas as rotas cadastradas
    // Retorna um array com todas as rotas e seus relacionamentos (motoristas e veículos)
    async listar() {
        try {
            console.log('Listando rotas...');
            const { data, error } = await window.supabase
                .from('rotas')
                .select(`
                    *,
                    motoristas (
                        id,
                        nome
                    ),
                    veiculos (
                        id,
                        placa,
                        modelo
                    )
                `)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }
            console.log('Rotas retornadas:', data);
            return data || [];
        } catch (error) {
            console.error('Erro ao listar rotas:', error);
            throw error;
        }
    },

    // Adiciona uma nova rota ao sistema
    // Parâmetro rota: objeto com dados da rota (origem, destino, motorista_id, veiculo_id, data_inicio)
    async adicionar(rota) {
        try {
            console.log('Adicionando rota:', rota);
            const { data, error } = await window.supabase
                .from('rotas')
                .insert([rota])
                .select();
            
            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }
            console.log('Rota adicionada:', data);
            return data[0];
        } catch (error) {
            console.error('Erro ao adicionar rota:', error);
            throw error;
        }
    },

    // Atualiza os dados de uma rota existente
    // Parâmetros:
    // - id: identificador único da rota
    // - rota: objeto com os novos dados da rota
    async atualizar(id, rota) {
        try {
            console.log('Atualizando rota:', id, rota);
            const { data, error } = await window.supabase
                .from('rotas')
                .update(rota)
                .eq('id', id)
                .select()
                .single();
            
            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }
            console.log('Rota atualizada:', data);
            return data;
        } catch (error) {
            console.error('Erro ao atualizar rota:', error);
            throw error;
        }
    },

    // Remove uma rota do sistema
    // Parâmetro id: identificador único da rota a ser removida
    async deletar(id) {
        try {
            console.log('Deletando rota:', id);
            const { error } = await window.supabase
                .from('rotas')
                .delete()
                .eq('id', id);
            
            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }
            console.log('Rota deletada com sucesso');
        } catch (error) {
            console.error('Erro ao deletar rota:', error);
            throw error;
        }
    }
};

// Exporta as APIs para uso global na aplicação
window.VeiculosAPI = VeiculosAPI;
window.MotoristasAPI = MotoristasAPI;
window.RotasAPI = RotasAPI;
