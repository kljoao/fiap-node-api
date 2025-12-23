import { Router } from 'express';
import { ProfessorController } from '../controllers/ProfessorController';
import { authMiddleware, isProfessor } from '../middleware/auth';

const router = Router();
const professorController = new ProfessorController();

// Todas as rotas de professores requerem autenticação e ser professor
router.use(authMiddleware, isProfessor);

/**
 * @swagger
 * /professores:
 *   get:
 *     summary: Listar todos os professores
 *     tags: [Professores]
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
 *         description: Limite de professores por página
 *     responses:
 *       200:
 *         description: Lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado - apenas professores
 */
router.get('/', (req, res) => professorController.getAll(req, res));

/**
 * @swagger
 * /professores/{id}:
 *   get:
 *     summary: Buscar professor por ID
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Professor encontrado
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
 *         description: Professor não encontrado
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 */
router.get('/:id', (req, res) => professorController.getById(req, res));

/**
 * @swagger
 * /professores:
 *   post:
 *     summary: Criar novo professor
 *     tags: [Professores]
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
 *         description: Professor criado com sucesso
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
router.post('/', (req, res) => professorController.create(req, res));

/**
 * @swagger
 * /professores/{id}:
 *   put:
 *     summary: Atualizar professor
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Professor atualizado com sucesso
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
 *         description: Professor não encontrado
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já em uso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 */
router.put('/:id', (req, res) => professorController.update(req, res));

/**
 * @swagger
 * /professores/{id}:
 *   delete:
 *     summary: Deletar professor
 *     tags: [Professores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Professor deletado com sucesso
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
 *         description: Professor não encontrado
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado
 */
router.delete('/:id', (req, res) => professorController.delete(req, res));

export default router;
