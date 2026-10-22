---
title: "Thoughts on Rich Hickey's Talk: In Context"
date: "2026-10-22"
tags:
- programming
- clojure
cover:
  path: "/src/cover-images/thoughts-on-rich-hickey-in-context/cover.png"
  alt: "placeholder"
  summary: "Defining contracts through pattern-matching"
---

Here is the YouTube link to the talk: [In Context - Rich Hickey (Clojure/Conj 2026)](https://youtu.be/P5eO7BNyJao).

### TL;DW (Too Long; Didn't Watch)

Clojure will now let you require keys in built-in pattern matching instead of them defaulting to nil.

You'll now be able to assert that keys are required/desired without actually binding them to variables.

Finally, you'll get maps representing your selection (all keys you talked about), excess (keys that were passed that you didn't talk about), and any missing keys that were required but not provided.

### Quick Thoughts

These are relatively small changes overall, but they seem good for writing more self-documenting code without needing a validation library.

I think the philosophy of rejecting named aggregate types is interesting.

I find the idea of "context-specific type-checking" very compelling (although these changes are more runtime validation instead of compile-time type-checking).

I do hate having to define hundreds of little objects in OOP languages that don't represent anything in the real world.
I shouldn't have to define a `CreatePostInfo` object just to take in three properties from a form.
I would much rather write a function that takes in a map and selects the necessary keys out of it.

So, instead of this

```csharp
class CreatePostInfo
{
    public string Title { get; set; }
    public string? Body { get; set; }
    public string? Url { get; set; }
}

Task CreatePost(CreatePostInfo info)
{
    // Do something with info
}
```

I could do this

```clojure
(defn create-post [{:keys! [title]
                    :keys  [body url]
                    :missing missing}]
 ; Do something with title, body, and url
 )
```

In this (probably incorrect, I didn't double check the key names) example, create-post would follow some error path if `(empty? missing)` was false.

If the title was missing, create-post could fail and return something to the user explaining the failure, or it could do some work to provide a default value (I think you can also provide a default value in the pattern match itself with `:or`, but that's besides the point).

Each function essentially defines an ad-hoc interface of the data it needs.

There are no named aggregate types, only contracts between function interfaces.

In a perfect world, you could write super simple Clojure web apps like this

```clojure
(defn create-post-action [{:keys! [title]
                           :keys  [body url]
                           :missing missing
                           :as form}]
 (if (empty? missing)
     (do
       ; put the record in the DB
       (let [post (db/create-post ...)]
         (post-detail-view post)))
     ; return the original page back to the user
     ; create-post-view will use the keys in missing to display error messages
     (create-post-view form missing)))
```

You don't have to name any "nouns" or intermediate objects to pass around data.

Each function defines the keys it cares about, and you hook them up accordingly.

### Conclusion

Overall, I liked the talk.

None of these changes are very complicated, but they are solid and they flow with Clojure's core philosophy very well.

Like most of Rich's talks, the underlying philosophy and approach to design is much more important than any of the technical content.

Even if you will never use Clojure, watching this talk will give you some ideas to chew on and help you think more critically about how you write programs.
