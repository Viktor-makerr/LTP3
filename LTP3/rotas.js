// Funções para gerenciamento de rotas no sistema Urban Drive

// Função global para editar uma rota existente
// Parâmetro id: identificador único da rota a ser editada
window.editarRota = async (id) => {
    try {
        console.log('Editando rota:', id);
        // Busca os dados da rota no banco
        const { data: rota, error } = await window.supabase
            .from('rotas')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        console.log('Rota carregada:', rota);
        
        // Preenche o formulário com os dados da rota
        document.getElementById('rotaId').value = rota.id;
        document.getElementById('origem').value = rota.origem || '';
        document.getElementById('destino').value = rota.destino || '';
        document.getElementById('motorista').value = rota.motorista_id || '';
        document.getElementById('veiculo').value = rota.veiculo_id || '';
        document.getElementById('data_inicio').value = rota.data_inicio || '';
        document.getElementById('status').value = rota.status || '';
        
        // Abre o modal de edição
        const modal = new bootstrap.Modal(document.getElementById('rotaModal'));
        document.getElementById('modalTitle').textContent = 'Editar Rota';
        modal.show();
    } catch (error) {
        console.error('Erro ao editar rota:', error);
        alert('Erro ao editar rota: ' + error.message);
    }
};

// Função global para deletar uma rota
// Parâmetro id: identificador único da rota a ser deletada
window.deletarRota = async (id) => {
    try {
        // Confirmação do usuário antes de deletar
        if (!confirm('Tem certeza que deseja excluir esta rota?')) return;
        
        await window.RotasAPI.deletar(id);
        await window.loadRotas(); // Recarrega a lista de rotas
    } catch (error) {
        console.error('Erro ao deletar rota:', error);
        alert('Erro ao deletar rota: ' + error.message);
    }
};

// Função global para concluir uma rota
// Parâmetro id: identificador único da rota a ser concluída
window.concluirRota = async (id) => {
    try {
        // Confirmação do usuário antes de concluir
        if (!confirm('Deseja realmente concluir esta rota?')) return;
        
        // Atualiza o status da rota para 'Concluída'
        await window.RotasAPI.atualizar(id, { status: 'Concluída' });
        await window.loadRotas(); // Recarrega a lista de rotas
    } catch (error) {
        console.error('Erro ao concluir rota:', error);
        alert('Erro ao concluir rota: ' + error.message);
    }
};

// Função para carregar a lista de motoristas no select
window.loadMotoristas = async () => {
    try {
        const motoristas = await window.MotoristasAPI.listar();
        const select = document.getElementById('motorista');
        // Limpa e preenche o select com os motoristas
        select.innerHTML = '<option value="">Selecione um motorista</option>';
        motoristas.forEach(motorista => {
            select.innerHTML += `<option value="${motorista.id}">${motorista.nome}</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar motoristas:', error);
        alert('Erro ao carregar motoristas: ' + error.message);
    }
};

// Função para carregar a lista de veículos no select
window.loadVeiculos = async () => {
    try {
        const veiculos = await window.VeiculosAPI.listar();
        const select = document.getElementById('veiculo');
        // Limpa e preenche o select com os veículos
        select.innerHTML = '<option value="">Selecione um veículo</option>';
        veiculos.forEach(veiculo => {
            select.innerHTML += `<option value="${veiculo.id}">${veiculo.placa} - ${veiculo.modelo}</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
        alert('Erro ao carregar veículos: ' + error.message);
    }
};

// Função global para carregar todas as rotas
window.loadRotas = async () => {
    try {
        const rotas = await window.RotasAPI.listar();
        window.renderTable(rotas); // Renderiza a tabela com as rotas
    } catch (error) {
        console.error('Erro ao carregar rotas:', error);
        alert('Erro ao carregar rotas: ' + error.message);
    }
};

// Função global para renderizar a tabela de rotas
window.renderTable = (rotas) => {
    const tableBody = document.getElementById('rotasTableBody');
    tableBody.innerHTML = ''; // Limpa a tabela
    
    // Para cada rota, cria uma linha na tabela
    rotas.forEach(rota => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${rota.origem || ''}</td>
            <td>${rota.destino || ''}</td>
            <td>${rota.motoristas?.nome || ''}</td>
            <td>${rota.veiculos?.placa || ''} ${rota.veiculos?.modelo || ''}</td>
            <td>${rota.data_inicio || ''}</td>
            <td>
                <span class="badge ${window.getStatusColor(rota.status)}">
                    ${rota.status || ''}
                </span>
            </td>
            <td>
                <div class="btn-group" role="group">
                    ${rota.status !== 'Concluída' ? `
                        <button class="btn btn-success btn-sm" onclick="concluirRota('${rota.id}')" title="Concluir">
                            <i class="bi bi-check-lg"></i>
                        </button>
                    ` : ''}
                    <button class="btn btn-primary btn-sm" onclick="editarRota('${rota.id}')" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deletarRota('${rota.id}')" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
};

// Função global para definir a cor do status da rota
window.getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'em andamento': return 'bg-primary';
        case 'concluída': return 'bg-success';
        case 'cancelada': return 'bg-danger';
        default: return 'bg-secondary'; // Status pendente ou outros
    }
};

// Quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Inicializa componentes do Bootstrap
        const modal = new bootstrap.Modal(document.getElementById('rotaModal'));
        const form = document.getElementById('rotaForm');

        // Carrega dados iniciais
        await Promise.all([
            window.loadMotoristas(),
            window.loadVeiculos(),
            window.loadRotas()
        ]);

        // Configura o formulário para adicionar/editar rotas
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Coleta dados do formulário
            const formData = new FormData(form);
            const rota = {
                origem: formData.get('origem'),
                destino: formData.get('destino'),
                motorista_id: formData.get('motorista'),
                veiculo_id: formData.get('veiculo'),
                data_inicio: formData.get('data_inicio'),
                status: formData.get('status')
            };

            try {
                const rotaId = formData.get('id');
                if (rotaId) {
                    // Atualiza rota existente
                    await window.RotasAPI.atualizar(rotaId, rota);
                } else {
                    // Adiciona nova rota
                    await window.RotasAPI.adicionar(rota);
                }

                modal.hide(); // Fecha o modal
                form.reset(); // Limpa o formulário
                await window.loadRotas(); // Recarrega a lista de rotas
            } catch (error) {
                console.error('Erro ao salvar rota:', error);
                alert('Erro ao salvar rota: ' + error.message);
            }
        });

        // Limpa o formulário quando o modal for fechado
        document.getElementById('rotaModal').addEventListener('hidden.bs.modal', () => {
            form.reset();
            document.getElementById('rotaId').value = '';
            document.getElementById('modalTitle').textContent = 'Nova Rota';
        });

    } catch (error) {
        console.error('Erro ao inicializar página:', error);
        alert('Erro ao inicializar página: ' + error.message);
    }
});
