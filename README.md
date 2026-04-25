# Personal Assistant FE

A modern personal AI assistant frontend built with React + Vite.

## Features

- Chat interface with AI assistant
- Conversation history (saved to localStorage)
- Markdown rendering with syntax highlighting
- Dark / Light mode
- Fully responsive
- Vercel-ready deployment

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of your personal assistant backend API |
| `VITE_API_KEY` | Optional API key for backend auth |

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy

No extra configuration needed — `vercel.json` handles SPA routing.

## Tech Stack

- [React 18](https://react.dev)
- [Vite 6](https://vite.dev)
- [react-markdown](https://github.com/remarkjs/react-markdown)
