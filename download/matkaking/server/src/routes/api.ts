import { Router, Request, Response } from 'express'
import prisma from '../config/database.js'

const router = Router()

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'matkaking-api',
    version: '1.0.0',
  })
})

// Get all users
router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Get user by ID
router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { posts: true },
    })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// Create user
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }
    const user = await prisma.user.create({
      data: { email, name },
    })
    res.status(201).json(user)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' })
    }
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// Get all posts
router.get('/posts', async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

// Create post
router.post('/posts', async (req: Request, res: Response) => {
  try {
    const { title, content, published, authorId } = req.body
    if (!title || !authorId) {
      return res.status(400).json({ error: 'Title and authorId are required' })
    }
    const post = await prisma.post.create({
      data: { title, content, published: published ?? false, authorId },
      include: { author: true },
    })
    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' })
  }
})

export default router
