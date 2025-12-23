import { Router } from 'express';
import { AlunoController } from '../controllers/AlunoController';
import { authMiddleware, isProfessor } from '../middleware/auth';

const router = Router();
const alunoController = new AlunoController();

// Todas as rotas de alunos requerem autenticação e ser professor
router.use(authMiddleware, isProfessor);

/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: Listar todos os alunos
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite de alunos por página
 *     responses:
 *       200:
 *         description: Lista de alunos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado - apenas professores
 */
router.get('/', (req, res) => alunoController.getAll(req, res));

/**
 * @swagger
 * /alunos/{id}:
 *   get:
 *     summary: Buscar aluno por ID
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Aluno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Aluno não encontrado
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 */
router.get('/:id', (req, res) => alunoController.getById(req, res));

/**
 * @swagger
 * /alunos:
 *   post:
 *     summary: Criar novo aluno
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já cadastrado
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 */
router.post('/', (req, res) => alunoController.create(req, res));

/**
 * @swagger
 * /alunos/{id}:
 *   put:
 *     summary: Atualizar aluno
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Aluno não encontrado
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já em uso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 */
router.put('/:id', (req, res) => alunoController.update(req, res));

/**
 * @swagger
 * /alunos/{id}:
 *   delete:
 *     summary: Deletar aluno
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Aluno deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Aluno não encontrado
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 */
router.delete('/:id', (req, res) => alunoController.delete(req, res));

export default router;
