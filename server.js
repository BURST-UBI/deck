import { createServer } from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(__dirname, "dist");
const PORT = process.env.PORT || 10000;
const ADMIN_KEY = process.env.ADMIN_KEY || "burst2026";

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

// Static file server
const server = createServer((req, res) => {
  let filePath = join(DIST, req.url === "/" ? "index.html" : req.url);

  // SPA fallback — if file doesn't exist, serve index.html
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(DIST, "index.html");
  }

  try {
    const data = readFileSync(filePath);
    const ext = extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

// WebSocket on same server
let currentSlide = 0;
let adminConnected = false;
const clients = new Set();
const wss = new WebSocketServer({ server });

function hasAdmin() {
  for (const c of clients) if (c.isAdmin) return true;
  return false;
}

function broadcastPresence(live) {
  for (const c of clients) {
    if (!c.isAdmin && c.readyState === 1) {
      c.send(JSON.stringify({ type: "presence", live }));
    }
  }
}

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.isAdmin = false;

  // Only tell client about presenter if admin is actually connected
  const live = hasAdmin();
  ws.send(JSON.stringify({ type: "presence", live }));
  if (live) ws.send(JSON.stringify({ type: "sync", slide: currentSlide }));

  ws.on("message", (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    if (msg.type === "auth") {
      if (msg.key === ADMIN_KEY) {
        ws.isAdmin = true;
        ws.send(JSON.stringify({ type: "auth", ok: true }));
        broadcastPresence(true);
      } else {
        ws.send(JSON.stringify({ type: "auth", ok: false }));
      }
      return;
    }

    if (msg.type === "slide" && ws.isAdmin) {
      currentSlide = msg.slide;
      for (const c of clients) {
        if (c !== ws && c.readyState === 1) {
          c.send(JSON.stringify({ type: "sync", slide: currentSlide }));
        }
      }
    }
  });

  ws.on("close", () => {
    const wasAdmin = ws.isAdmin;
    clients.delete(ws);
    if (wasAdmin) broadcastPresence(hasAdmin());
  });
});

server.listen(PORT, () => {
  console.log(`BURST deck + sync on http://localhost:${PORT}  (key: ${ADMIN_KEY})`);
});
