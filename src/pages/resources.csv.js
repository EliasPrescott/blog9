import { getCollection } from 'astro:content'

export async function GET({ params, request }) {
  const resources = await getCollection('resources')
  const data = csv(resources.map(x => [
    x.id,
    `https://australorp.dev/resources/${x.id}`,
    x.data.title,
    x.data.updated,
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
