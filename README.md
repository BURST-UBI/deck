# BURST Deck

Interactive presentation introducing BURST, its currency and protocol. Built
with React and Vite, with a WebSocket server for synchronized presenter and
audience views.

## Development

With Node.js installed:

```sh
npm ci
npm run dev
```

To serve the built deck with presentation synchronization:

```sh
npm run build
ADMIN_KEY='your-presenter-password' npm start
```

Open `http://localhost:10000`. Set `PORT` to use another port and choose your own
`ADMIN_KEY` before sharing a presentation.

Slides and interactions live in `src/BURST_Deck.jsx`; `server.js` serves the
built site and synchronizes slides.

[Read about BURST](https://brst.cc) · [Protocol source](https://github.com/BURST-UBI/protocol)
