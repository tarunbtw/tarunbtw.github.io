import { useState, useEffect } from 'react'
import { BannerShader } from '../components/BannerShader'
import { HoverCard } from '../components/HoverCard'
import { WorkSection } from '../components/WorkSection'
import { GitHubGraph } from '../components/GitHubGraph'
import { ProjectsSection } from '../components/ProjectsSection'
import { EarlierSection } from '../components/EarlierSection'
import { WritingSection } from '../components/WritingSection'

export function HomePage() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'Tarun'
  }, [])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('tharun30115@gmail.com')
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      // fallback
    }
  }

  return (
    <main className="stagger" style={{ '--d': '340ms' } as React.CSSProperties}>
      <section
        className="intro stagger"
        style={{ '--d': '60ms' } as React.CSSProperties}
      >
        <BannerShader />

        <div className="who">
          <img
            src="/avatar.jpg"
            alt="Tarun"
            loading="eager"
            decoding="async"
            width={176}
            height={176}
            className="avatar"
          />
          <div className="who-text">
            <h1 className="name display">Tarun</h1>
            <p className="role">
              <HoverCard triggerText="bengaluru" />, india
            </p>
          </div>
        </div>

        <p>
          backend engineer based in <HoverCard triggerText="bengaluru" />. i build
          scalable backend systems, maintain infrastructure, and work on system
          design and developer tooling.
        </p>

        <p>
          i care about low latency, minimal moving parts, and systems that stay up.
          i prefer simple, predictable architectures over clever abstractions.
        </p>

        <p>
          these days i mostly write code in{' '}
          <span className="hl">
            <svg
              className="tech-icon"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="#00ADD8"
              role="img"
              aria-label="Go"
            >
              <title>Go</title>
              <path d="M1.811 10.231c-.047-.257-.023-.491.07-.701.117-.234.328-.421.632-.562l4.898-2.221a.34.34 0 01.164-.047c.187 0 .327.14.327.327v.024a.795.795 0 01-.397.678L3.635 9.588l2.081.257c.304.047.538.257.585.561.047.28-.117.561-.398.655l-3.32 1.122 3.39.398c.304.047.538.28.562.584.023.28-.14.561-.421.655l-4.045 1.356c-.07.023-.117.023-.164.023a.62.62 0 01-.584-.444.697.697 0 01.07-.632l.935-1.496-1.403-.304c-.327-.07-.561-.327-.585-.631a.633.633 0 01.444-.655l1.029-.444-1.403-.491zm10.708 6.508c-.772-.047-1.45-.234-2.034-.585a3.832 3.832 0 01-1.45-1.636 5.342 5.342 0 01-.514-2.385c0-.982.187-1.847.561-2.595.374-.748.912-1.332 1.613-1.753.702-.421 1.543-.631 2.525-.631.912 0 1.683.187 2.314.561.631.374 1.11.888 1.438 1.543.327.655.491 1.414.491 2.279v.655H11.23c.047.912.351 1.613.912 2.104.561.491 1.286.725 2.174.725.655 0 1.216-.117 1.683-.351.468-.234.842-.584 1.123-1.052.07-.117.187-.21.327-.257a.555.555 0 01.491.07c.187.117.28.304.28.538a.633.633 0 01-.14.398 4.223 4.223 0 01-1.683 1.426c-.725.351-1.59.526-2.595.526zm-.117-7.854c-.655 0-1.216.21-1.683.631-.468.421-.748.982-.842 1.683h4.863c-.023-.748-.257-1.332-.701-1.753-.445-.421-1.006-.561-1.637-.561zm8.019 7.854c-1.029 0-1.894-.21-2.595-.631a4.267 4.267 0 01-1.613-1.753c-.374-.748-.561-1.613-.561-2.595 0-.982.187-1.847.561-2.595.374-.748.912-1.332 1.613-1.753.701-.421 1.566-.631 2.595-.631.982 0 1.824.21 2.525.631.701.421 1.239 1.005 1.613 1.753.374.748.561 1.613.561 2.595 0 .982-.187 1.847-.561 2.595-.374.748-.912 1.332-1.613 1.753-.701.421-1.543.631-2.525.631zm0-1.683c.678 0 1.239-.234 1.683-.701.444-.468.666-1.146.666-2.034 0-.888-.222-1.566-.666-2.034-.444-.468-1.005-.701-1.683-.701-.678 0-1.239.234-1.683.701-.444.468-.666 1.146-.666 2.034 0 .888.222 1.566.666 2.034.444.468 1.005.701 1.683.701z"></path>
            </svg>
            Go
          </span>
          ,{' '}
          <span className="hl">
            <svg
              className="tech-icon"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="#3178C6"
              role="img"
              aria-label="TypeScript"
            >
              <title>TypeScript</title>
              <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"></path>
            </svg>
            TypeScript
          </span>{' '}
          and{' '}
          <span className="hl">
            <svg
              className="tech-icon"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="#F05138"
              role="img"
              aria-label="Swift"
            >
              <title>Swift</title>
              <path d="M7.508 0c-.287 0-.573 0-.86.002-.241.002-.483.003-.724.01-.132.003-.263.009-.395.015A9.154 9.154 0 0 0 4.348.15 5.492 5.492 0 0 0 2.85.645 5.04 5.04 0 0 0 .645 2.848c-.245.48-.4.972-.495 1.5-.093.52-.122 1.05-.136 1.576a35.2 35.2 0 0 0-.012.724C0 6.935 0 7.221 0 7.508v8.984c0 .287 0 .575.002.862.002.24.005.481.012.722.014.526.043 1.057.136 1.576.095.528.25 1.02.495 1.5a5.03 5.03 0 0 0 2.205 2.203c.48.244.97.4 1.498.495.52.093 1.05.124 1.576.138.241.007.483.009.724.01.287.002.573.002.86.002h8.984c.287 0 .573 0 .86-.002.241-.001.483-.003.724-.01a10.523 10.523 0 0 0 1.578-.138 5.322 5.322 0 0 0 1.498-.495 5.035 5.035 0 0 0 2.203-2.203c.245-.48.4-.972.495-1.5.093-.52.124-1.05.138-1.576.007-.241.009-.481.01-.722.002-.287.002-.575.002-.862V7.508c0-.287 0-.573-.002-.86a33.662 33.662 0 0 0-.01-.724 10.5 10.5 0 0 0-.138-1.576 5.328 5.328 0 0 0-.495-1.5A5.039 5.039 0 0 0 21.152.645 5.32 5.32 0 0 0 19.654.15a10.493 10.493 0 0 0-1.578-.138 34.98 34.98 0 0 0-.722-.01C17.067 0 16.779 0 16.492 0H7.508zm6.035 3.41c4.114 2.47 6.545 7.162 5.549 11.131-.024.093-.05.181-.076.272l.002.001c2.062 2.538 1.5 5.258 1.236 4.745-1.072-2.086-3.066-1.568-4.088-1.043a6.803 6.803 0 0 1-.281.158l-.02.012-.002.002c-2.115 1.123-4.957 1.205-7.812-.022a12.568 12.568 0 0 1-5.64-4.838c.649.48 1.35.902 2.097 1.252 3.019 1.414 6.051 1.311 8.197-.002C9.651 12.73 7.101 9.67 5.146 7.191a10.628 10.628 0 0 1-1.005-1.384c2.34 2.142 6.038 4.83 7.365 5.576C8.69 8.408 6.208 4.743 6.324 4.86c4.436 4.47 8.528 6.996 8.528 6.996.154.085.27.154.36.213.085-.215.16-.437.224-.668.708-2.588-.09-5.548-1.893-7.992z"></path>
            </svg>
            Swift
          </span>
          .
        </p>

        <p>
          say hi on{' '}
          <a
            className="ul"
            href="https://x.com/tarunbtw"
            target="_blank"
            rel="noopener noreferrer"
          >
            x
          </a>{' '}
          or drop a mail to{' '}
          <span className="mail">
            <a className="ul" href="mailto:tharun30115@gmail.com">
              tharun30115@gmail.com
            </a>
            <button
              className={`copy ${copied ? 'done' : ''}`}
              onClick={handleCopyEmail}
              aria-label="Copy email address"
            >
              <svg
                className="i-copy"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
              <svg
                className="i-check"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
            </button>
          </span>
        </p>
      </section>

      <WorkSection />
      <GitHubGraph />
      <ProjectsSection />
      <EarlierSection />
      <WritingSection />
    </main>
  )
}

