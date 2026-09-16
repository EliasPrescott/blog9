---
title: "Natural Primary Keys for Forum Posts"
date: "2026-09-16"
tags:
- programming
- sql
---

I have been greatly enjoying reading through the posts of [Eduardo Bellani](https://ebellani.github.io/) recently.
He talks about database design and Postgres quite a bit, and I am in a stage of my career where I am realizing that databases have already solved many of the problems that developers wrestle with day-to-day.

His post, [The principles of database design, or, the Truth is out there](https://ebellani.github.io/blog/2025/the-principles-of-database-design-or-the-truth-is-out-there/) proposes a new principle for databases: the Principle of Essential Denotation.

<figure>
  <blockquote>
    Principle of Essential Denotation (PED): A relation should be identified by a natural key that reflects the entity’s essential, domain-defined identity — not by arbitrary or surrogate values.
  </blockquote>
  <figcaption>
    <cite><a href="https://ebellani.github.io/blog/2025/the-principles-of-database-design-or-the-truth-is-out-there/">Eduardo Bellani</a></cite>
  </figcaption>
</figure>

Arbitrary or surrogate values perfectly describes the kinds of primary keys that most people give to their database tables.
It is extremely common to use an auto-incrementing integer ID column as a primary key.
Some people use random UUIDs, touting their benefits instead.
Regardless of what form they take, "artificial" primary keys are incredibly common, to the point that many people would find it shocking to suggest that you should do anything different.
Quite a few of the most popular ORMs will push you towards using artificial primary keys, and many people never question this decision.

But, Eduardo's principle intrigued me, and I have learned a lot from some of his other posts, so I thought I should consider it.

My favorite go-to example of a database schema is a forum.
I have written multiple web forums over the years, and I even hosted a couple of those forums for a group of friends and coworkers for a while.
So, it's a familiar problem space where I can knock out a basic design in a day or two.

Every forum needs to store posts of some kind.
In the past, I have written a posts table in my database like so:

```sql
create table post (
  id int primary key generated always as identity,
  title text not null,
  created_at timestamptz not null default now()
);

insert into post (title)
values ('Welcome to the Forum!');

select id, title from post;
```

```
 id |         title         
----+-----------------------
  1 | Welcome to the Forum!
```

[Identity Columns](https://www.postgresql.org/docs/current/ddl-identity-columns.html) are typically the recommended way of getting auto-incrementing integers in Postgres.
This approach works well and is extremely common.

But this `id` column is completely artificial.
Its value doesn't reflect any aspect of the post it represents.
The only reality it reflects is the insertion order of the posts relative to each other.
That piece of data can be interesting, but it is not typically important to the business domain (and it is redundant since I added the `created_at` column).

So, how could we eliminate the artificial ID column while still providing some way of uniquely referring to the post?

Well, if you wrote a post and you had to tell someone else about it, how would you identify it in casual conversation?
You would probably start with the title.
If I wrote a post titled "Natural Primary Keys for Forum Posts", then I would use that title to *identify* which post I was talking about.
And if I wrote a post title that is likely to conflict with other posts (e.g. "Lunch poll! 🌮"), then I would specify the time at which I created the post to help disambiguate which post I was referring to.

So, thinking informally, title and creation date are the natural choices for primary keys of a post.

Now, we are talking about information systems and designing a database schema for a website.
We don't share post titles when we want someone else to look at a post we made online, we share *links*.
Hyperlinks embed information to identify the specific page or resource they indicate.
So, if the post title and creation date are our natural candidates for a primary key, how would we best embed them in a hyperlink?

We don't want to put the title straight in the link because it could contain arbitrary user input (barring any application-side validation).
So, we clean up the title a bit, removing any characters that don't play nice in URLs.
And to disambiguate multiple posts with the same title, we can pretty up the creation timestamp and tack that on to the end of the title.

Here is my second take on this problem, taking into account Eduardo's Principle of Essential Denotation:

```sql
create schema forum;

create domain forum.post_title as text
  check (regexp_count(value, '[a-z0-9]', 1, 'i') between 5 and 100);
```

Creating a domain to represent post titles adds some type safety to the functions and tables I am about to write, but more importantly, it allows me to define my validation rule for post titles in a single place.
I am asserting that post titles should have between 5 and 100 alphanumeric characters in them.
These are the only characters I am interested in displaying in the URL for the post, so I use the validation to ensure I have a reasonable number of them available.
If you were writing a real application, you would want other constraints to validate the maximum length of the value overall, but I'm not worrying about that here.

And if you wanted to support multiple languages in your forum (好主意), you should use `\w` instead of `a-z` in your regex.

```sql
create function forum.url_format_post_title(title forum.post_title)
returns text language sql immutable strict as $$
  select trim(
    lower(
      regexp_replace(
        regexp_replace(title, '[^a-z0-9]', '-', 'gi'),
        '-+', '-', 'g')
      ),
    '-'
  )
$$;
```

Here is the core logic of how I can format post titles to look nice in URLs.
Anything that isn't an alphanumeric character gets converted into a dash.
Then, I collapse sequences of dashes into a single dash, then I convert everything to lowercase and trim any dashes off the ends.

```sql
create function forum.prettify_timestamp(ts timestamptz)
returns text language sql immutable strict as $$
  select to_hex(trunc(extract(epoch from ts) * 1000000)::bigint)
$$;
```

Here is my method for making timestamps look pretty.
Hex encoding is not the most compact.
You could probably get better looking timestamps by increasing the character allowance.
Something like [base-36](https://en.wikipedia.org/wiki/Base36) instead of base-16?
But that would be a rabbit hole, so I'm leaving it for a future blog post.

```sql
create function forum.create_post_key(title forum.post_title, created_at timestamptz)
returns text language sql immutable strict as $$
  select forum.url_format_post_title(title) || '-' || forum.prettify_timestamp(created_at)
$$;
```

Here is the wrapper method that we will use to actually create our post primary keys.
We combine the two previous functions we defined and we throw a dash in the middle.

```sql
create table forum.post (
  id text primary key generated always as (forum.create_post_key(title, created_at)) stored,
  title forum.post_title not null,
  created_at timestamptz not null default now()
);
```

Here we finally reach the fruit of our labor.
We now have 100% natural primary keys that actually encode real and useful information about our posts.

I am marking the ID column as stored so it can be used in indexes (like the unique index that Postgres is making for me when I specify `primary key`).
Storing these IDs does take up some extra space, but that should be more than acceptable for most applications.

```sql
insert into forum.post (title)
values ('Welcome to the Forum!'),
  ('How to Write SQL (2026)'),
  ('Primary Keys, Indexes, and You'),
  ('Trying to ---BREAK--- the Title Validation Rules');

select id, title from forum.post;

select format('https://example.com/p/%s', id) as link from forum.post;
```

```
                            id                            |                      title                       
----------------------------------------------------------+--------------------------------------------------
 welcome-to-the-forum-65b990483fe68                       | Welcome to the Forum!
 how-to-write-sql-2026-65b990483fe68                      | How to Write SQL (2026)
 primary-keys-indexes-and-you-65b990483fe68               | Primary Keys, Indexes, and You
 trying-to-break-the-title-validation-rules-65b990483fe68 | Trying to ---BREAK--- the Title Validation Rules
(4 rows)

                                      link                                      
--------------------------------------------------------------------------------
 https://example.com/p/welcome-to-the-forum-65b990483fe68
 https://example.com/p/how-to-write-sql-2026-65b990483fe68
 https://example.com/p/primary-keys-indexes-and-you-65b990483fe68
 https://example.com/p/trying-to-break-the-title-validation-rules-65b990483fe68
 ```

I don't know about you, but I find these IDs to be very pleasant to look at.
They look very natural in the URLs, and they are functional because they embed the post titles in a readable manner.
The timestamp at the end is a touch long, but it is not overwhelming.
Like I said earlier, there are ways to compress the timestamp more if you really cared.

Another interesting benefit of putting real information in your primary keys is that it carries that information into other tables when they have a foreign key reference to your main table.
If I made a `post_comment` table for comments on a post, each comment would have a human-readable reference back to its parent post.
As an admin of the forum site, I could quickly identify the topic of the comment's parent post *without ever looking at the post!*
Putting real, domain-relevant information in your primary keys pays dividends for the comprehensibility of your systems and data.

Using posts as an example makes this concept a bit more obvious because having a good-looking public ID is important for posts in a forum.
But, I think this exact same technique could be applied to other types of data as well.

If your app has a company table, why not do the same thing?
Why should you identify Acme Corporation as Company #1 or `C-001`?
Shouldn't the ID in the database be `acme-corporation-...`?
That way you can quickly identify companies based on their ID, which is... the whole point of primary keys in the first place?

After playing with the concept for a bit, I think the Principle of Essential Denotation is a good one.
Deriving primary keys from real domain data should be the default approach, and artificial primary keys should only be a fallback option taken when necessary.
