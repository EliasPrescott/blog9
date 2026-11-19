---
title: "From Logseq to Journaling"
date: "2026-11-18"
tags:
- journaling
cover:
  path: "cover.png"
  alt: "an ovoidal torus made of fine curved lines"
  summary: "Rejecting structure and writing more"
---

Due to switching machines for a short time, I stopped using Logseq for my daily note-taking. If you aren't aware, Logseq is a hierarchical note-taking app with a focus on interconnections between notes, similar to Obsidian. Many people using Logseq or Obsidian follow some kind of Zettelkasten philosophy for note-taking.

[Logseq](https://logseq.com/) (logseq.com)

[Zettelkasten](https://en.wikipedia.org/wiki/Zettelkasten) (wikipedia.org)

The reason I started using Logseq and Obsidian was to track connections between my notes over long periods of time. If I took notes on a topic like a book over many months, then I wanted one place where I could see all my related notes together. Logseq makes this easy. When you click into a node (basically a distinct topic that you have created formally or implicitly), then you can see back-links to all the other notes/nodes that reference it.

This is very useful and I won't downplay that just because I am moving away from it. I may even come back to using Logseq or a similar system in the future.

But I have been on a digital minimalism kick recently, so I opted for the simplest solution I could think of when I switched to a new machine. I created a journal directory and started keeping a markdown file with my daily work journal. Each day gets a new file, and I organize them in directories based on the year and month (e.g. 2026/11/18.md).

At first I tried to impose some kind of structure on the journals. I would add a "Reflections" section at the top, and then a "Schedule" section, and then a miscellaneous "Notes" section at the bottom. This worked okay, but it quickly felt artificial as time went on. If I am working on something in the middle of the day, and then I have a random thought that I want to record, why should I have to scroll down to the notes section? So after a few days, I started dumping every note into the file without worrying about structure too much.

The only structure I still (loosely) hold to is separating sections of the day with time-stamp markers. I will add headings (e.g. `# 3:07pm`) to indicate the time in which I am switching from one task to another. This helps me be more explicit about how I am using my time throughout the day.

Another change I made after a few days was to switch from markdown to using gemtext.

[A quick introduction to "gemtext" markup](https://geminiprotocol.net/docs/gemtext.gmi) (geminiprotocol.net)

Gemtext's simplicity falls right inline with my approach to journaling. It does impose some restrictions that can seem very limiting compared to markdown (no inline links!). But I learned to get used to it very quickly. Honestly the restrictions feel like they improve the quality of my notes. If a link is worth including and talking about, then it should be worth giving its own line in the document. This reminds me of one of the anti-patterns in software blogging, an over-reliance on links, which Michael Lynch talks about here (I might be violating the rule with this link but that's fine).

[Anti-Patterns in Software Blogging](https://refactoringenglish.com/blog/anti-patterns-software-blogging/#overreliance-on-links) (refactoringenglish.com)

I said earlier that I started using Logseq and Obsidian to track connections between notes over time. Now that I have become super-minimalist in my note-taking, how I am going to do that now?

Well I don't fully know to be honest, this is still new to me. For taking in-depth notes on technical books, I have tried creating a distinct file reserved for just that book. That approach seems to work well so far. My daily notes are essentially work notes and random musings, and then I can spin-off topic-specific journal files when the need arises.

Another solution for finding connections between notes is simple text-search. Since my journals are plain-text, I can use any standard tool for searching between files. I have NeoVim set up search my entire directory when I type `<Space>ss`. And a fuzzy search can help whenever you misspell a word in some journal files. If I ever end up with too many files, then it shouldn't be a big deal to index them all ahead of time for easier searching if I need to.

I'll close by talking about the impact of these changes. When I used Logseq, my bar for writing something down was pretty high. I thought I should only write down "important" things. But now that I have ditched most of the structure and I am using plain-text for my journaling, I have been writing significantly more. I scoped out a feature request recently by writing roughly a page worth of notes on how I might implement it. Even just a few weeks ago, I would have immediately started looking through code or trying to write a first-draft, and I would have missed a lot of finer details. But by journaling every thought and putting almost my entire thought process into the written word, I am forcing myself to think rigorously about the work I am doing. And that feels good.
