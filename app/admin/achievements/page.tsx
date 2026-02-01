import sql from "@/lib/db"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Award } from "lucide-react"
import { AchievementActions } from "@/components/achievement-actions"

export default async function AdminAchievementsPage() {
  let achievements: any[] = []

  try {
    achievements = await sql`
      SELECT * FROM achievements ORDER BY created_at DESC
    `
  } catch (error) {
    console.error("Failed to fetch achievements:", error)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Achievements & Awards</h1>
          <p className="text-muted-foreground">Manage your achievements and awards</p>
        </div>
        <Button asChild>
          <Link href="/admin/achievements/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </Link>
        </Button>
      </div>

      {achievements.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No achievements yet</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first achievement</p>
            <Button asChild>
              <Link href="/admin/achievements/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Achievement
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Achievements ({achievements.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">Image</th>
                    <th className="text-left py-2 px-2 font-medium">Title</th>
                    <th className="text-left py-2 px-2 font-medium">Description</th>
                    <th className="text-center py-2 px-2 font-medium">Year</th>
                    <th className="text-right py-2 px-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {achievements.map((achievement) => (
                    <tr key={achievement.id} className="border-b last:border-0">
                      <td className="py-2 px-2">
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center overflow-hidden">
                          {achievement.image_url ? (
                            <Image
                              src={achievement.image_url}
                              alt={achievement.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Award className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-2 font-medium">{achievement.title}</td>
                      <td className="py-2 px-2 text-muted-foreground text-sm max-w-md truncate">
                        {achievement.description || "-"}
                      </td>
                      <td className="py-2 px-2 text-center font-semibold text-primary">
                        {achievement.year}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <AchievementActions 
                          id={achievement.id}
                          title={achievement.title}
                          description={achievement.description}
                          year={achievement.year}
                          imageUrl={achievement.image_url}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
