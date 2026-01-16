import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";

const assetManifest = JSON.parse(manifestJSON);

interface Entry {
  id: number;
  date: string;
  points: number;
  created_at: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // API routes
    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env, url);
    }

    // Static assets
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: assetManifest,
        }
      );
    } catch (e) {
      try {
        const notFoundRequest = new Request(new URL("/index.html", request.url).toString(), request);
        return await getAssetFromKV(
          {
            request: notFoundRequest,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: assetManifest,
          }
        );
      } catch {
        return new Response("Not Found", { status: 404 });
      }
    }
  },
};

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (url.pathname === "/api/entries") {
      if (request.method === "GET") {
        return await getEntries(env, url, corsHeaders);
      }
      if (request.method === "POST") {
        return await createEntry(request, env, corsHeaders);
      }
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

async function getEntries(env: Env, url: URL, corsHeaders: Record<string, string>): Promise<Response> {
  const today = url.searchParams.get("today");

  const { results: entries } = await env.DB.prepare(
    "SELECT * FROM entries ORDER BY date DESC"
  ).all<Entry>();

  const total = entries.reduce((sum, entry) => sum + entry.points, 0);

  const todayEntry = today ? entries.find((e) => e.date === today) ?? null : null;

  return new Response(
    JSON.stringify({
      entries,
      total,
      todayEntry,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

async function createEntry(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const body = await request.json() as { date: string; points: number };
  const { date, points } = body;

  if (!date || typeof points !== "number") {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (![1, 0.5, 0.25].includes(points)) {
    return new Response(JSON.stringify({ error: "Points must be 1, 0.5, or 0.25" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  await env.DB.prepare(
    "INSERT INTO entries (date, points) VALUES (?, ?) ON CONFLICT(date) DO UPDATE SET points = ?"
  )
    .bind(date, points, points)
    .run();

  const entry = await env.DB.prepare("SELECT * FROM entries WHERE date = ?")
    .bind(date)
    .first<Entry>();

  return new Response(JSON.stringify({ entry }), {
    status: 201,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
