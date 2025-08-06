-- Script de inicialização do banco de dados
-- Criação da tabela posts

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    autor VARCHAR(100) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_posts_titulo ON posts USING gin(to_tsvector('portuguese', titulo));
CREATE INDEX IF NOT EXISTS idx_posts_conteudo ON posts USING gin(to_tsvector('portuguese', conteudo));
CREATE INDEX IF NOT EXISTS idx_posts_autor ON posts(autor);
CREATE INDEX IF NOT EXISTS idx_posts_data_criacao ON posts(data_criacao DESC);

-- Dados de exemplo
INSERT INTO posts (titulo, conteudo, autor) VALUES
('Bem-vindo à API de Posts', 'Esta é a primeira postagem da nossa API. Aqui você pode criar, ler, atualizar e deletar posts.', 'Sistema'),
('Como usar a API', 'Para usar a API, faça requisições HTTP para os endpoints disponíveis. A documentação completa está disponível.', 'Desenvolvedor'),
('Tecnologias utilizadas', 'Esta API foi construída com Node.js, Express, TypeScript e PostgreSQL. Também inclui Docker para containerização.', 'Desenvolvedor')
ON CONFLICT DO NOTHING;

-- Função para atualizar automaticamente a data_atualizacao
CREATE OR REPLACE FUNCTION update_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar data_atualizacao automaticamente
DROP TRIGGER IF EXISTS trigger_update_data_atualizacao ON posts;
CREATE TRIGGER trigger_update_data_atualizacao
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_data_atualizacao(); 