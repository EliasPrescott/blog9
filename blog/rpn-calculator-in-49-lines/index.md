---
title: "Writing an RPN Calculator in 49 Lines of Code"
date: "2026-09-01"
tags:
- odin
- programming
---

[Arthur Whitney](https://en.wikipedia.org/wiki/Arthur_Whitney_(computer_scientist)) is a programmer notorious for writing code in an extremely terse style.
I've read about him a few times, but after seeing him mentioned again [here](https://ratfactor.com/cards/pl-small), I thought it would be fun to try my hand at writing in a similar style.
Here is a rudimentary [RPN](https://en.wikipedia.org/wiki/Reverse_Polish_notation) calculator implemented in a similar style to what I've heard and seen of Arthur's code.
It is loosely inspired by Forth and Arthur's K language, but I haven't implemented everything necessary yet to call it a real programming language.
I used [Odin](https://odin-lang.org/) instead of C and took a few liberties with the style, but I think it is suitably brief.

I did enjoy programming this way.
I'm not going to say it is the ultimate technique that all programmers should follow, but I would do it again.
I was able to keep more code in my head at a time and reason about it with much more confidence, probably because I could literally see all of it at all times.

For now, the code is 49 lines long.
Here it is:

```odin
package main
import"core:os";import"core:fmt";import"core:unicode/utf8";import"core:unicode";import"core:strconv";import"core:strings"
al::proc($T:typeid,a:[]T,i:int){assert(len(a)==i)}
p::fmt.print;pln::fmt.println;pf::fmt.printfln;rf::os.read_entire_file_from_path;pt::fmt.tprint;ptf::fmt.tprintf;strun::utf8.string_to_runes;runst::utf8.runes_to_string;stjoin::strings.join;ap::append;rdig::unicode.is_digit;pint::strconv.parse_int;rws::unicode.is_white_space;ril::unicode.is_letter
main::proc(){assert(len(os.args)>1);switch os.args[1]{
 case"r","run":al(string,os.args,3);fn:=os.args[2];res,err:=exef(fn);if err!=nil{pf("Error: %s",err)};stprint(res)
 case"e","exec":inp:=stjoin(os.args[2:]," ");res,err:=exest(inp);if err!=nil{pf("Error: %s",err)};stprint(res)
 case:pf("Unknown command: %s",os.args[1])
}}
exef::proc(fn:string)->(out:[]Exp,err:Err){d,e:=rf(fn,context.allocator);if e!=nil{return nil,pt(e)};exps:[dynamic]Exp;parse(string(d),&exps)or_return;return eval(exps[:])}
exest::proc(inp:string)->(out:[]Exp,err:Err){exps:[dynamic]Exp;parse(inp,&exps)or_return;return eval(exps[:])}
Ref::struct{v:string}
Exp::union{int,Ref}
St::[dynamic]Exp
Err::Maybe(string)
P::struct{i:int,chs:[]rune}
peof::proc(p:^P)->bool{return p.i>=len(p.chs)}
pws::proc(p:^P){for{if peof(p)||!rws(p.chs[p.i]){break}p.i+=1}}
rexp::proc(r:rune)->bool{return ril(r)||r=='+'||r=='-'||r=='/'||r=='*'}
parse::proc(inp:string,out:^[dynamic]Exp)->Err{p:=new(P);p.chs=strun(inp);
 for{pws(p);if peof(p){break}c:=p.chs[p.i];
  if rdig(c){st:=p.i;p.i+=1;for{if peof(p){break};c=p.chs[p.i];if !rdig(c){break}p.i+=1}r,isn:=pint(runst(p.chs[st:p.i]));if !isn{return ptf("invalid int: %s",p.chs[st:p.i])};ap(out,r)}
  else if rexp(c){st:=p.i;p.i+=1;for{if peof(p){break}c=p.chs[p.i];if !rexp(c){break}p.i+=1}ap(out,Ref{runst(p.chs[st:p.i])})}
  else{return ptf("invalid char: %v",c)}
 }return nil
}
expprint::proc(exp:Exp){switch ex in exp{
 case int:p(ex)
 case Ref:p(ex.v)
}}
stprint::proc(st:[]Exp){for x,i in st{expprint(x);if i!=len(st)-1{p(" ")}}}
stpeek::proc(st:^St)->(Exp,Err){if len(st)==0{return nil,"tried to peek on an empty stack"}return st[len(st)-1],nil}
stpop::proc(st:^St)->(Exp,Err){if len(st)==0{return nil,"tried to pop off an empty stack"}return pop(st),nil}
stpopi::proc(st:^St)->(out:int,err:Err){x:=stpop(st)or_return;res,ok:=x.(int);if !ok{return {},ptf("expected an int, but got %s",x)}return res,nil}
stdup::proc(st:^St)->(err:Err){x:=stpop(st)or_return;ap(st,x);ap(st,x);return nil}
eval::proc(exps:[]Exp)->(out:[]Exp,err:Err){st:=new([dynamic]Exp);
 for exp in exps{switch ex in exp{
  case int:ap(st,exp)
  case Ref:switch ex.v{
   case"+":b:=stpopi(st)or_return;a:=stpopi(st)or_return;ap(st,a+b)
   case"-":b:=stpopi(st)or_return;a:=stpopi(st)or_return;ap(st,a-b)
   case"*":b:=stpopi(st)or_return;a:=stpopi(st)or_return;ap(st,a*b)
   case"/":b:=stpopi(st)or_return;a:=stpopi(st)or_return;ap(st,a/b)
   case"p":expprint(stpop(st)or_return);pln()
   case"d":stdup(st)or_return
   case:return nil,ptf("Undefined ref: %s", ex.v)
  }
 }}return st[:],nil
}
```

I understand if you are concerned about my mental state after reading it.
As crazy as it looks, it was actually pleasant to write.
This style felt slightly faster to write than the "proper" C-style formatting that is common.

And I think there are some interesting psychological benefits as well.

## Brevity begets simplicity

Extremely concise syntax seems to encourage simpler design decisions.
Perhaps longer names are necessary to express more complex ideas, so preferring shorter names steered me away from complexity.
Or, maybe my perception of a concise program written in this style demands that the program also avoid complex logic.
Whatever the reason, I felt a compulsion to keep my logic and code as simple as possible while working in this style.
The Odin language also lends itself to this kind of simplicity, so that could be a factor too.

## Brevity begets understanding

<figure>
  <blockquote>
    I would have written a shorter letter, but I did not have the time.
  </blockquote>
  <figcaption>
    <cite><a href="https://en.wikipedia.org/wiki/Lettres_provinciales">Blaise Pascal</a></cite>
  </figcaption>
</figure>

Concise writing seems to demand a more mature understanding of the topic at hand.
Making the code as brief as possible required pondering it and looking for opportunities to simplify.
Writing in this style forced me to engage my mind more actively than I normally would have when writing this program.
Part of that could be a lack of familiarity with this style, but I think most of it is inherent to the conciseness of the code.

Like I mentioned earlier, keeping the code concise also makes it easier to keep more of it in mind at one time.
Most of the names in the code seem rather cryptic, but they came quite naturally while I was working on this.
You would think extremely concise code would be more difficult to understand, but so far, I feel like the opposite is true.

## Downsides

### Lack of familiarity

An overwhelming majority of programmers do not write code this way.
Even if this style is superior, programming (especially professionally) is often a team sport.
Programmers must work together (in-person, or across the barrier of time) on creating and updating code to achieve their goals.
If you are working on a project with other people, it is wise to work in a style they can understand and imitate.
Unless you are genius like Arthur Whitney, and then maybe you can force a team of people to work in your style.
As far as I am aware, I fall into the non-genius category, so I won't be writing code in this style at work for the foreseeable future.

### Potentially write-only

[Perl](https://en.wikipedia.org/wiki/Perl) has been characterized as being a "write-only" language, meaning it is easy or pleasant to write, but difficult to comprehend or change later.
I'm not sure whether this is true of Perl (I've only written a small amount of Perl 6, a.k.a. [Raku](https://raku.org/)).
But, this certainly could be true of code written in this concise style.
Since the program I wrote is fairly simple, I haven't had any trouble understanding what I wrote after the fact.
But, if this program were 10x or 100x times larger, I could see having trouble understanding parts of it, especially if months and years had passed since I last worked on it.
Although, I think most programmers have trouble coming back to projects regardless of what language and style they use.

## Conclusion

My takeaway is that this style of writing extremely concise code is not as crazy as it first appears.
Every programmer ought to try their hand at it and see what they think.
Software is more complex than ever before, and many modern software projects seem to require an exponential amount of effort and code to achieve a linear number of improvements or new features.
Perhaps revisiting the way we read and write code could help us rethink what makes code, and the software it comprises, good or bad.
The world needs more programmers who obsess over code quality, simplicity, and ease of understanding in the software they write.
