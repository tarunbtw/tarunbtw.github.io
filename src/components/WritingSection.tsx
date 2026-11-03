import { Link } from 'react-router-dom'
import { POSTS } from '../data/posts'

export function WritingSection() {
  return (
    <section className="section" id="writing">
      <h2 className="section-title">Writing</h2>
      <ul className="rows">
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
    </section>
  )
}

