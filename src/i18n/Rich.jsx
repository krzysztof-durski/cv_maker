import { Link } from 'react-router-dom'
import { parseInline } from './inline.js'

const isExternal = href => /^https?:\/\//.test(href)

/** Translated text with **bold**, *italic*, `code` and [links](address) turned into elements. */
export default function Rich({ text, codeClassName }) {
  return parseInline(text).map((part, i) => {
    switch (part.type) {
      case 'bold': return <strong key={i}>{part.text}</strong>
      case 'italic': return <em key={i}>{part.text}</em>
      case 'code': return <code key={i} className={codeClassName}>{part.text}</code>
      case 'link':
        if (part.href.startsWith('/')) return <Link key={i} to={part.href}>{part.text}</Link>
        return (
          <a key={i} href={part.href} {...(isExternal(part.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {part.text}
          </a>
        )
      default: return part.text
    }
  })
}
