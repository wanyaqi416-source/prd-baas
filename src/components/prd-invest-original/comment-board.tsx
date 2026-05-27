import { useEffect, useMemo, useState } from "react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "../ui/badge"
import { Clock, MessageSquareText, Send, StickyNote, Trash2, UserRound } from "lucide-react"

type CommentItem = {
  id: string
  author: string
  section: string
  content: string
  createdAt: string
}

const storageKey = "investment-prd-comment-board"

const sectionOptions = [
  "文档概览",
  "核心规则结论",
  "产品逻辑",
  "固定收益规则",
  "收益率版本",
  "追加与提前退出",
  "到期日规则",
  "账务与审计",
  "角色权限",
  "MVP 与第二阶段",
  "第二阶段 IPO",
  "验收关注点",
  "其他",
]

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function formatNow() {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date())
}

export function CommentBoard() {
  const [author, setAuthor] = useState("未署名")
  const [section, setSection] = useState("追加与提前退出")
  const [content, setContent] = useState("")
  const [comments, setComments] = useState<CommentItem[]>([])

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as CommentItem[]
      if (Array.isArray(parsed)) {
        setComments(parsed)
      }
    } catch {
      setComments([])
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(comments))
  }, [comments])

  const latestComments = useMemo(() => comments.slice().reverse(), [comments])

  const addComment = () => {
    const nextComment: CommentItem = {
      id: createId(),
      author,
      section,
      content,
      createdAt: formatNow(),
    }

    setComments((current) => [...current, nextComment])
    setContent("")
  }

  const removeComment = (id: string) => {
    setComments((current) => current.filter((comment) => comment.id !== id))
  }

  return (
    <section id="comments" className="space-y-6">
      <div className="flex items-start gap-3">
        <span className="text-sm font-mono text-muted-foreground pt-1">15</span>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">备注与点评</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            页面内的轻量沟通区。第一版不做权限、必填和格式校验，先支持大家围绕 PRD 直接记录问题、结论和修改建议。
          </p>
        </div>
      </div>

      <Card className="p-6 border-border bg-card shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-2">
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <UserRound className="w-3.5 h-3.5" />
                  备注人
                </span>
                <Input value={author} onChange={(event) => setAuthor(event.target.value)} />
              </label>

              <label className="space-y-2">
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <StickyNote className="w-3.5 h-3.5" />
                  关联区块
                </span>
                <select
                  value={section}
                  onChange={(event) => setSection(event.target.value)}
                  className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                >
                  {sectionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-2 block">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <MessageSquareText className="w-3.5 h-3.5" />
                备注内容
              </span>
              <Textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="直接写备注、问题、结论或修改建议。"
                className="min-h-32 resize-none leading-relaxed"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={addComment} className="gap-2">
                <Send className="w-4 h-4" />
                发布点评
              </Button>
              <Button variant="outline" onClick={() => setContent("")}>
                清空输入
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">当前备注</p>
                <p className="text-xs text-muted-foreground mt-1">共 {comments.length} 条</p>
              </div>
              <Badge variant="secondary" className="font-normal">
                本地保存
              </Badge>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {latestComments.length === 0 ? (
                <div className="rounded-md border border-dashed border-border bg-background/70 p-5 text-sm text-muted-foreground">
                  还没有备注。
                </div>
              ) : (
                latestComments.map((comment) => (
                  <article key={comment.id} className="rounded-md border border-border bg-background p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-foreground break-words">{comment.author}</p>
                          <Badge variant="outline" className="font-normal">
                            {comment.section}
                          </Badge>
                        </div>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {comment.createdAt}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeComment(comment.id)}
                        aria-label="删除备注"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
                      {comment.content}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
