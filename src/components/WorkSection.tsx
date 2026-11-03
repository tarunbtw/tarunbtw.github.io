import { WORK_ITEMS } from '../data/portfolio'

export function WorkSection() {
  return (
    <section className="section" id="work">
      <h2 className="section-title">Work</h2>
      <ul className="rows">
        {WORK_ITEMS.map((item, idx) => {
          const content = (
            <>
              <span className="row-main">
                {item.img && (
                  <img
                    src={item.img}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={32}
                    height={32}
                    className="co"
                  />
                )}
                <span className="row-name">{item.name}</span>
                <span className="row-desc">{item.desc}</span>
              </span>
              <span className="row-meta">{item.meta_text}</span>
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

