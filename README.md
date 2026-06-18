# Obsidian MV Dashboard

![Obsidian](https://img.shields.io/badge/Obsidian-DataviewJS-7C3AED?logo=obsidian)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

A personal dashboard for Obsidian built with DataviewJS. Shows GitHub contributions, weather, calendar, notepad, and kanban-style task cards — all in one view.

---

## Setup

1. Install the [Dataview](https://github.com/blacksmithgu/obsidian-dataview) plugin and enable **DataviewJS**
2. Create a new note and paste the script inside a `dataviewjs` code block
3. Set your username at the top:

```js
const USERNAME = "your-github-username";
```

4. Done — open the note

---

## Features

- **GitHub heatmap** — contribution graph for the current year
- **Weather** — 7-day forecast for Almaty via Open-Meteo (click a day for hourly detail)
- **File search** — fuzzy search across your vault
- **Calendar** — monthly view with per-day notes, persisted to `localStorage`
- **Notepad** — multi-tab scratchpad, auto-saved
- **Task cards** — 5 kanban columns with checkboxes, add/delete tasks

---

## Notes

- Weather is hardcoded to Almaty (`lat=43.25, lon=76.92`) — change coordinates in the fetch URL to use another city
- All data (notes, tasks, pads) is saved to `localStorage` under key `mv11`
- Requires Dataview plugin with JS queries enabled (`Settings → Dataview → Enable JavaScript Queries`)
