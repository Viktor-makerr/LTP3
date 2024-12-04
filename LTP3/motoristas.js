// Funções globais para edição e exclusão
window.editarMotorista = async (id) => {
    try {
        console.log('Editando motorista:', id);
        const { data: motorista, error } = await window.supabase
            .from('motoristas')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        console.log('Motorista carregado:', motorista);
        
        // Preencher o formulário
        document.getElementById('motoristaId').value = motorista.id;
        document.getElementById('nome').value = motorista.nome || '';
        document.getElementById('cnh').value = motorista.cnh || '';
        document.getElementById('categoria').value = motorista.categoria || 'B';
        document.getElementById('status').value = motorista.status || 'Disponível';
        
        // Abrir modal com título de edição
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = 'Editar Motorista';
        const modal = new bootstrap.Modal(document.getElementById('motoristaModal'));
        modal.show();
    } catch (error) {
        console.error('Erro ao carregar motorista para edição:', error);
        alert('Erro ao carregar motorista para edição: ' + error.message);
    }
};

window.deletarMotorista = async (id) => {
    if (confirm('Tem certeza que deseja excluir este motorista?')) {
        try {
            await window.MotoristasAPI.deletar(id);
            await window.loadMotoristas(); // Atualiza a lista após deletar
        } catch (error) {
            console.error('Erro ao deletar motorista:', error);
            alert('Erro ao deletar motorista: ' + error.message);
        }
    }
};

// Função global para carregar motoristas
window.loadMotoristas = async () => {
    try {
        const motoristas = await window.MotoristasAPI.listar();
        console.log('Motoristas carregados:', motoristas);
        window.renderTable(motoristas);
    } catch (error) {
        console.error('Erro ao carregar motoristas:', error);
        alert('Erro ao carregar motoristas: ' + error.message);
    }
};

// Função global para renderizar tabela
window.renderTable = (motoristas) => {
    const tableBody = document.getElementById('motoristasTableBody');
    if (!Array.isArray(motoristas)) {
        console.error('Dados de motoristas inválidos:', motoristas);
        return;
    }

    tableBody.innerHTML = motoristas.map(motorista => `
        <tr>
            <td>${motorista.nome || ''}</td>
            <td>${motorista.cnh || ''}</td>
            <td>${motorista.categoria || ''}</td>
            <td>
                <span class="badge bg-${window.getStatusColor(motorista.status)}">
                    ${motorista.status || ''}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editarMotorista('${motorista.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletarMotorista('${motorista.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
};

// Função global para cor do status
window.getStatusColor = (status) => {
    switch (status) {
        case 'Disponível': return 'success';
        case 'Em serviço': return 'warning';
        case 'Férias': return 'info';
        case 'Afastado': return 'danger';
        default: return 'secondary';
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const modal = new bootstrap.Modal(document.getElementById('motoristaModal'));
    const form = document.getElementById('motoristaForm');
    const modalTitle = document.getElementById('modalTitle');
    
    // Botão "Novo Motorista"
    document.querySelector('[data-bs-target="#motoristaModal"]').addEventListener('click', () => {
        form.reset();
        document.getElementById('motoristaId').value = '';
        modalTitle.textContent = 'Novo Motorista';
    });

    // Salvar motorista
    document.getElementById('saveMotorista').addEventListener('click', async () => {
        try {
            const motoristaId = document.getElementById('motoristaId').value;
            const motorista = {
                nome: document.getElementById('nome').value,
                cnh: document.getElementById('cnh').value,
                categoria: document.getElementById('categoria').value,
                status: document.getElementById('status').value
            };

            console.log('Salvando motorista:', { id: motoristaId, ...motorista });

            if (motoristaId && motoristaId.trim() !== '') {
                // Editar motorista existente
                console.log('Editando motorista existente:', motoristaId);
                await window.MotoristasAPI.atualizar(motoristaId, motorista);
            } else {
                // Adicionar novo motorista
                console.log('Adicionando novo motorista');
                await window.MotoristasAPI.adicionar(motorista);
            }

            modal.hide();
            form.reset();
            await window.loadMotoristas(); // Atualiza a lista após salvar
        } catch (error) {
            console.error('Erro ao salvar motorista:', error);
            alert('Erro ao salvar motorista: ' + error.message);
        }
    });

    // Carregar motoristas inicialmente
    await window.loadMotoristas();
});
