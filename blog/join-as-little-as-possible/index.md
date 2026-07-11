---
title: "Join as Little as Possible"
date: "2026-07-10"
tags:
- sql
---

Okay, that title is too strong, but I do think you should avoid one-to-many joins, *when you don't need them*.

When I am working on a new SQL view or a one-off query to get someone some data, I often have a primary table I am concerned with, and various other supplementary tables that have extra data that I need.
Let's say I have three tables that look like this:

```sql
CREATE SCHEMA example;

CREATE TABLE example.game (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  release_date TIMESTAMPTZ
);

CREATE TABLE example.developer (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  game_id int NOT NULL REFERENCES example.game(id)
);

CREATE TABLE example.mods (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  game_id int NOT NULL REFERENCES example.game(id)
);

CREATE INDEX ON example.mods (game_id);
CREATE INDEX ON example.developer (game_id);
```

We have a game table, and it has two one-to-many relationships with the developer and mods tables.
So, a game can have any number of developers and mods.

Now let's say someone wants a CSV of games that includes the list of developers for each game and the number of mods.
This is a bit annoying because it means we have to collapse a list of multiple developers into one column if we want each row of the CSV to represent a single game, but it's not too difficult:

```sql
SELECT
  g.title,
  g.release_date,
  string_agg(distinct d.name, ',') as developers,
  count(distinct m) as mod_count
FROM example.game g
JOIN example.developer d on d.game_id = g.id
JOIN example.mods m on m.game_id = g.id
GROUP BY g.id
```

This method of writing the query is often my first instinct.
You have your primary table (game), then you join against any other tables that you need information from (developer & mods).
Because the developer and mods tables are one-to-many against our game table, I had to add that `GROUP BY g.id` to ensure we have 1 row per game.

Normally, Postgres would prevent you from directly returning columns that are not in the `GROUP BY` list, but because `game.id` is in the list, Postgres is smart enough to know that `game.title` and `game.release_date` are safe to select directly as well.

You may also notice the `distinct` clauses in both aggregate functions.
Those are a sign that something is off.

But, if you think this query looks reasonable at first, then you are not alone.
To me, it feels natural.
Joins are an important part of SQL, they're the tool you use to correlate tables together.
It's obvious.
Except, they make this query _inefficient_.

When I say inefficient, I mean relatively inefficient.
At smaller table sizes and with this few joins, this query will run fine.
But there is a simpler way to write this query that completely avoids joins and the `GROUP BY`, and thus scales better as table sizes grow.
And that is by using sub-queries for each correlated piece of data that you need.

```sql
SELECT
  g.title,
  g.release_date,
  (
    SELECT string_agg(d.name, ',')
    FROM example.developer d
    WHERE d.game_id = g.id
  ) as developers,
  (
    SELECT count(m.id)
    FROM example.mods m
    WHERE m.game_id = g.id
  ) as mod_count
FROM example.game g
```

Honestly, this way of writing the query looks *worse* to me at times.
Sub-queries can look ugly when they grow larger.
They don't look as pretty as joins, but they do scale better in this case.
Let's generate some test data to confirm this.

```sql
INSERT INTO example.game (title, release_date)
SELECT
  'a game',
  now()
FROM generate_series(1, 10000);

DO $$
DECLARE
  game example.game;
BEGIN
  FOR game IN SELECT * FROM example.game LOOP
    INSERT INTO example.developer (game_id, name)
    SELECT game.id, floor(random()*10000+100)::text
    FROM generate_series(1, floor(random()*20)::int+1);

    INSERT INTO example.mods (game_id, name)
    SELECT game.id, floor(random()*10000+100)::text
    FROM generate_series(1, floor(random()*50)::int+1);
  END LOOP;
END
$$ LANGUAGE plpgsql;
```

I generated plenty of data to make the performance scaling differences more dramatic.
The first query using joins and `GROUP BY` finished in 2245ms (milliseconds) when I ran it with `EXPLAIN ANALYZE`.
The second query only took 64ms under the same conditions.

Let's look at the query plans to see why there is a difference.

