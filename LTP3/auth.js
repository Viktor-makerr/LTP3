const SUPABASE_URL = 'https://jtzzpgqzmahgksqzwfxm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0enpwZ3F6bWFoZ2tzcXp3ZnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NjU1MzcsImV4cCI6MjA0ODE0MTUzN30.zCYS4e88mJo45uhdFbWUkAtXds-vNaJBK1tUGFNvEPo';

// Criar cliente Supabase global
const { createClient } = supabase;
window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { data, error } = await window.supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            // Redirecionar para a página principal após o login
            window.location.href = 'dashboard.html';
        } catch (error) {
            alert('Erro ao fazer login: ' + error.message);
        }
    });
}

// Registro
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { data, error } = await window.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: name
                    }
                }
            });

            if (error) throw error;

            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            window.location.href = 'index.html';
        } catch (error) {
            alert('Erro ao fazer cadastro: ' + error.message);
        }
    });
}

// Verificar se o usuário está logado
async function checkAuth() {
    const { data: { user } } = await window.supabase.auth.getUser();
    if (!user && !window.location.href.includes('index.html') && !window.location.href.includes('register.html')) {
        window.location.href = 'index.html';
    }
}

// Executar verificação de autenticação
checkAuth();
