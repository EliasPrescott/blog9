---
title: "Building Emacs 31 with Tree-Sitter Support on MacOS"
date: "2026-07-01"
tags:
- emacs
- programming
---

These are quick instructions for downloading and building Emacs from source with tree-sitter support enabled on MacOS.
The process was *just* complicated enough that I wanted to document it for myself in the future.

```sh
brew install tree-sitter
git clone git://git.git.savannah.gnu.org/emacs.git
cd emacs/
git switch emacs-31
./autogen.sh
./configure --with-tree-sitter
make
make install
cp -r nextstep/Emacs.app /Applications/Emacs.app
```
