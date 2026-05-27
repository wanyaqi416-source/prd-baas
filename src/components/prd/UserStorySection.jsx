import { userStories } from '../../data/prdData'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { SectionHeader } from './SectionHeader'

export function UserStorySection() {
  return (
    <section id="stories" className="space-y-5">
      <SectionHeader
        eyebrow="Product Context"
        title="用户故事"
        description="以下故事描述 MVP 中客户、Admin 和系统之间的责任边界。"
        badges={['Client', 'Admin', 'System']}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {userStories.map((story) => (
          <Card key={story.title}>
            <CardHeader>
              <CardTitle className="text-lg">{story.title}</CardTitle>
              <CardDescription>{story.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