```
                                                                            QUERY PLAN                                                                            
------------------------------------------------------------------------------------------------------------------------------------------------------------------
 GroupAggregate  (cost=0.88..70153.89 rows=10000 width=59) (actual time=2.314..2245.475 rows=10000 loops=1)
   Group Key: g.id
   ->  Nested Loop  (cost=0.88..49960.06 rows=2675844 width=59) (actual time=0.030..250.621 rows=2676567 loops=1)
         ->  Merge Join  (cost=0.58..4286.11 rows=104674 width=27) (actual time=0.019..15.697 rows=104674 loops=1)
               Merge Cond: (g.id = d.game_id)
               ->  Index Scan using game_pkey on game g  (cost=0.29..337.29 rows=10000 width=19) (actual time=0.007..1.359 rows=10000 loops=1)
               ->  Index Scan using developer_game_id_idx on developer d  (cost=0.29..2615.40 rows=104674 width=8) (actual time=0.009..6.363 rows=104674 loops=1)
         ->  Memoize  (cost=0.30..0.86 rows=28 width=40) (actual time=0.000..0.001 rows=26 loops=104674)
               Cache Key: d.game_id
               Cache Mode: logical
               Hits: 94674  Misses: 10000  Evictions: 0  Overflows: 0  Memory Usage: 19547kB
               ->  Index Scan using mods_game_id_idx on mods m  (cost=0.29..0.85 rows=28 width=40) (actual time=0.001..0.003 rows=26 loops=10000)
                     Index Cond: (game_id = d.game_id)
 Planning Time: 0.737 ms
 Execution Time: 2246.335 ms
(15 rows)
```

You may not be able to replicate this query plan exactly because it depends heavily on table statistics, but typically it will look something like this.
The query planner avoids a join against the mods table because we are doing a simple `count(distinct m)`, but beyond that, the query planner *cannot* do anything but some kind of join followed by a `GroupAggregate`.
It would be nearly impossible for the query planner to optimize this query into something better without potentially changing the behavior of the query.
And this plan scales so poorly because of the [Cartesian explosion](https://en.wikipedia.org/wiki/Cartesian_explosion) that results from one-to-many joins, which is then fed into an expensive grouping operation.

Now, let's look at the second query's plan.

```
                                                                      QUERY PLAN                                                                       
-------------------------------------------------------------------------------------------------------------------------------------------------------
 Seq Scan on game g  (cost=0.00..174064.00 rows=10000 width=55) (actual time=5.750..64.123 rows=10000 loops=1)
   SubPlan 1
     ->  Aggregate  (cost=8.51..8.52 rows=1 width=32) (actual time=0.002..0.002 rows=1 loops=10000)
           ->  Index Scan using developer_game_id_idx on developer d  (cost=0.29..8.48 rows=11 width=4) (actual time=0.001..0.001 rows=10 loops=10000)
                 Index Cond: (game_id = g.id)
   SubPlan 2
     ->  Aggregate  (cost=8.86..8.87 rows=1 width=8) (actual time=0.003..0.003 rows=1 loops=10000)
           ->  Index Scan using mods_game_id_idx on mods m  (cost=0.29..8.79 rows=28 width=4) (actual time=0.001..0.002 rows=26 loops=10000)
                 Index Cond: (game_id = g.id)
 Planning Time: 0.456 ms
 JIT:
   Functions: 18
   Options: Inlining false, Optimization false, Expressions true, Deforming true
   Timing: Generation 0.427 ms, Inlining 0.000 ms, Optimization 0.272 ms, Emission 5.421 ms, Total 6.120 ms
 Execution Time: 85.640 ms
(15 rows)
```

You can immediately see this query plan is simpler.
There are no joins, just a sequence scan on the game table with two aggregate sub-plans that index scan our other two tables.
It is extremely simple, which (no surprise), leads to much better performance.

I also think it's funny that the JIT turned on for this second query and not the first one.
Don't ask me why.
I tried turning JIT off and running it again, but that was slightly slower, so the query planner knew what it was doing I guess.

So to summarize, try to avoid one-to-many joins as much as possible.
If you can query data in a sub-query, generally that will result in better performance.
Maybe this is completely obvious advice to everyone else, but I wanted to write it down in case anyone else defaults to using joins when they don't need to like I do.

I am working on a new process for writing my queries.
It's still rough, but it goes something like this:

- Identify what each row represents, and use that to pick your base table and your set of inner joins:
  - Is a row a class, a game, a person?
  - Or is it a combination of things? In this case, use inner joins.
- Add all basic columns that you are directly pulling from tables to your select clause.
- Add sub-queries to pull correlated data with a different cardinality from your rows.
  - If your rows represent people and you need each person's phone numbers concatenated together in a single column, use a sub-query!
- If you need to join against tables with a different cardinality and use their columns in your where clause, your order by clause, or something similar:
  - Read about [`LATERAL` Subqueries](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-LATERAL) and consider if you can use them.
  - If all else fails, try using a normal join and adding a group by clause.
