document.addEventListener('DOMContentLoaded', async () => {
    // Carregar totais
    async function loadDashboardData() {
        try {
            // Carregar total de veículos
            const { data: veiculos, error: veiculosError } = await window.supabase
                .from('veiculos')
                .select('count', { count: 'exact' });
            
            if (veiculosError) throw veiculosError;
            document.getElementById('totalVeiculos').textContent = `Total: ${veiculos[0].count}`;

            // Carregar total de motoristas
            const { data: motoristas, error: motoristasError } = await window.supabase
                .from('motoristas')
                .select('count', { count: 'exact' });
            
            if (motoristasError) throw motoristasError;
            document.getElementById('totalMotoristas').textContent = `Total: ${motoristas[0].count}`;

            // Carregar total de rotas
            const { data: rotas, error: rotasError } = await window.supabase
                .from('rotas')
                .select('count', { count: 'exact' });
            
            if (rotasError) throw rotasError;
            document.getElementById('totalRotas').textContent = `Total: ${rotas[0].count}`;

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Erro ao carregar dados do dashboard');
        }
    }

    // Botão de logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            const { error } = await window.supabase.auth.signOut();
            if (error) throw error;
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            alert('Erro ao fazer logout');
        }
    });

    // Carregar dados iniciais
    loadDashboardData();
});
