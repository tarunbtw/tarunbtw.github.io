import { Link, useLocation } from 'react-router-dom'

export function Header() {
  const location = useLocation()

  const toggleTheme = () => {
    const root = document.documentElement
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark'

    const apply = () => {
      root.dataset.theme = nextTheme
      try {
        localStorage.setItem('theme', nextTheme)
      } catch {
        // ignore storage errors
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const startViewTransition = (document as any).startViewTransition
    if (
      !startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      apply()
      return
    }

    startViewTransition.call(document, apply)
  }

  const isBlogActive = location.pathname.startsWith('/blog')

  return (
    <header className="top rise">
      <Link to="/" className="logo" aria-label="home">
        <svg
          className="toaster"
          viewBox="0 0 28 28"
          width="24"
          height="24"
          aria-hidden="true"
        >
          <g className="slice s1">
            <path d="M6.5 15V8.2A3.2 3.2 0 0 1 9.7 5h.6a3.2 3.2 0 0 1 3.2 3.2V15z"></path>
          </g>
          <g className="slice s2">
            <path d="M14.5 15V8.2A3.2 3.2 0 0 1 17.7 5h.6a3.2 3.2 0 0 1 3.2 3.2V15z"></path>
          </g>
          <rect className="body" x="3" y="12" width="22" height="12.5" rx="4"></rect>
          <circle className="face" cx="11" cy="17.2" r="1"></circle>
          <circle className="face" cx="17" cy="17.2" r="1"></circle>
          <path className="face-line" d="M12.3 20.1q1.7 1.3 3.4 0"></path>
        </svg>
      </Link>
      <nav className="nav" aria-label="primary">
        <Link
          to="/blog"
          className={isBlogActive ? 'active' : ''}
          aria-current={isBlogActive ? 'page' : undefined}
        >
          Blog
        </Link>
        <button
          className="theme"
          type="button"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          <svg
            className="sun"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
          </svg>
          <svg
            className="moon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path>
          </svg>
        </button>
      </nav>
    </header>
  )
}
