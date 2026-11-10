import { Link } from 'react-router-dom'
import { POSTS } from '../data/posts'

export function WritingSection() {
  const homePosts = POSTS.filter((post) => !post.hide_from_home)

  return (
    <section className="section" id="blog">
      <h2 className="section-title">Blog</h2>
      <ul className="rows">
        {homePosts.map((post) => (
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

