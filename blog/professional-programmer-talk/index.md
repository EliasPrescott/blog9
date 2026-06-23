---
title: "Being a Professional Programmer"
date: "2026-05-04"
tags:
- programming
---

These are notes for a presentation I gave on being a professional programmer.
I gave this talk to two separate classes of programming students, so the advice is aimed at young adults looking to make a career in software development.

---

### Soft Skills

- Caring for people
  - Every job is people-oriented. All work ultimately is about serving people.
  - Showing people that you care about them is one of the most important things you can do in work or life in general.


- Attention to detail
  - Attention to detail is "the act or state of applying the mind to something."
  - Practical applications:
    - Active concentration on work.
    - Good note-taking (Lookup "zettlekasten". Look into tools like Obsidian or LoqSeq.)
    - Studying the problem domain or documentation (more on this later).


- Connecting with people through small talk or humor
  - Not easy for most programmers, but it's important for any job.
  - Second to caring, this is the best way to get people to open up.


- Good writing skills
  - Lots of communication happens through writing (email, messages, technical documentation).
  - "Besides a mathematical inclination, an exceptionally good mastery of one's native tongue is the most vital asset of a competent programmer." - Edsger Dijkstra


- Passion for the work
  - This has been one of the best skills for my career.
  - This skill motivates me to develop all the other skills.


- Ability to learn new things
  - IT as an industry changes incredibly quickly.
  - There will always be new technologies to evaluate and learn, but very few of them are worth learning.


- Good reading comprehension
  - As a programmer, I read a ton of technical content (articles, code, documentation) each week.
  - Skimming is a valuable skill.
  - Read to get a general overview, and then come back whenever you have a specific need.

### Other Topics

- Web Development
  - Web development was my entry into the industry (I got a part-time job in it in college).
  - It is probably the easiest way to enter the industry because some web dev jobs have a low barrier to entry.
  - You can specialize in frontend or backend only, but I prefer full-stack.
  - Don't focus on frameworks, focus on the medium: HTML, CSS, JavaScript, SQL.
  - But, also learn some popular frameworks because they are useful and good for your resume.


- Becoming a subject matter expert
  - Working as a programmer is rarely just about programming.
  - As a programmer, you are in a unique position to learn and leverage business knowledge.
  - Understanding how the business works can inform lots of technical decisions.
  - It also helps you comprehend and work with the business' data.
  - Being a good learner is essential here. I have recently been learning a lot about accounting because I am working on our app's accounting features.


- Being a Specialist vs a Generalist
  - IT is such a large field. Specializing in a specific area can help you focus on mastering a smaller subset of skills.
  - Large companies have a need for specialists, but smaller companies typically want generalists.
  - I would recommend being a generalist unless someone is paying you to specialize.
  - I have learned so much from being open to new tasks or responsibilities. Being a generalist lets me constantly work on new domains or new types of problems.
  - The hardest problems cross multiple layers of an application (frontend, backend, database, etc.), so being a generalist and having holistic knowledge puts you in the best position to solve difficult problems.


- Development Workflow
  - Knowing your tools can be a huge boost to productivity and makes work more fun.
  - I like using a non-standard editor (NeoVim), but learning some advanced shortcuts will make your experience better with any editor.
  - This ties in with the Unix philosophy where text-based tools start to compose, so your knowledge of different tools can compound.
  - Learning common unix/posix terminal utilities can be a big productivity boost.
  - Learning a little Bash (the shell & the scripting language) goes a long way. If you are on Windows, you can still use Git Bash for a similar experience.
  - The easiest wins:
    - Shortcuts to run/build your project.
    - Find a way to visually surface errors without tons of context switching (terminal or an in-editor LSP).
    - Shortcuts to switch between windows (lookup "tiling window managers" to get an idea).
    - If you are in web development, learn to use the browser's DevTools! I use the DevTools on almost every bug I triage.
    - Learn Git or your VCS of choice well. Use a visual tool to make Git easier (lazygit, magit, or whatever VSCode plugin is popular these days).


- Functional Programming
  - Functional programming is an alternative paradigm to object-oriented programming (OOP).
  - Neither paradigm is the be-all and end-all, but learning both is beneficial.
  - Generally, functional programming includes:
    - separating data from behavior,
    - avoiding mutation and restricting side effects,
    - using algebraic data types (records, discriminated unions),
    - using recursion over iteration.
  - If you have used C# before, F# is a great introduction to functional programming.
  - If you are feeling more adventerous, OCaml and Haskell can be lots of fun, but their tooling and ecosystems have some rough edges.


- Modern Low-Level Programming Languages
  - I just mentioned F#, OCaml, and Haskell, but there are other languages that I think are worth trying.
  - If you are looking for an alternative to C/C++, Odin and Zig are lots of fun.
  - I especially love Odin because it's very pragmatic and elegantly designed.
  - Odin also comes bundled with some third-party dependencies like Raylib, so making simple games with it is really easy.
