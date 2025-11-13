export const runtime = 'edge'

export async function GET() {
  try {
    const res = await fetch('https://hn.algolia.com/api/v1/search?query=ai&tags=story&hitsPerPage=5', { cache: 'no-store' })
    const json = await res.json()
    const items = (json.hits || []).map((h: any) => ({ title: h.title, url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}` }))
    return new Response(JSON.stringify({ items }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ items: [] }), { headers: { 'Content-Type': 'application/json' } })
  }
}
