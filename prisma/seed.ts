import { db } from '../src/lib/db.js'

async function main() {
  console.log('Seeding database...')

  // Create sample users
  const user1 = await db.user.upsert({
    where: { email: 'admin@matkaking.com' },
    update: {},
    create: {
      email: 'admin@matkaking.com',
      name: 'Admin User',
    },
  })

  const user2 = await db.user.upsert({
    where: { email: 'player@matkaking.com' },
    update: {},
    create: {
      email: 'player@matkaking.com',
      name: 'Player One',
    },
  })

  // Create sample posts
  await db.post.upsert({
    where: { id: 'post-1' },
    update: {},
    create: {
      id: 'post-1',
      title: 'Welcome to MatkaKing',
      content: 'India\'s fastest matka platform with secure gaming experience.',
      published: true,
      authorId: user1.id,
    },
  })

  await db.post.upsert({
    where: { id: 'post-2' },
    update: {},
    create: {
      id: 'post-2',
      title: 'New Features Coming Soon',
      content: 'Stay tuned for exciting new features and improvements.',
      published: true,
      authorId: user2.id,
    },
  })

  console.log('Seeding completed!')
  console.log(`Created users: ${user1.email}, ${user2.email}`)
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
