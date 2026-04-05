# joplin-image-alt-text

A Joplin plugin that automatically generates descriptive alt text for images
in your notes using GPT-4o or Gemini 1.5 Flash. It caches results locally
with SQLite and never overwrites alt text you've written yourself.

## Features

- Scans all image resources across your Joplin notes
- Generates alt text via OpenAI GPT-4o or Google Gemini 1.5 Flash
- SQLite-backed cache — images are only sent to the API once
- Safe rewriting — only fills empty alt text, never overwrites yours
- Exponential backoff for API rate limits
- Settings panel with progress bar and label review log

## Project Structure
```
src/
  index.ts                   — entry point, registers commands and settings
  scanner/
    ResourceScanner.ts       — paginates resources, downloads image binaries
    NoteUpdater.ts           — finds and rewrites alt text in Markdown
  api/
    VisionAdapter.ts         — shared interface for vision backends
    OpenAIAdapter.ts         — GPT-4o implementation
    GeminiAdapter.ts         — Gemini 1.5 Flash implementation
  cache/
    LabelCache.ts            — SQLite-backed hash → label store
  utils/
    retry.ts                 — exponential backoff with jitter
  ui/
    SettingsPanel.tsx        — settings registration and panel UI
```

## Installation

1. Open Joplin → Tools → Options → Plugins
2. Search for `image-alt-text` or install manually via `.jpl` file
3. Restart Joplin

## Setup

1. Go to Tools → Options → Image Alt Text
2. Paste your OpenAI or Google API key
3. Select your preferred model
4. Click Scan Notes

## How It Works

1. Enumerates all image resources via Joplin's Data API
2. Computes SHA-256 hash of each image binary
3. Checks local SQLite cache — skips if already labelled with current model
4. Sends uncached images to the selected vision API
5. Rewrites Markdown in each note, injecting labels into empty alt fields
6. Logs results in the UI for review

## Settings

| Setting | Description |
|---|---|
| API Key | Your OpenAI or Google API key (encrypted at rest) |
| Model | GPT-4o or Gemini 1.5 Flash |
| Clear Cache | Forces re-labelling of all images on next scan |

## Development

Built with TypeScript and bundled with Webpack. No framework — just the Joplin plugin API.
```bash
npm install       # install dependencies
npm run dev       # watch mode, outputs to dist/
npm run build   
```

Requires Joplin desktop running with the plugin loaded from `dist/`.

## License

[MIT](./LICENSE)
