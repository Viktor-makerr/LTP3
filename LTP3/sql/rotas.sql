-- Criar extensão para gerar UUIDs (caso ainda não exista)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de rotas
CREATE TABLE IF NOT EXISTS rotas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    origem TEXT NOT NULL,
    destino TEXT NOT NULL,
    motorista_id UUID REFERENCES motoristas(id),
    veiculo_id UUID REFERENCES veiculos(id),
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Criar políticas de segurança
ALTER TABLE rotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso anônimo a rotas"
ON rotas FOR ALL
TO anon
USING (true)
WITH CHECK (true);
