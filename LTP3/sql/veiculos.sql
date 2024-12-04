-- Criar extensão para gerar UUIDs (caso ainda não exista)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de veículos
CREATE TABLE IF NOT EXISTS veiculos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    placa TEXT NOT NULL,
    modelo TEXT NOT NULL,
    marca TEXT NOT NULL,
    ano INTEGER NOT NULL,
    capacidade INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'Disponível',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Criar políticas de segurança
ALTER TABLE veiculos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso anônimo a veículos"
ON veiculos FOR ALL
TO anon
USING (true)
WITH CHECK (true);
