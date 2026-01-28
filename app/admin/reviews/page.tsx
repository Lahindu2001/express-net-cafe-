import sql from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { ReviewActions } from "@/components/review-actions"

async function getReviews() {
  try {
    const reviews = await sql`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.is_approved,
        r.created_at,
        u.name as user_name,
        u.email as user_email
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.is_approved ASC, r.created_at DESC
    `
    return reviews
  } catch {
    return []
  }
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews()
  
  const pendingReviews = reviews.filter(r => !r.is_approved)
  const approvedReviews = reviews.filter(r => r.is_approved)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>

      {pendingReviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Pending Approval
            <Badge variant="secondary">{pendingReviews.length}</Badge>
          </h2>
          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <Card key={review.id} className="border-yellow-200 bg-yellow-50/50">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{review.user_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{review.user_email}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{review.comment || "No comment"}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                    <ReviewActions id={review.id} isApproved={review.is_approved} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Approved Reviews
          {approvedReviews.length > 0 && (
            <Badge variant="outline" className="ml-2">{approvedReviews.length}</Badge>
          )}
        </h2>
        {approvedReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No approved reviews yet
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {approvedReviews.map((review) => (
              <Card key={review.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{review.user_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{review.user_email}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{review.comment || "No comment"}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                    <ReviewActions id={review.id} isApproved={review.is_approved} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
