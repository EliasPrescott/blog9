import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './blog' })
})

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './resources' })
})

export const collections = { blog, resources }
