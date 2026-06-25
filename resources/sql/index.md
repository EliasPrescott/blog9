---
title: "SQL"
updated: "2026-06-25"
tags:
- sql
- programming
---

### Websites

- [modern-sql.com — Markus Winand](https://modern-sql.com)
  - [Literate SQL](https://modern-sql.com/use-case/literate-sql)
  - [Pivot — Rows to Columns](https://modern-sql.com/use-case/pivot)
  - [Structured Primary Keys](https://modern-sql.com/blog/2026-06/structured-primary-keys)
- [Postgres Weekly](https://postgresweekly.com/)
- [Use the Index, Luke! — Markus Winand](https://use-the-index-luke.com/) (also available as [SQL Performance Explained](https://sql-performance-explained.com/))
- [www.craigkerstiens.com — Craig Kerstiens](https://www.craigkerstiens.com/)
  - [Postgres Dollar Quoting](https://www.craigkerstiens.com/2013/08/02/postgres-dollar-quoting/)
  - [Postgres hidden gems](https://www.craigkerstiens.com/2018/01/31/postgres-hidden-gems/)

### Books

- Database in Depth — C.J. Date
- SQL for Smarties — Joe Celko
- [SQL Performance Explained — Markus Winand](https://sql-performance-explained.com/)

### Documentation

- [Postgres](https://www.postgresql.org/docs/)
  - [JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html)
  - [PL/pgSQL — SQL Procedural Language](https://www.postgresql.org/docs/current/plpgsql.html)
    - PL/pgSQL is very useful for writing complex migrations or pushing business logic into your database.
  - [Postgres Wiki](https://wiki.postgresql.org/wiki/Main_Page)
    - [Don't Do This (Common Postgres Mistakes)](https://wiki.postgresql.org/wiki/Don%27t_Do_This)
  - [Window Function Calls](https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS)
    - Windowing in SQL is great for analytical queries and it offers more options for whenever basic `GROUP BY`s and aggregate functions break down.
  - [psql (PostgreSQL interactive terminal)](https://www.postgresql.org/docs/current/app-psql.html)
    - A few psql tricks (`\i` to run SQL from a local file, `\o` to route output to a local file, `\copy` for... copying) can go a long way.
    - If you use [vim-dadbod](https://github.com/tpope/vim-dadbod) to connect to Postgres from Vim/NeoVim, all the features in psql are suddenly available directly in your editor.
