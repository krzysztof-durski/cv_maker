// A tiny inline markup for translated text, so a sentence can hold bold words, code and links and
// still be translated as one piece:  **bold**  *italic*  `code`  [text](address)
// Returns a list of parts; the Rich component turns them into elements.

const TOKEN = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/

export function parseInline(text) {
  return String(text)
    .split(TOKEN)
    .filter(part => part !== '')
    .map(part => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return { type: 'bold', text: part.slice(2, -2) }
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return { type: 'code', text: part.slice(1, -1) }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return { type: 'italic', text: part.slice(1, -1) }
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part)
      if (link) return { type: 'link', text: link[1], href: link[2] }
      return { type: 'text', text: part }
    })
}
