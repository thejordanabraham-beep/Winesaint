/**
 * Wine Saint Certified — Minimal Markdown → Lexical converter.
 *
 * Builds a `SerializedEditorState`-shaped JSON tree compatible with Payload's
 * Lexical richText field. Handles paragraphs, headings (## ###), bullet/numbered
 * lists, bold (**), italic (*), and basic blockquotes.
 *
 * Why not use @payloadcms/richtext-lexical's `convertMarkdownToLexical`?
 * That function requires a sanitized editor config from a running Payload
 * instance — overkill for a CLI importer. The output here matches Payload's
 * default Lexical schema closely enough for v1; richer formatting can be
 * applied in the admin during the editorial review pass.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export type LexicalNode = any

interface InlineToken {
  text: string
  format: number // bitfield: 1=bold, 2=italic
}

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2

function makeTextNode(text: string, format: number = 0): LexicalNode {
  return {
    type: 'text',
    version: 1,
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
  }
}

/**
 * Parse inline markdown formatting (bold via double-asterisk, italic via
 * single-asterisk) into a flat list of text tokens with format bitflags.
 */
function parseInline(line: string): InlineToken[] {
  const tokens: InlineToken[] = []
  let format = 0
  let buf = ''

  const flush = () => {
    if (buf.length > 0) {
      tokens.push({ text: buf, format })
      buf = ''
    }
  }

  let i = 0
  while (i < line.length) {
    // Bold: ** (two consecutive asterisks)
    if (line[i] === '*' && line[i + 1] === '*') {
      flush()
      format ^= FORMAT_BOLD
      i += 2
      continue
    }
    // Italic: single * (but not part of ** which we already handled)
    if (line[i] === '*') {
      flush()
      format ^= FORMAT_ITALIC
      i += 1
      continue
    }
    buf += line[i]
    i += 1
  }
  flush()
  return tokens
}

function inlineToLexicalChildren(line: string): LexicalNode[] {
  return parseInline(line)
    .filter((t) => t.text.length > 0)
    .map((t) => makeTextNode(t.text, t.format))
}

function paragraph(children: LexicalNode[]): LexicalNode {
  return {
    type: 'paragraph',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    textStyle: '',
    children,
  }
}

function heading(tag: 'h2' | 'h3' | 'h4', children: LexicalNode[]): LexicalNode {
  return {
    type: 'heading',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    tag,
    children,
  }
}

function listItem(children: LexicalNode[], value: number): LexicalNode {
  return {
    type: 'listitem',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    value,
    children,
  }
}

function list(listType: 'bullet' | 'number', items: LexicalNode[]): LexicalNode {
  return {
    type: 'list',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    listType,
    start: 1,
    tag: listType === 'bullet' ? 'ul' : 'ol',
    children: items,
  }
}

function blockquote(children: LexicalNode[]): LexicalNode {
  return {
    type: 'quote',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    children,
  }
}

interface LexicalRoot {
  root: {
    type: 'root'
    version: 1
    direction: 'ltr'
    format: ''
    indent: 0
    children: LexicalNode[]
  }
}

/**
 * Convert a markdown string to a Lexical SerializedEditorState JSON.
 */
export function markdownToLexical(markdown: string): LexicalRoot {
  const lines = markdown.split('\n')
  const children: LexicalNode[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Skip blank lines
    if (trimmed === '') {
      i++
      continue
    }

    // --- horizontal rule (treated as a paragraph break — skip)
    if (/^-{3,}$/.test(trimmed)) {
      i++
      continue
    }

    // ## or ### heading
    const headingMatch = trimmed.match(/^(#{2,4})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const tag = (level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4') as 'h2' | 'h3' | 'h4'
      children.push(heading(tag, inlineToLexicalChildren(headingMatch[2])))
      i++
      continue
    }

    // Bullet list (- item or * item)
    if (/^[-*]\s+/.test(trimmed) && !/^[-*]{3,}$/.test(trimmed)) {
      const items: LexicalNode[] = []
      let value = 1
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        const itemText = lines[i].trim().replace(/^[-*]\s+/, '')
        items.push(listItem(inlineToLexicalChildren(itemText), value++))
        i++
      }
      children.push(list('bullet', items))
      continue
    }

    // Numbered list (1. item)
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: LexicalNode[] = []
      let value = 1
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const itemText = lines[i].trim().replace(/^\d+\.\s+/, '')
        items.push(listItem(inlineToLexicalChildren(itemText), value++))
        i++
      }
      children.push(list('number', items))
      continue
    }

    // Blockquote (> text)
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''))
        i++
      }
      children.push(blockquote(inlineToLexicalChildren(quoteLines.join(' '))))
      continue
    }

    // Default: paragraph (collect consecutive non-blank, non-special lines)
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{2,4}\s/.test(lines[i].trim()) &&
      !/^[-*]\s/.test(lines[i].trim()) &&
      !/^\d+\.\s/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('>') &&
      !/^-{3,}$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim())
      i++
    }
    if (paraLines.length > 0) {
      children.push(paragraph(inlineToLexicalChildren(paraLines.join(' '))))
    }
  }

  // Ensure at least one paragraph so Lexical doesn't render as empty root
  if (children.length === 0) {
    children.push(paragraph([makeTextNode('')]))
  }

  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      children,
    },
  }
}
