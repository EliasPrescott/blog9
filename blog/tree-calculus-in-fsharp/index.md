---
title: "Tree Calculus in F#"
date: "2026-10-06"
tags:
- programming
- f#
---

I recently found [tree calculus](https://treecalcul.us/), which was discovered by Barry Jay.
It is a very interesting model of computation that is fairly easy to implement.
The linked website has some example implementations [here](https://treecalcul.us/implementation/).
The OCaml example is a good launching-off point, but it makes some changes and encodes boolean values differently than how they are implemented in Jay's book: [Reflective Programs in Tree Calculus](https://github.com/barry-jay-personal/tree-calculus/blob/master/tree_book.pdf).
When you first get started, I would recommend following the book as closely as possible until you understand the basic ideas.

My big "A-ha" moment with tree calculus was when I realized that the application of a non-fork value (e.g. `Leaf` or `Stem a`) simply implies grafting the other value onto your first value.
So, `△△` (or `apply Leaf Leaf`) is the application of one leaf node onto another.
The result of this application is `Stem Leaf`, which is written as the original application `△△`.
This sounds obvious now, but I was stumped when I first saw `KI` or the application of combinator K with combinator I.
I was stuck because I didn't fully understand that application is essentially the only operation required for tree calculus.
This one operation is used to build the tree values, and also to "evaluate" them once they are fully built.
I am grossly oversimplifying it, you'll have to read through the book to fully appreciate how it works.

Once I understood the basics, I got all the basic combinators working and I implemented numbers and strings using the same methods as the book.
I was thinking that I could use tree calculus for a programming "simulation" game where you program machines to accomplish some tasks around your fictional office.
I've made multiple prototypes of this game using custom Lisp-y stack machines, but I have never gotten very far because making a fully custom language and programming environment is a lot of work.

Here is my implementation in F#.

```fsharp
type Tree =
    | Leaf
    | Stem of Tree
    | Fork of Tree * Tree

let rec apply a b =
    match a with
    | Leaf -> Stem b
    | Stem a -> Fork (a, b)
    // rule K
    | Fork (Leaf, y) -> y
    // rule S
    | Fork (Stem x, y) -> apply (apply y b) (apply x b)
    // rule F
    | Fork (Fork (w, x), _y) -> apply (apply b w) x

// Combinators
module C =
    let K = Stem Leaf
    let I = Fork (K, K)
    let D = Fork (K, Fork (Leaf, Leaf))
    let Dx x = Stem (Stem x)

// Booleans
module B =
    let True = C.K
    let False = apply C.K C.I
    let And = C.Dx (apply C.K (apply C.K C.I))
    let Or = apply (C.Dx (apply C.K C.K)) C.I
    let Implies = C.Dx (apply C.K C.K) 
    let Not = apply Implies (apply (C.Dx (apply C.K (apply C.K C.I))) C.I)
    let Iff = Fork (apply (Stem C.I) Not, Leaf)

// Pairs
module P =
    let Pair x y = Fork (x, y)
    let first p = apply (Fork (p, Leaf)) C.K
    let second p = apply (Fork (p, Leaf)) (apply C.K C.I)

let rec applyMultiple n a b =
    assert (n >= 0)
    if n = 0 then b
    else apply a (applyMultiple (n-1) a b)

// Integers
module N =
    open System
    let zero = Leaf
    let make k = applyMultiple k C.K Leaf
    let one = make 1
    let isZero = apply (C.Dx (applyMultiple 4 C.K C.I)) (apply (C.Dx (apply C.K C.K)) Leaf)
    let rec treeToInt t =
        match t with
        | Leaf -> 0
        | Fork (Leaf, rst) -> 1 + treeToInt rst
        | _ -> raise (new NotImplementedException())

let query is0 is1 is2 = apply (C.Dx (apply C.K is1)) (apply (C.Dx (applyMultiple 2 C.K C.I)) (apply (C.Dx (applyMultiple 5 C.K is2)) (apply (C.Dx (applyMultiple 3 C.K is0)) Leaf)))
let isLeaf = query C.K (apply C.K C.I) (apply C.K C.I)
let isStem = query (apply C.K C.I) C.K (apply C.K C.I)
let isFork = query (apply C.K C.I) (apply C.K C.I) C.K

// Lists
module L =
    open System
    let empty = Leaf
    let cons head tail = Fork (head, tail)
    let rec make lst =
        match lst with
        | [] -> Leaf
        | hd :: rst -> cons (Stem hd) (make rst)
    let rec nth n t =
        assert (n >= 0)
        match n with
        | 0 ->
            match P.first t with
            | Stem t -> t
            | _ -> raise (new NotImplementedException())
        | n -> nth (n-1) (P.second t)
    let rec treeToList t =
        match t with
        | Fork (Stem hd, rst) -> hd :: treeToList rst
        | Leaf -> []
        | _ -> raise (new NotImplementedException())

// Strings
module S =
    let empty = L.empty
    let charToTree ch =
        let code = int ch
        L.make [
            N.make (code &&& 0b10000000 >>> 7)
            N.make (code &&& 0b01000000 >>> 6)
            N.make (code &&& 0b00100000 >>> 5)
            N.make (code &&& 0b00010000 >>> 4)
            N.make (code &&& 0b00001000 >>> 3)
            N.make (code &&& 0b00000100 >>> 2)
            N.make (code &&& 0b00000010 >>> 1)
            N.make (code &&& 0b00000001)
        ]
    let treeToChar t =
        let code = 
            N.treeToInt (L.nth 0 t) <<< 7 |||
            (N.treeToInt (L.nth 1 t) <<< 6) |||
            (N.treeToInt (L.nth 2 t) <<< 5) |||
            (N.treeToInt (L.nth 3 t) <<< 4) |||
            (N.treeToInt (L.nth 4 t) <<< 3) |||
            (N.treeToInt (L.nth 5 t) <<< 2) |||
            (N.treeToInt (L.nth 6 t) <<< 1) |||
            N.treeToInt (L.nth 7 t)
        char code
    let make (str: string) =
        str
        |> Seq.map charToTree
        |> List.ofSeq
        |> L.make
    let treeToString t : string =
        t
        |> L.treeToList
        |> List.map treeToChar
        |> System.String.Concat
```
