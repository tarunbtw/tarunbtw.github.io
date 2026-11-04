import { useEffect, useRef, useState } from 'react'
import {
  type GitHubCell,
  type GitHubWeek,
  GITHUB_WEEKS,
  GITHUB_TOTAL,
  GITHUB_USERNAME,
} from '../data/github'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function GitHubGraph() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const [weeks, setWeeks] = useState<GitHubWeek[]>(GITHUB_WEEKS)
  const [total, setTotal] = useState<string>(GITHUB_TOTAL)
  const [tipState, setTipState] = useState<{
    text: string
    left: number
    top: number
    visible: boolean
  }>({ text: '', left: 0, top: 0, visible: false })

  useEffect(() => {
    let active = true
    fetch(`https://gh-calendar.rschristian.dev/user/${GITHUB_USERNAME}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: {
        total?: number
        contributions?: Array<Array<{ date: string; intensity: string; count: number }>>
      } | null) => {
        if (!active || !data?.contributions?.length) return
        const parsed: GitHubWeek[] = data.contributions.map((week, idx) => {
          const firstDay = idx === 0 && week[0]?.date ? new Date(`${week[0].date}T12:00:00Z`).getUTCDay() : 0
          const cells: GitHubCell[] = Array.from({ length: firstDay }, () => ({
            empty: true,
            level: 0,
            tip: '',
          }))
          for (const day of week) {
            const [, m, d] = day.date.split('-').map(Number)
            const count = Number(day.count) || 0
            const dateStr = `${MONTHS[m - 1]} ${d}`
            cells.push({
              empty: false,
              level: Math.min(4, Math.max(0, Number(day.intensity) || 0)),
              tip: count === 0 ? `No contributions on ${dateStr}` : `${count} contribution${count === 1 ? '' : 's'} on ${dateStr}`,
            })
          }
          while (cells.length < 7) {
            cells.push({ empty: true, level: 0, tip: '' })
          }
          return { week: idx, cells }
        })

        setWeeks(parsed)
        if (typeof data.total === 'number') {
          setTotal(`${data.total.toLocaleString()} contributions in the last year`)
        }
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
        }
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    scrollEl.scrollLeft = scrollEl.scrollWidth

    const io = new IntersectionObserver(
      (entries, observer) => {
        if (entries[0].isIntersecting) {
          scrollEl.classList.add('seen')
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    io.observe(scrollEl)

    return () => io.disconnect()
  }, [])

  const handlePointerOver = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('[data-tip]') as HTMLElement
    if (!target) {
      setTipState((prev) => ({ ...prev, visible: false }))
      return
    }
    const rect = target.getBoundingClientRect()
    setTipState({
      text: target.dataset.tip || '',
      left: rect.left + rect.width / 2,
      top: rect.top,
      visible: true,
    })
  }

  const handlePointerLeave = () => {
    setTipState((prev) => ({ ...prev, visible: false }))
  }

  const handleScroll = () => {
    setTipState((prev) => ({ ...prev, visible: false }))
  }

  return (
    <section className="section" id="github">
      <div className="head">
        <h2 className="section-title">GitHub</h2>
        <a
          className="total"
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {total}
        </a>
      </div>
      <div
        ref={scrollRef}
        className="scroll"
        data-cg
        onPointerOver={handlePointerOver}
        onPointerLeave={handlePointerLeave}
        onScroll={handleScroll}
      >
        <div
          className="grid"
          style={{ '--weeks': weeks.length } as React.CSSProperties}
        >
          {weeks.map((week) => (
            <div
              key={week.week}
              className="week"
              style={{ '--w': week.week } as React.CSSProperties}
            >
              {week.cells.map((cell, idx) => (
                <span
                  key={idx}
                  className={`cell ${cell.empty ? 'empty' : ''}`}
                  data-l={!cell.empty ? cell.level : undefined}
                  data-tip={cell.tip || undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div
        ref={tipRef}
        className={`tip ${tipState.visible ? 'on' : ''}`}
        style={{
          left: `${tipState.left}px`,
          top: `${tipState.top}px`,
        }}
        aria-hidden="true"
      >
        {tipState.text}
      </div>
    </section>
  )
}
