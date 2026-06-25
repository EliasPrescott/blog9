import { getCollection } from 'astro:content'

export async function GET(_) {
  const posts = await getCollection('blog')
  const data = csv(posts.map(x => [
    x.id,
    `https://australorp.dev/blog/${x.id}`,
    x.data.title,
    x.data.date,
    x.data.tags.join(','),
    x.body,
  ]))
  return new Response(data)
}

function csv(rows) {
  const data = rows
    .map(row =>
      row.map(field => formatField(field)).join(',')
    )
  data.unshift(['id','link','title','date','tags','markdown'])
  return data.join('\n')
}

function formatField(x) {
  return `"${escape(x)}"`
}

function escape(x) {
  return x.replaceAll('"', '""')
}
