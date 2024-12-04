-- Criar extensão para gerar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de motoristas
CREATE TABLE IF NOT EXISTS motoristas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome TEXT NOT NULL,
    cnh TEXT NOT NULL,
    categoria TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Disponivel',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Criar políticas de segurança
ALTER TABLE motoristas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso anônimo a motoristas"
ON motoristas FOR ALL
TO anon
USING (true)
WITH CHECK (true);
