---
title: "Programming"
updated: "2026-04-27"
---

This is a collection of resources on the topic of programming.
I will continually update this page as I find more resources that I like.

### Documentation Shortcuts

- [GNU Bash](https://www.gnu.org/software/bash/manual/)
  - [Looping Constructs](https://www.gnu.org/software/bash/manual/bash.html#Looping-Constructs)
  - [Shell Parameter Expansion](https://www.gnu.org/software/bash/manual/bash.html#Shell-Parameter-Expansion)
- [Nix Flakes](https://nixos.wiki/wiki/Flakes)
  - [Flake Schema](https://nixos.wiki/wiki/Flakes#Flake_schema)
- [Odin](https://odin-lang.org/docs/overview/)
  - [string type conversions](https://odin-lang.org/docs/overview/#string-type-conversions)
- [Postgres](https://www.postgresql.org/docs/)
  - [JSON Functions and Operators](https://www.postgresql.org/docs/current/functions-json.html)
  - [PL/pgSQL - SQL Procedural Language](https://www.postgresql.org/docs/current/plpgsql.html)
    - PL/pgSQL is very useful for writing complex migrations or pushing business logic into your database.
  - [Postgres Wiki](https://wiki.postgresql.org/wiki/Main_Page)
    - [Don't Do This (Common Postgres Mistakes)](https://wiki.postgresql.org/wiki/Don%27t_Do_This)
  - [Window Function Calls](https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS)
    - Windowing in SQL is great for analytical queries and it offers more options for whenever basic `GROUP BY`s and aggregate functions break down.
  - [psql (PostgreSQL interactive terminal)](https://www.postgresql.org/docs/current/app-psql.html)
    - A few psql tricks (`\i` to run SQL from a local file, `\o` to route output to a local file, `\copy` for... copying) can go a long way.
    - If you use [vim-dadbod](https://github.com/tpope/vim-dadbod) to connect to Postgres from Vim/NeoVim, all the features in psql are suddenly available directly in your editor.

---

### Software Design

#### Videos

- [Simple Made Easy - Rich Hickey (2011)](https://youtu.be/SxdOUGdseq4)

#### Essays

- [Codin' Dirty - Carson Gross (2024)](https://htmx.org/essays/codin-dirty)
- [Grug Brain Developer - Carson Gross (2022)](https://grugbrain.dev/)
- [Pragmatism in Programming Proverbs - Ginger Bill (2020)](https://www.gingerbill.org/article/2020/05/31/programming-pragmatist-proverbs/)
- [Semantic Compression - Casey Muratori (2014)](https://caseymuratori.com/blog_0015)

#### Books

- A Philosophy of Software Design - John Ousterhout (2018)
- The Mythical Man Month - Fred Brooks (1975)
- [The Architecture of Open Source Applications - Edited by Amy Brown & Greg Wilson](https://aosabook.org/en/)

---

### Quotes

#### On Complexity

<figure>
    <blockquote>
    The competent programmer is fully aware of the strictly limited size of his own skull; therefore he approaches the programming task in full humility, and among other things he avoids clever tricks like the plague.
    </blockquote>
    <blockquote>
        Simplicity is prerequisite for reliability.
    </blockquote>
    <figcaption>
        <cite><a href="https://en.wikiquote.org/wiki/Edsger_W._Dijkstra">Edsger Dijkstra</a></cite>
    </figcaption>
</figure>

<figure>
    <blockquote>
    There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies. The first method is far more difficult.
    </blockquote>
    <figcaption>
        <cite><a href="https://en.wikiquote.org/wiki/C._A._R._Hoare">Tony Hoare</a></cite>
    </figcaption>
</figure>
