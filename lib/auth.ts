import { cookies } from 'next/headers'
import sql from './db'

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + process.env.PASSWORD_SALT || 'express-net-cafe-salt')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export async function createSession(userId: number): Promise<string> {
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  
  await sql`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
  `
  
  const cookieStore = await cookies()
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/'
  })
  
  return token
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value
  
  if (!token) return null
  
  const sessions = await sql`
    SELECT s.*, u.id as user_id, u.name, u.email, u.phone, u.role
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.session_token = ${token} AND s.expires_at > NOW()
  `
  
  if (sessions.length === 0) return null
  
  return {
    userId: sessions[0].user_id,
    name: sessions[0].name,
    email: sessions[0].email,
    phone: sessions[0].phone,
    role: sessions[0].role
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value
  
  if (token) {
    await sql`DELETE FROM sessions WHERE session_token = ${token}`
    cookieStore.delete('session_token')
  }
}
