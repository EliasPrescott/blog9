import { getCollection } from 'astro:content'
import rss from '@astrojs/rss'

export async function GET(context) {
  const posts = await getCollection('blog')
  return rss({
    title: 'australorp.dev',
    description: 'My place for writing about faith, technology, and visual design.',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/blog/${post.id}`,
    })),
  })
}
