---
title: "Query this Blog with DuckDB"
date: "2026-06-25"
tags:
- programming
- duckdb
- sql
---

I wanted to have some fun with [DuckDB](https://duckdb.org/), and for some reason, I thought it would be fun to query my blog using it.
So, I added two endpoints for querying the current posts and resource pages as CSV files.
This is already enough for DuckDB, because it has CSV parsing and an HTTP client built-in:

Note: I used [`.mode html`](https://duckdb.org/docs/current/clients/cli/output_formats) in the DuckDB CLI to give me a headstart on formatting the query results.

<figure>

### Query (DuckDB CLI)

```sql
SELECT title, date, link
FROM 'https://australorp.dev/blog.csv'
ORDER BY date DESC
```

### Results

<div class="table-container">
<table id="first-result">
<tr><th>title</th>
<th>date</th>
<th>link</th>
</tr>
<tr><td>Query this Blog with DuckDB</td>
<td>2026-06-25</td>
<td>https://australorp.dev/blog/query-this-blog</td>
</tr>
<tr><td>Lists or Tables?</td>
<td>2026-06-24</td>
<td>https://australorp.dev/blog/lists-vs-tables</td>
</tr>
<tr><td>Write Game UIs like a Caveman</td>
<td>2026-06-23</td>
<td>https://australorp.dev/blog/write-game-ui-like-a-caveman</td>
</tr>
<tr><td>Being a Professional Programmer</td>
<td>2026-05-04</td>
<td>https://australorp.dev/blog/professional-programmer-talk</td>
</tr>
<tr><td>Godot Virtual Joystick</td>
<td>2026-04-22</td>
<td>https://australorp.dev/blog/godot-virtual-joystick</td>
</tr>
<tr><td>Making a Lichess TV Viewer with Hyperscript</td>
<td>2026-04-16</td>
<td>https://australorp.dev/blog/lichess-tv-hyperscript</td>
</tr>
</table>
</div>

</figure>

I love how easy DuckDB makes it to query a CSV.
Let's do one more for fun.
Let's find the largest pages by the length of their source Markdown files.

<figure>

### Query (DuckDB CLI)

```sql
WITH pages AS (
  SELECT title, markdown
  FROM 'https://australorp.dev/resources.csv'
  UNION
  SELECT title, markdown
  FROM 'https://australorp.dev/blog.csv'
)
SELECT title, length(markdown) as length
FROM pages
ORDER BY length(markdown) DESC
```

### Results

<div class="table-container">
<table id="second-result">
<tr><th>title</th>
<th>length</th>
</tr>
<tr><td>Write Game UIs like a Caveman</td>
<td>9525</td>
</tr>
<tr><td>Lists or Tables?</td>
<td>8170</td>
</tr>
<tr><td>Being a Professional Programmer</td>
<td>5817</td>
</tr>
<tr><td>Programming</td>
<td>3719</td>
</tr>
<tr><td>Query this Blog with DuckDB</td>
<td>3009</td>
</tr>
<tr><td>Web Design</td>
<td>1938</td>
</tr>
<tr><td>Romans</td>
<td>1045</td>
</tr>
<tr><td>Making a Lichess TV Viewer with Hyperscript</td>
<td>880</td>
</tr>
<tr><td>Godot Virtual Joystick</td>
<td>603</td>
</tr>
</table>
</div>

</figure>

Nice.
The length of the Markdown source is not a great way to estimate the length or reading time of the page, but it's not the worst way either.

Serving the pages as CSV files almost feels like a poor man's RSS.
Since I am using [Astro](https://astro.build), it was very easy to add.
All I had to do was make a new [static file endpoint](https://docs.astro.build/en/guides/endpoints/#static-file-endpoints) that queries my blog collection.
I wrote the CSV escaping and formatting myself because I hate adding new dependencies if I don't have to.

```js
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
```

That's all I have for now.
Go [download DuckDB](https://duckdb.org/install/) and write some queries against my blog.

<style>
  .table-container {
    overflow-x: scroll;
  }
  #first-result {
    width: max-content;
    td:nth-child(2) {
      text-align: end;
      text-wrap-mode: nowrap;
      vertical-align: top;
    }
    td:nth-child(3) {
      text-align: end;
      text-wrap-mode: nowrap;
      vertical-align: top;
    }
  }
  #second-result {
    width: max-content;
    td:nth-child(2) {
      text-align: end;
    }
  }
</style>
