-- Script de configuração do banco de dados do Urban Drive

-- Remove tabelas existentes em ordem reversa para evitar problemas de dependência
DROP TABLE IF EXISTS rotas;
DROP TABLE IF EXISTS motoristas;
DROP TABLE IF EXISTS veiculos;

-- Cria extensão para gerar UUIDs (identificadores únicos universais)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de veículos
-- Armazena informações sobre os veículos da frota
CREATE TABLE IF NOT EXISTS veiculos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, -- Identificador único do veículo
    placa TEXT NOT NULL,                           -- Placa do veículo (obrigatório)
    modelo TEXT NOT NULL,                          -- Modelo do veículo (obrigatório)
    marca TEXT NOT NULL,                           -- Marca do veículo (obrigatório)
    ano INTEGER NOT NULL,                          -- Ano de fabricação (obrigatório)
    capacidade INTEGER NOT NULL DEFAULT 1,         -- Capacidade de passageiros (padrão: 1)
    status TEXT NOT NULL DEFAULT 'Disponível',     -- Status atual do veículo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) -- Data de criação do registro
);

-- Tabela de motoristas
-- Armazena informações sobre os motoristas
CREATE TABLE IF NOT EXISTS motoristas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, -- Identificador único do motorista
    nome TEXT NOT NULL,                            -- Nome completo do motorista (obrigatório)
    cnh TEXT NOT NULL,                             -- Número da CNH (obrigatório)
    categoria TEXT NOT NULL,                        -- Categoria da CNH (obrigatório)
    status TEXT NOT NULL DEFAULT 'Disponível',      -- Status atual do motorista
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) -- Data de criação do registro
);

-- Tabela de rotas
-- Armazena informações sobre as rotas realizadas
CREATE TABLE IF NOT EXISTS rotas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,  -- Identificador único da rota
    origem TEXT NOT NULL,                           -- Local de origem (obrigatório)
    destino TEXT NOT NULL,                          -- Local de destino (obrigatório)
    motorista_id UUID REFERENCES motoristas(id) ON DELETE SET NULL, -- ID do motorista (pode ser nulo se motorista for removido)
    veiculo_id UUID REFERENCES veiculos(id) ON DELETE SET NULL,    -- ID do veículo (pode ser nulo se veículo for removido)
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,                  -- Data/hora de início da rota
    status TEXT NOT NULL DEFAULT 'Pendente',                        -- Status da rota (Pendente, Em andamento, Concluída)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) -- Data de criação do registro
);

-- Desabilita RLS (Row Level Security) em todas as tabelas
-- Isso permite acesso direto às tabelas sem necessidade de políticas de segurança
ALTER TABLE veiculos DISABLE ROW LEVEL SECURITY;
ALTER TABLE motoristas DISABLE ROW LEVEL SECURITY;
ALTER TABLE rotas DISABLE ROW LEVEL SECURITY;

-- Insere dados de exemplo para testes
-- Veículos
INSERT INTO veiculos (placa, modelo, marca, ano, capacidade, status)
VALUES 
    ('ABC1234', 'Gol', 'Volkswagen', 2020, 5, 'Disponível'),
    ('XYZ5678', 'Civic', 'Honda', 2021, 5, 'Disponível');

-- Motoristas
INSERT INTO motoristas (nome, cnh, categoria, status)
VALUES 
    ('João Silva', '12345678901', 'B', 'Disponível'),
    ('Maria Santos', '98765432101', 'AB', 'Disponível');
