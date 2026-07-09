import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './blog' })
})

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './resources' })
})

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './recipes' })
})

export const collections = { blog, resources, recipes }
