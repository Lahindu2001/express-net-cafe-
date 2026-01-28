import { neon } from '@neondatabase/serverless'

// Use a fallback for build time when DATABASE_URL might not be available
const databaseUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432/fallback'

const sql = neon(databaseUrl)

export default sql
