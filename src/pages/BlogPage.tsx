import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { POSTS } from '../data/posts'

export function BlogPage() {
  useEffect(() => {
    document.title = 'Writing · Tarun'
  }, [])

  return (
    <main className="stagger" style={{ '--d': '340ms' } as React.CSSProperties}>
      <h1 className="title">Writing</h1>
      <p className="lede">
        notes on systems architecture, concurrency, and performance.
      </p>
      <ul className="rows list">
        {POSTS.map((post) => (
          <li key={post.slug}>
            <Link className="row" to={`/blog/${post.slug}`}>
              <span className="row-main">
                <span className="row-name">{post.title}</span>
              </span>
              <time className="row-meta" dateTime={post.datetime}>
                {post.date_display}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

