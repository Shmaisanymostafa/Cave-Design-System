import { Marked } from 'marked';

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function slug(text) {
  return String(text)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

// Raw HTML in the source files is shown as text, never run: the pages are generated from files others can edit.
const marked = new Marked({
  gfm: true,
  renderer: {
    html({ text }) {
      return esc(text);
    },
  },
});

export function md(source) {
  let html = marked.parse(source);
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, level, inner) => `<h${level} id="${slug(inner)}">${inner}</h${level}>`);
  html = html.replace(/<table>/g, '<div class="tbl-wrap"><table>').replace(/<\/table>/g, '</table></div>');
  return html;
}

export function inline(source) {
  return marked.parseInline(source);
}

// Split markdown at its "## " headings. `intro` is everything before the first one.
export function sections(source) {
  const parts = source.split(/^## /m);
  const intro = parts.shift().trim();
  const map = new Map();
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const title = part.slice(0, nl).trim();
    map.set(title, part.slice(nl + 1).trim());
  }
  return { intro, map };
}

// First paragraph and the rest.
export function leadAndRest(source) {
  const [first, ...rest] = source.trim().split(/\n\s*\n/);
  return { lead: first, rest: rest.join('\n\n') };
}
