---
title: "Making a Lichess TV Viewer with Hyperscript"
date: "2026-04-16"
icon: "chess-knight"
tags:
- chess
- hyperscript
---

[Hyperscript](https://hyperscript.org/) is an alternative scripting language for the web that optimizes for clean syntax and elegant interactions with the browser DOM APIs. It is very pleasant to work in. I had to bounce back and force between my editor and the language documentation, but I got the hang of it pretty quickly.

To kick the tires on it, I made [Lichess TV](https://eliasprescott.github.io/lichess-tv) for watching live chess games.

My favorite piece of Hyperscript that I wrote is this snippet for fetching the Lichess TV API route and sending the game updates to another element as custom events.

```hyperscript
init
  fetch https://lichess.org/api/tv/feed as Response
  set $stream to it's body
  for x in $stream
    send fen(update: parseChunk(x)) to #board
  end
end
```

Maybe it's not the most practical for everyday use, but it does feel nice to write...
