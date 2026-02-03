import { neon } from '@neondatabase/serverless'

// Get database URL from environment variables
let databaseUrl = process.env.DATABASE_URL

// Check multiple environment files during development
if (!databaseUrl) {
  // Try to get from process.env directly (sometimes needed in development)
  databaseUrl = 'postgresql://neondb_owner:npg_y7eZGV2fzqTI@ep-dry-dust-ah6dnjr9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
}

// Validate that DATABASE_URL is provided and properly formatted
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

if (!databaseUrl.startsWith('postgresql://')) {
  console.error('Invalid DATABASE_URL format:', databaseUrl)
  throw new Error('DATABASE_URL must be a valid PostgreSQL connection string starting with postgresql://')
}

// Initialize the database connection with timezone configuration
const sql = neon(databaseUrl, {
  connectionTimeZone: 'Asia/Kolkata',
})

export default sql
