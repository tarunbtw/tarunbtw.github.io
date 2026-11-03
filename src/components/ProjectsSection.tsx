import { PROJECT_ITEMS } from '../data/portfolio'

export function ProjectsSection() {
  return (
    <section className="section" id="projects">
      <h2 className="section-title">Projects</h2>
      <ul className="rows">
        {PROJECT_ITEMS.map((item, idx) => {
          const content = (
            <>
              <span className="row-main">
                <span className="row-name">{item.name}</span>
                <span className="row-desc">{item.desc}</span>
              </span>
              <span className="row-meta icons">
                {item.svgs.map((svgHtml, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center"
                    dangerouslySetInnerHTML={{ __html: svgHtml }}
                  />
                ))}
              </span>
            </>
          )

          return (
            <li key={idx}>
              {item.href ? (
                <a
                  className="row"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              ) : (
                <div className="row">{content}</div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

