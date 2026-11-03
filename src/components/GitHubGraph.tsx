import { useEffect, useRef, useState } from 'react'
import { GITHUB_WEEKS, GITHUB_TOTAL, GITHUB_USERNAME } from '../data/github'

export function GitHubGraph() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const [tipState, setTipState] = useState<{
    text: string
    left: number
    top: number
    visible: boolean
  }>({ text: '', left: 0, top: 0, visible: false })

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
          {GITHUB_TOTAL}
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
          style={{ '--weeks': 53 } as React.CSSProperties}
        >
          {GITHUB_WEEKS.map((week) => (
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
