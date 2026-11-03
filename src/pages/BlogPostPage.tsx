import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { POSTS } from '../data/posts'

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = POSTS.find((p) => p.slug === slug)

  useEffect(() => {
    if (post) {
      document.title = `${post.title} · Tharun`
    }
  }, [post])

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  return (
    <main className="stagger" style={{ '--d': '340ms' } as React.CSSProperties}>
      <article>
        <header className="head">
          <Link className="back" to="/blog">
            ← Writing
          </Link>
          <h1>{post.title}</h1>
          <p className="meta">
            <time dateTime={post.datetime}>{post.date_display}</time>
            <span> · {post.read_time}</span>
          </p>
        </header>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.content_html }}
        />
      </article>
    </main>
  )
}

