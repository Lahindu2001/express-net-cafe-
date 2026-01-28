import sql from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserActions } from "@/components/user-actions"

async function getUsers() {
  try {
    const users = await sql`
      SELECT id, name, email, phone, role, created_at
      FROM users
      ORDER BY created_at DESC
    `
    return users
  } catch {
    return []
  }
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">Name</th>
                    <th className="text-left py-2 px-2 font-medium">Email</th>
                    <th className="text-left py-2 px-2 font-medium">Phone</th>
                    <th className="text-center py-2 px-2 font-medium">Role</th>
                    <th className="text-left py-2 px-2 font-medium">Joined</th>
                    <th className="text-right py-2 px-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-2 px-2 font-medium">{user.name}</td>
                      <td className="py-2 px-2 text-muted-foreground">{user.email}</td>
                      <td className="py-2 px-2 text-muted-foreground">{user.phone || "-"}</td>
                      <td className="py-2 px-2 text-center">
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-2 px-2 text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <UserActions id={user.id} role={user.role} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
