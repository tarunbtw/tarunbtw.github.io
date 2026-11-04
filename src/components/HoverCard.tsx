import { useState, useRef, useEffect, type ReactNode } from 'react'

interface HoverCardProps {
  triggerText: string
  lat?: number
  lng?: number
  zoom?: number
  caption?: ReactNode
}

// Global maplibre promise cache
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let maplibrePromise: Promise<any> | null = null

function loadMapLibre() {
  if (maplibrePromise) return maplibrePromise
  maplibrePromise = new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).maplibregl) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((window as any).maplibregl)
      return
    }

    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = 'https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css'
    document.head.appendChild(css)

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.js'
    script.async = true
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((window as any).maplibregl)
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
  return maplibrePromise
}

export function HoverCard({
  triggerText,
  lat = 12.9716,
  lng = 77.5946,
  zoom = 11,
}: HoverCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [animClass, setAnimClass] = useState('')
  const [posStyle, setPosStyle] = useState<React.CSSProperties>({})

  const triggerRef = useRef<HTMLSpanElement>(null)
  const posRef = useRef<HTMLSpanElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null)
  const closeTimerRef = useRef<number | null>(null)

  const calcPos = () => {
    const trigger = triggerRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const winW = window.innerWidth
    const winH = window.innerHeight
    const cardW = 280
    const cardH = 176
    const gap = 8
    const pad = 12

    const bottomY = rect.bottom + gap
    const fitsBottom = bottomY + cardH <= winH - pad
    let top = fitsBottom ? bottomY : rect.top - gap - cardH
    top = Math.max(pad, Math.min(top, winH - pad - cardH))

    let left = rect.left + rect.width / 2 - cardW / 2
    left = Math.max(pad, Math.min(left, winW - pad - cardW))

    setPosStyle({
      position: 'fixed',
      left: `${left}px`,
      top: `${top}px`,
      width: `${cardW}px`,
      height: `${cardH}px`,
    })
  }

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    calcPos()
    setIsOpen(true)
    setAnimClass('is-show')

    // Lazy load map when first opened
    if (!mapInstanceRef.current && mapContainerRef.current) {
      loadMapLibre().then((maplibregl) => {
        if (!mapContainerRef.current) return
        const theme = document.documentElement.dataset.theme || 'dark'
        const mapStyle = `https://tiles.openfreemap.org/styles/${theme === 'dark' ? 'dark' : 'positron'}`

        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: mapStyle,
          center: [lng, lat],
          zoom: zoom,
          interactive: false,
          attributionControl: false,
          fadeDuration: 0,
        })

        const pinEl = document.createElement('span')
        pinEl.className = 'hc-pin'
        pinEl.innerHTML = '<span class="hc-ring"></span><span class="hc-dot"></span>'

        new maplibregl.Marker({ element: pinEl, anchor: 'center' })
          .setLngLat([lng, lat])
          .addTo(map)

        map.once('load', () => {
          mapContainerRef.current?.classList.add('is-ready')
        })

        const observer = new MutationObserver(() => {
          const newTheme = document.documentElement.dataset.theme || 'dark'
          map.setStyle(
            `https://tiles.openfreemap.org/styles/${newTheme === 'dark' ? 'dark' : 'positron'}`
          )
        })
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['data-theme'],
        })

        mapInstanceRef.current = map
      })
    } else if (mapInstanceRef.current) {
      requestAnimationFrame(() => {
        mapInstanceRef.current?.resize()
      })
    }
  }

  const handleMouseLeave = () => {
    closeTimerRef.current = window.setTimeout(() => {
      setAnimClass('is-hide')
      setIsOpen(false)
    }, 140)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) calcPos()
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [isOpen])

  return (
    <span
      className="hc"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={triggerRef} className="hc-trigger">
        {triggerText}
      </span>
      <span
        ref={posRef}
        className={`hc-pos ${isOpen ? 'open' : ''}`}
        style={posStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className={`hc-anim ${animClass}`} aria-hidden={!isOpen}>
          <a
            className="hc-card"
            href="https://www.google.com/maps/place/Bengaluru"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bengaluru on Google Maps"
          >
            <div ref={mapContainerRef} className="hc-map" />
          </a>
        </span>
      </span>
    </span>
  )
}
