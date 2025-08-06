import { Router } from 'express';
import { PostController } from '../controllers/PostController';

const router = Router();
const postController = new PostController();

// GET /posts - Listar todos os posts
router.get('/', (req, res) => postController.getAllPosts(req, res));

// GET /posts/search - Buscar posts por palavra-chave
router.get('/search', (req, res) => postController.searchPosts(req, res));

// GET /posts/:id - Buscar post por ID
router.get('/:id', (req, res) => postController.getPostById(req, res));

// POST /posts - Criar novo post
router.post('/', (req, res) => postController.createPost(req, res));

// PUT /posts/:id - Atualizar post
router.put('/:id', (req, res) => postController.updatePost(req, res));

// DELETE /posts/:id - Deletar post
router.delete('/:id', (req, res) => postController.deletePost(req, res));

export default router; 