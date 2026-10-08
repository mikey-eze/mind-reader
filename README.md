# MindLab — Age Guessing Game

A polished, mobile-first version of the classic mathematical age-card trick.

## What it does

Think of your age from **1 to 63**. The game shows six randomized number cards. For each card, answer **YES** when your age appears and **NO** otherwise. After the sixth card, MindLab reconstructs your age.

No backend, account, camera, or API is required.

## The trick

The six cards represent the binary place values:

- 1
- 2
- 4
- 8
- 16
- 32

Every number from 1–63 is a unique combination of those values. When you select YES on a card, its value is added to the total.

## Features

- Responsive mobile-first UI
- Randomized card number positions
- Animated analysis/reveal sequence
- Sound effects with mute toggle
- Share result button
- Built-in explanation of the binary trick
- Reduced-motion support
- Static deployment friendly

## Run locally

Open `index.html` directly in a browser, or use any static server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy

This is a static website and works with GitHub Pages, Vercel, Netlify, or any static host.

## Project structure

```text
mind-reader/
├── index.html
├── style.css
├── script.js
└── README.md
```

## License

Use, remix, and learn from it freely.


<!-- GitHub Pages deployment trigger -->
