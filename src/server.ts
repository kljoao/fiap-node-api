import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

import postsRoutes from './routes/posts';
import { ErrorHandler } from './middleware/errorHandler';
import { Database } from './config/database';
import { AppConfigManager } from './config/app';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const config = AppConfigManager.getInstance().getConfig();

// Middleware de segurança
app.use(helmet());

// Middleware de CORS
app.use(cors());

// Middleware de compressão
app.use(compression());

// Middleware de logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('combined'));
}

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rotas da API
app.use('/posts', postsRoutes);

// Rota de health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Middleware de tratamento de erros
app.use(ErrorHandler.notFound);
app.use(ErrorHandler.handle);

// Função para inicializar o servidor
async function startServer(): Promise<void> {
  try {
    // Testar conexão com o banco de dados
    const db = Database.getInstance();
    const isConnected = await db.testConnection();
    
    if (!isConnected) {
      console.error('Falha na conexão com o banco de dados');
      process.exit(1);
    }

    // Inicializar servidor
    const server = app.listen(config.port, () => {
      console.log(`🚀 Servidor rodando na porta ${config.port}`);
      console.log(`📊 Ambiente: ${config.nodeEnv}`);
      console.log(`🔗 URL: http://localhost:${config.port}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM recebido, fechando servidor...');
      server.close(() => {
        console.log('Servidor fechado');
        db.close().then(() => {
          console.log('Conexão com banco fechada');
          process.exit(0);
        });
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT recebido, fechando servidor...');
      server.close(() => {
        console.log('Servidor fechado');
        db.close().then(() => {
          console.log('Conexão com banco fechada');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    console.error('Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

// Inicializar servidor se não estiver em modo de teste
if (config.nodeEnv !== 'test') {
  startServer();
}

export default app; 