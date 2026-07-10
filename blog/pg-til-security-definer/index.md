---
title: "Postgres TIL: SECURITY DEFINER"
date: "2026-06-29"
tags:
- sql
- til
- postgres
---

Today I learned about the `SECURITY INVOKER/DEFINER` clause available on Postgres functions definitions ([`CREATE FUNCTION` docs](https://www.postgresql.org/docs/current/sql-createfunction.html)).
This clause controls which set of permissions are used to execute the function, the current user's (invoker), or the owner of the function (definer).
Invoker is the default, and probably what you would want 99% of the time.

But, if you are implementing some custom authentication/authorization scheme in your database, specifying a function as `SECURITY DEFINER` is a great way to break out of the current role's permissions in a pre-defined manner.
I found it being used for this purpose in the slides from a talk on row level security.
[Here](https://postgresconf.org/system/events/document/000/000/996/pgconf_us_2019.pdf) are the slides if you want to learn more.

The create function documentation even has a section on [writing `SECURITY DEFINER` functions safely](https://www.postgresql.org/docs/current/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY) with a useful tip about restricting function access to specific users.
