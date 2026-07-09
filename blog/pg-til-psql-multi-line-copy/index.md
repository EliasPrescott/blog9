---
title: "Postgres TIL: Multi-Line Copy in psql"
date: "2026-07-08"
tags:
- sql
- TIL
- postgres
---

Today I learned about a better way to copy query results into a local file from a remote Postgres database using psql.
psql has a builtin `\copy` command for doing this, but it isn't as useful as you would think due to special parser rules.
"Unlike most other meta-commands, the entire remainder of the line is always taken to be the arguments of `\copy`, and neither variable interpolation nor backquote expansion are performed in the arguments" ([psql - Postgres Docs](https://www.postgresql.org/docs/current/app-psql.html)).

The biggest restriction in practice is that you cannot wrap a multi-line query using a `\copy`.
I've run into this multiple times when trying to quickly export a query I am working on as a CSV to send to a coworker.

My revelation today comes straight from the same documentation section I quoted above:

<figure>
  <blockquote>

Another way to obtain the same result as `\copy ...` to is to use the SQL `COPY ... TO STDOUT` command and terminate it with `\g filename` or `\g |program`. Unlike `\copy`, this method allows the command to span multiple lines; also, variable interpolation and backquote expansion can be used.

  </blockquote>
  <figcaption>
    <cite><a href="https://www.postgresql.org/docs/current/app-psql.html">The PostgreSQL Global Development Group</a></cite>
  </figcaption>
</figure>

So, I can quickly wrap my SQL query like this:

<figure>

<h3>Query (tested with psql v14, Postgres v14)</h3>

```sql
copy (
  select 42 as the_answer
) to stdout
\g data.csv
```

</figure>

This is a pretty small feature, but it really comes in handy when someone needs some data right away.
Knowing the best way to copy data out of Postgres offhand means I spend less time fussing with my tools and more time focusing on writing SQL and helping people.
