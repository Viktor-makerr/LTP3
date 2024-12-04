// Funções globais para edição e exclusão
window.editarVeiculo = async (id) => {
    try {
        console.log('Editando veículo:', id); // Debug
        const { data: veiculo, error } = await window.supabase
            .from('veiculos')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        
        console.log('Veículo carregado:', veiculo); // Debug
        
        // Preencher o formulário
        document.getElementById('veiculoId').value = veiculo.id;
        document.getElementById('placa').value = veiculo.placa || '';
        document.getElementById('modelo').value = veiculo.modelo || '';
        document.getElementById('marca').value = veiculo.marca || '';
        document.getElementById('ano').value = veiculo.ano || '';
        document.getElementById('capacidade').value = veiculo.capacidade || '';
        document.getElementById('status').value = veiculo.status || 'Disponível';
        
        // Abrir modal com título de edição
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = 'Editar Veículo';
        const modal = new bootstrap.Modal(document.getElementById('veiculoModal'));
        modal.show();
    } catch (error) {
        console.error('Erro ao carregar veículo para edição:', error);
        alert('Erro ao carregar veículo para edição: ' + error.message);
    }
};

window.deletarVeiculo = async (id) => {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
        try {
            await window.VeiculosAPI.deletar(id);
            await window.loadVeiculos(); // Atualiza a lista após deletar
        } catch (error) {
            console.error('Erro ao deletar veículo:', error);
            alert('Erro ao deletar veículo: ' + error.message);
        }
    }
};

// Função global para carregar veículos
window.loadVeiculos = async () => {
    try {
        const veiculos = await window.VeiculosAPI.listar();
        console.log('Veículos carregados:', veiculos); // Debug
        window.renderTable(veiculos);
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
        alert('Erro ao carregar veículos: ' + error.message);
    }
};

// Função global para renderizar tabela
window.renderTable = (veiculos) => {
    const tableBody = document.getElementById('veiculosTableBody');
    tableBody.innerHTML = '';
    
    veiculos.forEach(veiculo => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${veiculo.placa || ''}</td>
            <td>${veiculo.modelo || ''}</td>
            <td>${veiculo.marca || ''}</td>
            <td>${veiculo.ano || ''}</td>
            <td>${veiculo.capacidade || 1} passageiros</td>
            <td>
                <span class="badge ${getStatusColor(veiculo.status)}">
                    ${veiculo.status || 'Disponível'}
                </span>
            </td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-primary btn-sm" onclick="editarVeiculo('${veiculo.id}')" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deletarVeiculo('${veiculo.id}')" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
};

// Função para cor do status
function getStatusColor(status) {
    switch (status?.toLowerCase()) {
        case 'disponível': return 'bg-success';
        case 'em uso': return 'bg-primary';
        case 'manutenção': return 'bg-warning';
        default: return 'bg-secondary';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const modal = new bootstrap.Modal(document.getElementById('veiculoModal'));
        const form = document.getElementById('veiculoForm');
        
        // Carregar dados iniciais
        await window.loadVeiculos();
        
        // Adicionar evento de submit no formulário
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(form);
                const veiculo = {
                    placa: formData.get('placa'),
                    modelo: formData.get('modelo'),
                    marca: formData.get('marca'),
                    ano: parseInt(formData.get('ano')),
                    capacidade: parseInt(formData.get('capacidade')),
                    status: formData.get('status')
                };
                
                // Validar campos obrigatórios
                if (!veiculo.placa || !veiculo.modelo || !veiculo.marca || !veiculo.ano || !veiculo.capacidade) {
                    throw new Error('Por favor, preencha todos os campos obrigatórios');
                }
                
                const id = formData.get('id');
                if (id) {
                    await window.VeiculosAPI.atualizar(id, veiculo);
                } else {
                    await window.VeiculosAPI.adicionar(veiculo);
                }
                
                modal.hide();
                form.reset();
                await window.loadVeiculos();
            } catch (error) {
                console.error('Erro ao salvar veículo:', error);
                alert('Erro ao salvar veículo: ' + error.message);
            }
        });

        // Limpar formulário ao fechar modal
        document.getElementById('veiculoModal').addEventListener('hidden.bs.modal', () => {
            form.reset();
            document.getElementById('veiculoId').value = '';
            document.getElementById('modalTitle').textContent = 'Novo Veículo';
        });
    } catch (error) {
        console.error('Erro ao inicializar página:', error);
        alert('Erro ao carregar a página: ' + error.message);
    }
});
